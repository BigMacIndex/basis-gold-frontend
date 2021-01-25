import React from 'react';
import styled from 'styled-components';

import bacLogo from '../../assets/img/basis-gold-logo.svg';
import basLogo from '../../assets/img/basis-share-logo.svg';
import babLogo from '../../assets/img/basis-bond-logo.svg';
import DAILogo from '../../assets/img/DAI.png';
import DSDLogo from '../../assets/img/DSD.png';
import ESDLogo from '../../assets/img/ESD.png';
import BACLogo from '../../assets/img/BAC.png';
import SXAULogo from '../../assets/img/SXAU.png';
import BUILDETHLogo from '../../assets/img/BUILDETH.png';

const logosBySymbol: {[title: string]: string} = {
  'BSG': bacLogo,
  'BSGB': babLogo,
  'BSGS': basLogo,
  'DAI': DAILogo,
  'DSD': DSDLogo,
  'ESD': ESDLogo,
  'BAC': BACLogo,
  'SXAU': SXAULogo,
  'BUILD-ETH': BUILDETHLogo,
  'BSG-DAI': bacLogo,
  'BSGS-DAI': basLogo,
};

type BasisLogoProps = {
  symbol: string;
  size?: number;
}

const LogoWrapper = styled.div`
  text-align: center;
`;

const TokenSymbol: React.FC<BasisLogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    throw new Error(`Invalid BasisLogo symbol: ${symbol}`);
  }
  return (
    <LogoWrapper>
      <img
        src={logosBySymbol[symbol]}
        alt={`${symbol} Logo`}
        width={size}
        height={size}
      />
    </LogoWrapper>
  )
};

export default TokenSymbol;
