import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
      {/* <StyledLink href="https://uniswap.exchange" target="_blank">Buy BSG</StyledLink>
      <StyledLink href="https://uniswap.exchange" target="_blank">Buy BSGS</StyledLink> */}
      <StyledLink href="https://github.com/build-finance/basis-gold-protocol" target="_blank">GitHub</StyledLink>
      <StyledLink href="https://twitter.com/GoldBasis" target="_blank">Twitter</StyledLink>
      <StyledLink href="https://t.me/GoldBasis" target="_blank">Telegram</StyledLink>
      <StyledLink href="https://discord.gg/XfBwghzfTq" target="_blank">Discord</StyledLink>
      <StyledLink href="https://medium.com/basis-gold" target="_blank">Medium</StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${props => props.theme.color.grey[400]};
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.grey[500]};
  }
`

export default Nav