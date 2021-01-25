import React from 'react';
import styled from 'styled-components';

import farmer from '../../assets/img/basis_logo.svg';

const Logo: React.FC = () => {
  return (
    <StyledLogo>
      <img src={farmer} height="50" style={{ marginTop: 0 }} />
      <StyledLink href="/">Basis Gold</StyledLink>
    </StyledLogo>
  );
};

const StyledLogo = styled.div`
  align-items: center;
  display: flex;
`;

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[100]};
  text-decoration: none;
  font-size: 18px;
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing[2]}px;
`;

export default Logo;
