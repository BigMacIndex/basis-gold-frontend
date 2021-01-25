import { Fetcher, Route, Token } from '@uniswap/sdk';
import { Configuration } from './config';
import { ContractName, TokenStat, TreasuryAllocationTime } from './types';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import { parseUnits } from 'ethers/lib/utils';

/**
 * An API module of Basis Gold contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class BasisGold {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  boardroomVersionOfUser?: string;

  bsgDai: Contract;
  BSG: ERC20;
  BSGS: ERC20;
  BSGB: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal); // TODO: add decimal
    }
    this.BSG = new ERC20(deployments.Gold.address, provider, 'BSG');
    this.BSGS = new ERC20(deployments.Share.address, provider, 'BSGS');
    this.BSGB = new ERC20(deployments.Bond.address, provider, 'BSGB');

    // Uniswap V2 Pair
    this.bsgDai = new Contract(
      externalTokens['BSG-DAI'][0],
      IUniswapV2PairABI,
      provider,
    );

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);

    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.BSG, this.BSGS, this.BSGB, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.bsgDai = this.bsgDai.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchBoardroomVersionOfUser()
      .then((version) => (this.boardroomVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.boardroomVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  gasOptions(gas: BigNumber): Overrides {
    const multiplied = Math.floor(gas.toNumber() * this.config.gasLimitMultiplier);
    console.log(`⛽️ Gas multiplied: ${gas} -> ${multiplied}`);
    return {
      gasLimit: BigNumber.from(multiplied),
    };
  }

  /**
   * @returns Basis Gold (BSG) stats from Uniswap.
   * It may differ from the BSG price used on Treasury (which is calculated in TWAP)
   */
  async getGoldStatFromUniswap(): Promise<TokenStat> {
    const supply = await this.BSG.displayedTotalSupply();
    const goldPrice = Number(await this.getTokenPriceFromUniswap(this.BSG))
    const realGoldPrice = Number(await this.getRealGoldPrice()) / 10**18

    return {
      priceInDAI: String((goldPrice / realGoldPrice).toFixed(3)),
      totalSupply: supply,
    };
  }

  /**
   * @returns Estimated Basis Gold (BSG) price data,
   * calculated by 1-day Time-Weight Averaged Price (TWAP).
   */
  async getGoldStatInEstimatedTWAP(): Promise<TokenStat> {
    const { Oracle } = this.contracts;

    const estimatedGoldPrice = await Oracle.price1Current();
    const realGoldPrice = await this.getRealGoldPrice()
    const totalSupply = await this.BSG.displayedTotalSupply();

    return {
      priceInDAI: String((Number(estimatedGoldPrice) / Number(realGoldPrice)).toFixed(3)),
      totalSupply,
    };
  }

  async getGoldPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getGoldPrice();
  }

  async getRealGoldPrice(): Promise<BigNumber> {
    const { Oracle } = this.contracts;
    return Oracle.goldPriceOne();
  }

  async getBondStat(): Promise<TokenStat> {
    const realGoldPrice = Number(await this.getRealGoldPrice());
    const goldPrice = Number(await this.getGoldPriceInLastTWAP());

    const bondPrice = 1 / (goldPrice / realGoldPrice)

    return {
      priceInDAI: String(bondPrice.toFixed(3)),
      totalSupply: await this.BSGB.displayedTotalSupply(),
    };
  }

  async getShareStat(): Promise<TokenStat> {
    const price = await this.getTokenPriceFromUniswap(this.BSGS)
    return {
      priceInDAI: price,
      totalSupply: await this.BSGS.displayedTotalSupply(),
    };
  }

  async getTokenPriceFromUniswap(tokenContract: ERC20): Promise<string> {
    await this.provider.ready;

    const { chainId } = this.config;
    const { DAI } = this.config.externalTokens;

    const dai = new Token(chainId, DAI[0], 18);
    const token = new Token(chainId, tokenContract.address, 18);

    try {
      const daiToToken = await Fetcher.fetchPairData(dai, token, this.provider);
      const priceInDAI = new Route([daiToToken], token);
      return priceInDAI.midPrice.toSignificant(3);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  /**
   * Buy bonds with gold.
   * @param amount amount of gold to purchase bonds with.
   */
  async buyBonds(amount: string | number, targetPrice: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.buyBonds(decimalToBalance(amount), targetPrice);
  }

  /**
   * Redeem bonds for gold.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    return await Treasury.redeemBonds(decimalToBalance(amount));
  }

  async earnedFromBank(poolName: ContractName, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.earned(account);
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(
    poolName: ContractName,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      return await pool.balanceOf(account);
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.stake(amount);
    return await pool.stake(amount, this.gasOptions(gas));
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.withdraw(amount);
    return await pool.withdraw(amount, this.gasOptions(gas));
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.getReward();
    return await pool.getReward(this.gasOptions(gas));
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    const gas = await pool.estimateGas.exit();
    return await pool.exit(this.gasOptions(gas));
  }

  async fetchBoardroomVersionOfUser(): Promise<string> {
    const { Boardroom } = this.contracts;
    // const balance1 = await Boardroom.getShareOf(this.myAccount);
    // if (balance1.gt(0)) {
    //   console.log(
    //     `👀 The user is using Boardroom v1. (Staked ${getDisplayBalance(balance1)} BSGS)`,
    //   );
    //   return 'v1';
    // }
    // const balance2 = await Boardroom2.balanceOf(this.myAccount);
    // if (balance2.gt(0)) {
    //   console.log(
    //     `👀 The user is using Boardroom v2. (Staked ${getDisplayBalance(balance2)} BSGS)`,
    //   );
    //   return 'v2';
    // }
    return 'latest';
  }

  boardroomByVersion(version: string): Contract {
    // if (version === 'v1') {
    //   return this.contracts.Boardroom1;
    // }
    // if (version === 'v2') {
    //   return this.contracts.Boardroom2;
    // }
    return this.contracts.Boardroom;
  }

  currentBoardroom(): Contract {
    if (!this.boardroomVersionOfUser) {
      throw new Error('you must unlock the wallet to continue.');
    }
    return this.boardroomByVersion(this.boardroomVersionOfUser);
  }

  isOldBoardroomMember(): boolean {
    return this.boardroomVersionOfUser !== 'latest';
  }

  async stakeShareToBoardroom(amount: string): Promise<TransactionResponse> {
    if (this.isOldBoardroomMember()) {
      throw new Error("you're using old Boardroom. please withdraw and deposit the BSGS again.");
    }
    const Boardroom = this.currentBoardroom();
    return await Boardroom.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getShareOf(this.myAccount);
    }
    return await Boardroom.balanceOf(this.myAccount);
  }

  async getEarningsOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getGoldEarningsOf(this.myAccount);
    }
    return await Boardroom.earned(this.myAccount);
  }

  async withdrawShareFromBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.withdraw(decimalToBalance(amount));
  }

  async harvestGoldFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.claimDividends();
    }
    return await Boardroom.claimReward();
  }

  async exitFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<TreasuryAllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const period: BigNumber = await Treasury.getPeriod();

    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(nextAllocation.getTime() - period.toNumber() * 1000);
    return { prevAllocation, nextAllocation };
  }
}
