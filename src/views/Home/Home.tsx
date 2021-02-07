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
// import Notice from '../../components/Notice';

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
        subtitle="Buy, sell, and provide liquidity for Big Macs and Big Mac Shares on Uniswap"
        title="Welcome to Big Mac Index!"
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
            title="Big Mac Index"
            symbol="BMI"
            color="#CF240A"
            supplyLabel="Circulating Supply"
            address={goldAddr}
            priceInDAI={gold?.priceInDAI}
            totalSupply={gold?.totalSupply}
            priceText="BMI / XAU"
          />
          <Spacer size="lg" />
          <HomeCard
            title="Big Mac Share"
            symbol="BMS"
            color="#CF240A"
            address={shareAddr}
            priceInDAI={'$' + share?.priceInDAI}
            totalSupply={share?.totalSupply}
            priceText="USD price"
          />
          <Spacer size="lg" />
          <HomeCard
            title="Big Mac Bond"
            symbol="BMB"
            color="#CF240A"
            address={bondAddr}
            priceInDAI={ bond?.priceInDAI }
            totalSupply={ bond?.totalSupply }
            priceText="BMB / BMI"
          />
        </CardWrapper>
      ]}
    </Page>
  );
};

// const StyledOverview = styled.div`
//   align-items: center;
//   display: flex;
//   @media (max-width: 768px) {
//     width: 100%;
//     flex-flow: column nowrap;
//     align-items: center;
//   }
// `;

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
