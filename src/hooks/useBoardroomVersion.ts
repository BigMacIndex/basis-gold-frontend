import { useCallback, useEffect, useState } from 'react';
import useBasisGold from './useBasisGold';
import useStakedBalanceOnBoardroom from './useStakedBalanceOnBoardroom';

const useBoardroomVersion = () => {
  const [boardroomVersion, setBoardroomVersion] = useState('latest');
  const basisGold = useBasisGold();
  const stakedBalance = useStakedBalanceOnBoardroom();

  const updateState = useCallback(async () => {
    setBoardroomVersion(await basisGold.fetchBoardroomVersionOfUser());
  }, [basisGold?.isUnlocked, stakedBalance]);

  useEffect(() => {
    if (basisGold?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [basisGold?.isUnlocked, stakedBalance]);

  return boardroomVersion;
};

export default useBoardroomVersion;
