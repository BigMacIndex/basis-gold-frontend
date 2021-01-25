import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20 from '../basis-gold/ERC20';
import useBasisGold from './useBasisGold';
import config from '../config';

const useTokenBalance = (token: ERC20) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const basisGold = useBasisGold();

  const fetchBalance = useCallback(async () => {
    setBalance(await token.balanceOf(basisGold.myAccount));
  }, [basisGold?.isUnlocked, token]);

  useEffect(() => {
    if (basisGold?.isUnlocked) {
      fetchBalance().catch((err) =>
        console.error(`Failed to fetch token balance: ${err.stack}`),
      );
      let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [basisGold?.isUnlocked, token]);

  return balance;
};

export default useTokenBalance;
