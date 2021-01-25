import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useBasisGold from './useBasisGold';

const useTreasuryAmount = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const basisGold = useBasisGold();


  useEffect(() => {
    if (basisGold) {
      const { Treasury } = basisGold.contracts;
      basisGold.BSG.balanceOf(Treasury.address).then(setAmount);
    }
  }, [basisGold]);
  return amount;
};

export default useTreasuryAmount;
