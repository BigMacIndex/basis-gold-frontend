import { useCallback, useEffect, useState } from 'react';
import useBasisGold from './useBasisGold';
import { TokenStat } from '../basis-gold/types';
import config from '../config';

const useBondStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const basisGold = useBasisGold();

  const fetchBondPrice = useCallback(async () => {
    setStat(await basisGold.getBondStat());
  }, [basisGold]);

  useEffect(() => {
    fetchBondPrice().catch((err) => console.error(`Failed to fetch BSGB price: ${err.stack}`));
    const refreshInterval = setInterval(fetchBondPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setStat, basisGold]);

  return stat;
};

export default useBondStats;
