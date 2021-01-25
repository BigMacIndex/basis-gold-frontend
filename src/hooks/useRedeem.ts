import { useCallback } from 'react';
import useBasisGold from './useBasisGold';
import { Bank } from '../basis-gold';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeem = (bank: Bank) => {
  const basisGold = useBasisGold();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    handleTransactionReceipt(basisGold.exit(bank.contract), `Redeem ${bank.contract}`);
  }, [bank, basisGold]);

  return { onRedeem: handleRedeem };
};

export default useRedeem;
