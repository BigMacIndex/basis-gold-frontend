import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';
import Spacer from '../../components/Spacer';
import Harvest from './components/Harvest';
import Stake from './components/Stake';
import { Switch } from 'react-router-dom';
import Page from '../../components/Page';
import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';

import config from '../../config';
import LaunchCountdown from '../../components/LaunchCountdown';
import Stat from './components/Stat';
import ProgressCountdown from './components/ProgressCountdown';
import useGoldPriceInEstimatedTWAP from '../../hooks/useGoldPriceInEstimatedTWAP';
import useTreasuryAmount from '../../hooks/useTreasuryAmount';
import Humanize from 'humanize-plus';
import { getBalance } from '../../utils/formatBalance';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import Notice from '../../components/Notice';
import useBoardroomVersion from '../../hooks/useBoardroomVersion';
import moment from 'moment';

const Boardroom: React.FC = () => {
  useEffect(() => window.scrollTo(0, 0));
  const { account } = useWallet();
  const { onRedeem } = useRedeemOnBoardroom();
  const stakedBalance = useStakedBalanceOnBoardroom();

  const goldStat = useGoldPriceInEstimatedTWAP();
  const treasuryAmount = useTreasuryAmount();
  const scalingFactor = useMemo(
    () => (goldStat ? Number(goldStat.priceInDAI).toFixed(3) : null),
    [goldStat],
  );
  const { prevAllocation, nextAllocation } = useTreasuryAllocationTimes();

  const prevEpoch = useMemo(
    () =>
      nextAllocation.getTime() <= Date.now()
        ? moment().utc().startOf('day').toDate()
        : prevAllocation,
    [prevAllocation, nextAllocation],
  );
  const nextEpoch = useMemo(() => moment(prevEpoch).add(1, 'days').toDate(), [prevEpoch]);

  const boardroomVersion = useBoardroomVersion();
  const usingOldBoardroom = boardroomVersion !== 'latest';
  const migrateNotice = useMemo(() => {
    if (boardroomVersion === 'v2') {
      return (
        <StyledNoticeWrapper>
          <Notice color="green">
            <b>Please Migrate into New Boardroom</b>
            <br />
            The boardroom upgrade was successful. Please settle and withdraw your stake from the
            legacy boardroom, then stake again on the new boardroom contract{' '}
            <b>to continue earning BSG seigniorage.</b>
          </Notice>
        </StyledNoticeWrapper>
      );
    }
    return <></>;
  }, [boardroomVersion]);

  const isLaunched = Date.now() >= config.boardroomLaunchesAt.getTime();

  return (
    <Switch>
      <Page>
        {!!account ? (
          <>
            <PageHeader
              title="Join the Boardroom"
              subtitle="Deposit Big Mac Shares and earn inflationary rewards"
            />
            {migrateNotice}
            <StyledHeader>
              <ProgressCountdown
                base={prevEpoch}
                deadline={nextEpoch}
                description="Next Epoch"
              />
              <Stat
                title={goldStat ? `${goldStat.priceInDAI}` : '-'}
                description="Next BMI/XAU (TWAP)"
              />
              <Stat
                title={parseFloat(scalingFactor) > 1 ? `x${scalingFactor}` : '-'}
                description="Scaling Factor"
              />
              <Stat
                title={
                  treasuryAmount
                    ? `~${Humanize.compactInteger(getBalance(treasuryAmount), 2)} BMI`
                    : '-'
                }
                description="Treasury Amount"
              />
            </StyledHeader>
            <StyledBoardroom>
              <StyledCardsWrapper>
                <StyledCardWrapper>
                  <Harvest />
                </StyledCardWrapper>
                <Spacer />
                <StyledCardWrapper>
                  <Stake />
                </StyledCardWrapper>
              </StyledCardsWrapper>
              <Spacer size="lg" />
              {!usingOldBoardroom && (
                // for old boardroom users, the button is displayed in Stake component
                <>
                  <div>
                    <Button
                      disabled={stakedBalance.eq(0)}
                      onClick={onRedeem}
                      text="Settle & Withdraw"
                    />
                  </div>
                  <Spacer size="lg" />
                </>
              )}
            </StyledBoardroom>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const UnlockWallet = () => {
  const { connect } = useWallet();
  return (
    <Center>
      <Button onClick={() => connect('injected')} text="Unlock Wallet" />
    </Center>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledHeader = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
  width: 960px;

  > * {
    flex: 1;
    height: 84px;
    margin: 0 ${(props) => props.theme.spacing[2]}px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const StyledNoticeWrapper = styled.div`
  width: 768px;
  margin-top: -20px;
  margin-bottom: 40px;
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Boardroom;
