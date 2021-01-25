import { useCallback, useEffect, useState } from 'react';
import useBasisGold from './useBasisGold';
import config from '../config';
import { BigNumber } from 'ethers';

const useGoldPriceInLastTWAP = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const basisGold = useBasisGold();

  const fetchGoldPrice = useCallback(async () => {
    setPrice(await basisGold.getGoldPriceInLastTWAP());
  }, [basisGold]);

  useEffect(() => {
    fetchGoldPrice().catch((err) => console.error(`Failed to fetch BSG price: ${err.stack}`));
    const refreshInterval = setInterval(fetchGoldPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, basisGold]);

  return price;
};

export default useGoldPriceInLastTWAP;
