import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useBasisGold from '../../hooks/useBasisGold';
import { Bank } from '../../basis-gold';
import config, { bankDefinitions } from '../../config';

const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const basisGold = useBasisGold();

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!basisGold.isUnlocked) continue;

        // only show pools staked by user
        const balance = await basisGold.stakedBalanceOnBank(bankInfo.contract, basisGold.myAccount);
        if (balance.lte(0)) {
          continue;
        }
      }
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: basisGold.externalTokens[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName == 'BSG' ? basisGold.BSG : basisGold.BSGS,
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [basisGold, basisGold?.isUnlocked, setBanks]);

  useEffect(() => {
    if (basisGold) {
      fetchPools()
        .catch(err => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [basisGold, basisGold?.isUnlocked, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;
