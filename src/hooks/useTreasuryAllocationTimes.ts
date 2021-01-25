import { useEffect, useState } from 'react';
import useBasisGold from './useBasisGold';
import config from '../config';
import { TreasuryAllocationTime } from '../basis-gold/types';

const useTreasuryAllocationTimes = () => {
  const [time, setTime] = useState<TreasuryAllocationTime>({
    prevAllocation: new Date(),
    nextAllocation: new Date(),
  });
  const basisGold = useBasisGold();

  useEffect(() => {
    if (basisGold) {
      basisGold.getTreasuryNextAllocationTime().then(setTime);
    }
  }, [basisGold]);
  return time;
};

export default useTreasuryAllocationTimes;
