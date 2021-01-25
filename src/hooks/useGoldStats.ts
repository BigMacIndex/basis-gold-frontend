import { useCallback, useEffect, useState } from 'react';
import useBasisGold from './useBasisGold';
import { TokenStat } from '../basis-gold/types';
import config from '../config';

const useGoldStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const basisGold = useBasisGold();

  const fetchGoldPrice = useCallback(async () => {
    setStat(await basisGold.getGoldStatFromUniswap());
  }, [basisGold]);

  useEffect(() => {
    fetchGoldPrice().catch((err) => console.error(`Failed to fetch BSG price: ${err.stack}`));
    const refreshInterval = setInterval(fetchGoldPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setStat, basisGold]);

  return stat;
};

export default useGoldStats;
