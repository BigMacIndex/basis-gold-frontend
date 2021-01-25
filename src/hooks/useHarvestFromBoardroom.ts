import { useCallback } from 'react';
import useBasisGold from './useBasisGold';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromBoardroom = () => {
  const basisGold = useBasisGold();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(basisGold.harvestGoldFromBoardroom(), 'Claim BSG from Boardroom');
  }, [basisGold]);

  return { onReward: handleReward };
};

export default useHarvestFromBoardroom;
