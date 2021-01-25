import { useContext } from 'react';
import { Context } from '../contexts/BasisGoldProvider';

const useBasisGold = () => {
  const { basisGold } = useContext(Context);
  return basisGold;
};

export default useBasisGold;
