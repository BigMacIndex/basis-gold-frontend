import { useCallback, useEffect, useState } from 'react';
import useBasisGold from './useBasisGold';
import config from '../config';
import { BigNumber } from 'ethers';

const useRealGoldPrice = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const basisGold = useBasisGold();

  const fetchGoldPrice = useCallback(async () => {
    setPrice(await basisGold.getRealGoldPrice());
  }, [basisGold]);

  useEffect(() => {
    fetchGoldPrice().catch((err) => console.error(`Failed to fetch real gold price: ${err.stack}`));
    const refreshInterval = setInterval(fetchGoldPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, basisGold]);

  return price;
};

export default useRealGoldPrice;
