import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import LaunchCountdown from '../../components/LaunchCountdown';
import Spacer from '../../components/Spacer';
import HomeCard from './components/HomeCard';
import { OverviewData } from './types';
import useBasisGold from '../../hooks/useBasisGold';
import config from '../../config';
import Notice from '../../components/Notice';

const Home: React.FC = () => {
  const basisGold = useBasisGold();

  const [{ gold, bond, share }, setStats] = useState<OverviewData>({});
  const fetchStats = useCallback(async () => {
    const [gold, bond, share] = await Promise.all([
      basisGold.getGoldStatFromUniswap(),
      basisGold.getBondStat(),
      basisGold.getShareStat(),
    ]);
    if (Date.now() < config.bondLaunchesAt.getTime() || parseFloat(bond.priceInDAI) < 1 ) {
      bond.priceInDAI = '-';
    }
    setStats({ gold, bond, share });
  }, [basisGold, setStats]);

  useEffect(() => {
    if (basisGold) {
      fetchStats().catch((err) => console.error(err.stack));
    }
  }, [basisGold]);

  const goldAddr = useMemo(() => basisGold?.BSG.address, [basisGold]);
  const shareAddr = useMemo(() => basisGold?.BSGS.address, [basisGold]);
  const bondAddr = useMemo(() => basisGold?.BSGB.address, [basisGold]);

  return (
    <Page>
      <PageHeader
        subtitle="Buy, sell, and provide liquidity for Basis Gold and Basis Gold Shares on Uniswap"
        title="Welcome to Basis Gold!"
      />
      { Date.now() / 1000 < 1610596800 ? (
        <LaunchCountdown
          deadline={new Date('2021-01-14T04:00:00Z')}
          description="Basis Gold"
          descriptionLink="#"
        />
      ) : [
        <Spacer size="md" />,
        <CardWrapper>
          <HomeCard
            title="Basis Gold"
            symbol="BSG"
            color="#e9b64c"
            supplyLabel="Circulating Supply"
            address={goldAddr}
            priceInDAI={gold?.priceInDAI}
            totalSupply={gold?.totalSupply}
            priceText="BSG / XAU"
          />
          <Spacer size="lg" />
          <HomeCard
            title="Basis Share"
            symbol="BSGS"
            color="#4cb3ff"
            address={shareAddr}
            priceInDAI={'$' + share?.priceInDAI}
            totalSupply={share?.totalSupply}
            priceText="USD price"
          />
          <Spacer size="lg" />
          <HomeCard
            title="Basis Bond"
            symbol="BSGB"
            color="#77e463"
            address={bondAddr}
            priceInDAI={ bond?.priceInDAI }
            totalSupply={ bond?.totalSupply }
            priceText="BSGB / BSG"
          />
        </CardWrapper>
      ]}
    </Page>
  );
};

const StyledOverview = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledNoticeContainer = styled.div`
  max-width: 768px;
  width: 90vw;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledLink = styled.a`
  font-weight: 700;
  text-decoration: none;
  color: ${(props) => props.theme.color.primary.main};
`;

export default Home;
