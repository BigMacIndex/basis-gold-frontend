import { useCallback } from 'react';
import useBasisGold from './useBasisGold';
import { Bank } from '../basis-gold';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';

const useStake = (bank: Bank) => {
  const basisGold = useBasisGold();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      const amountBn = parseUnits(amount, bank.depositToken.decimal);
      handleTransactionReceipt(
        basisGold.stake(bank.contract, amountBn),
        `Stake ${amount} ${bank.depositTokenName} to ${bank.contract}`,
      );
    },
    [bank, basisGold],
  );
  return { onStake: handleStake };
};

export default useStake;
