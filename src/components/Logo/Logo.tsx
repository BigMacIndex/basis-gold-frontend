import React from 'react';
import styled from 'styled-components';

// import farmer from '../../assets/img/basis_logo.svg';
import farmer from '../../assets/img/hamburger.svg'

const Logo: React.FC = () => {
  return (
    <StyledLogo>
      <img src={farmer} height="30" style={{ marginTop: 10 }} alt="BigMac"/>
      {/* <StyledLink href="/">Big Mac Index</StyledLink> */}
    </StyledLogo>
  );
};

const StyledLogo = styled.div``;

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.black};
  text-decoration: none;
  font-size: 30px;
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing[2]}px;
`;

export default Logo;
