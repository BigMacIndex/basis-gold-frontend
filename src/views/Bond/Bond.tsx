import React, { useCallback, useMemo } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import ExchangeCard from './components/ExchangeCard';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useBondStats from '../../hooks/useBondStats';
import useBasisGold from '../../hooks/useBasisGold';
import useBondOraclePriceInLastTWAP from '../../hooks/useBondOraclePriceInLastTWAP';
import useRealGoldPrice from '../../hooks/useRealGoldPrice';
import { useTransactionAdder } from '../../state/transactions/hooks';
import config from '../../config';
import LaunchCountdown from '../../components/LaunchCountdown';
import ExchangeStat from './components/ExchangeStat';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import { BigNumber, Contract, ethers, Overrides } from 'ethers';

const Bond: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();
  const basisGold = useBasisGold();
  const addTransaction = useTransactionAdder();
  const bondStat = useBondStats();
  const goldPrice = useBondOraclePriceInLastTWAP();
  const realGoldPrice = useRealGoldPrice();

  const bondBalance = useTokenBalance(basisGold?.BSGB);

  const handleBuyBonds = useCallback(
    async (amount: string) => {
      var goldPriceFloat = Number(goldPrice) / 10**18
      const tx = await basisGold.buyBonds(amount, goldPrice.toString());
      const bondAmount = Number(amount) / Number(goldPriceFloat);
      addTransaction(tx, {
        summary: `Buy ${bondAmount.toFixed(3)} BSGB with ${amount} BSG`,
      });
    },
    [basisGold, addTransaction, goldPrice],
  );

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await basisGold.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} BSGB` });
    },
    [basisGold, addTransaction],
  );
  const goldIsOverpriced = useMemo(() => goldPrice.gt(realGoldPrice), [goldPrice]);
  const goldIsUnderPriced = useMemo(() => BigNumber.from(goldPrice) < realGoldPrice, [bondStat]);

  const isLaunched = Date.now() >= config.bondLaunchesAt.getTime();

  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader
                title="Buy & Redeem Bonds"
                subtitle="Earn premiums upon redemption"
              />
            </Route>
            <StyledBond>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Purchase"
                  fromToken={basisGold.BSG}
                  fromTokenName="Basis Gold"
                  toToken={basisGold.BSGB}
                  toTokenName="Basis Bond"
                  // priceDesc={
                  //   goldIsOverpriced
                  //     ? 'BSG is over Gold Price'
                  //     : goldIsUnderPriced
                  //     ? `${Math.floor(
                  //         100 / Number(goldPrice) - 100,
                  //       )}% return when BSG > Gold Price`
                  //     : '-'
                  // }
                  priceDesc='Buy Basis Gold Bond'
                  onExchange={handleBuyBonds}
                  disabled={ parseFloat(bondStat?.priceInDAI) < 1 }
                />
              </StyledCardWrapper>
              <StyledStatsWrapper>
                <ExchangeStat
                  tokenName="BSG / XAU"
                  description="BSG / XAU (Last-Day TWAP)"
                  price={String((Number(goldPrice) / Number(realGoldPrice)).toFixed(3))}
                />
                <Spacer size="md" />
                <ExchangeStat
                  tokenName="BSG"
                  description="BSGB = 1 / (BSG/XAU)"
                  price={ parseFloat(bondStat?.priceInDAI) > 1 ? bondStat?.priceInDAI + ' BSGB' : '-' }
                />
              </StyledStatsWrapper>
              <StyledCardWrapper>
                <ExchangeCard
                  action="Redeem"
                  fromToken={basisGold.BSGB}
                  fromTokenName="Basis Bond"
                  toToken={basisGold.BSG}
                  toTokenName="Basis Gold"
                  priceDesc={`${getDisplayBalance(bondBalance)} BSGB Available`}
                  onExchange={handleRedeemBonds}
                  disabled={!bondStat || bondBalance.eq(0) || goldIsUnderPriced}
                />
              </StyledCardWrapper>
            </StyledBond>
          </>
        ) : (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Button onClick={() => connect('injected')} text="Unlock Wallet" />
          </div>
        )}
      </Page>
    </Switch>
  );
};

const StyledBond = styled.div`
  display: flex;
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledStatsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  margin: 0 20px;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 80%;
    margin: 16px 0;
  }
`;

export default Bond;
