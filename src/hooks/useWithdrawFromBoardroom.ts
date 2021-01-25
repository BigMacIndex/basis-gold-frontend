import { useCallback } from 'react';
import useBasisGold from './useBasisGold';
import { Bank } from '../basis-gold';
import { useTransactionAdder } from '../state/transactions/hooks';
import { BigNumber } from 'ethers';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromBoardroom = () => {
  const basisGold = useBasisGold();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        basisGold.withdrawShareFromBoardroom(amount),
        `Withdraw ${amount} BSGS from the boardroom`,
      );
    },
    [basisGold],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawFromBoardroom;
