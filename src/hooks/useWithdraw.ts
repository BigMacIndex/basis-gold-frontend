import { useCallback } from 'react';
import useBasisGold from './useBasisGold';
import { Bank } from '../basis-gold';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useWithdraw = (bank: Bank) => {
  const basisGold = useBasisGold();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      const amountBn = parseUnits(amount, bank.depositToken.decimal);
      handleTransactionReceipt(
        basisGold.unstake(bank.contract, amountBn),
        `Withdraw ${amount} ${bank.depositTokenName} from ${bank.contract}`,
      );
    },
    [bank, basisGold],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdraw;
