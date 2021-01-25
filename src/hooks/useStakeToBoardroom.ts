import { useCallback } from 'react';
import useBasisGold from './useBasisGold';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToBoardroom = () => {
  const basisGold = useBasisGold();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        basisGold.stakeShareToBoardroom(amount),
        `Stake ${amount} BSGS to the boardroom`,
      );
    },
    [basisGold],
  );
  return { onStake: handleStake };
};

export default useStakeToBoardroom;
