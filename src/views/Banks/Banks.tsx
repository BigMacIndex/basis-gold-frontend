import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import LaunchCountdown from '../../components/LaunchCountdown';
import Bank from '../Bank';
import BankCards from './BankCards';
import { useWallet } from 'use-wallet';
import Button from '../../components/Button';
import styled from 'styled-components';

const Banks: React.FC = () => {
  const { path } = useRouteMatch();
  const { account, connect } = useWallet();

  return (
    <Switch>
      <Page>
        <Route exact path={path}>
          <PageHeader
            title="Pick a Bank."
            subtitle="Earn Big Mac Shares by providing liquidity"
          />

          { Date.now() / 1000 < 1610596800 ? [
            <LaunchCountdown
              deadline={new Date('2021-01-14T04:00:00Z')}
              description="Earn Big Mac Index by staking"
              descriptionLink="#"
            />,
            <br></br>,
            <br></br>
           ] : '' }

          {!!account ? (
            <BankCards />
          ) : '' }

          { !account ? (
            <Center>
              <Button onClick={() => connect('injected')} text="Unlock Wallet" />
            </Center>
          ) : '' }

        </Route>
        <Route path={`${path}/:bankId`}>
          <Bank />
        </Route>
      </Page>
    </Switch>
  );
};

const Center = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export default Banks;
