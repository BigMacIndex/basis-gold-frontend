import { useCallback } from 'react';
import useBasisGold from './useBasisGold';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnBoardroom = (description?: string) => {
  const basisGold = useBasisGold();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem BSGS from Boardroom';
    handleTransactionReceipt(basisGold.exitFromBoardroom(), alertDesc);
  }, [basisGold]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnBoardroom;
