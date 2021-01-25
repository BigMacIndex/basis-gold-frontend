import { useCallback } from 'react';
import useBasisGold from './useBasisGold';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { Bank } from '../basis-gold';

const useHarvest = (bank: Bank) => {
  const basisGold = useBasisGold();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(
      basisGold.harvest(bank.contract),
      `Claim ${bank.earnTokenName} from ${bank.contract}`,
    );
  }, [bank, basisGold]);

  return { onReward: handleReward };
};

export default useHarvest;
