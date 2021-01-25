import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBasisGold from './useBasisGold';
import config from '../config';

const useEarningsOnBoardroom = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const basisGold = useBasisGold();

  const fetchBalance = useCallback(async () => {
    setBalance(await basisGold.getEarningsOnBoardroom());
  }, [basisGold?.isUnlocked]);

  useEffect(() => {
    if (basisGold?.isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [basisGold?.isUnlocked, setBalance]);

  return balance;
};

export default useEarningsOnBoardroom;
