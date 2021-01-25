import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import BasisGold from '../../basis-gold';
import config from '../../config';

export interface BasisGoldContext {
  basisGold?: BasisGold;
}

export const Context = createContext<BasisGoldContext>({ basisGold: null });

export const BasisGoldProvider: React.FC = ({ children }) => {
  const { ethereum, account } = useWallet();
  const [basisGold, setBasisGold] = useState<BasisGold>();

  useEffect(() => {
    if (!basisGold) {
      const basis = new BasisGold(config);
      if (account) {
        // wallet was unlocked at initialization
        basis.unlockWallet(ethereum, account);
      }
      setBasisGold(basis);
    } else if (account) {
      basisGold.unlockWallet(ethereum, account);
    }
  }, [account]);

  return <Context.Provider value={{ basisGold }}>{children}</Context.Provider>;
};
