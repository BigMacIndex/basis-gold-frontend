import { ChainId } from '@uniswap/sdk';
import { Configuration } from './basis-gold/config';
import { BankInfo } from './basis-gold';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';

const configurations: { [env: string]: Configuration } = {
  development: {
    chainId: ChainId.MAINNET,
    etherscanUrl: 'https://etherscan.io',
    defaultProvider: 'https://mainnet.infura.io/v3/24b716d9283f48d38c82bc8fd0f91b45',
    deployments: require('./basis-gold/deployments/deployments.mainnet.json'),
    externalTokens: {
      DAI: ['0x6b175474e89094c44da98b954eedeac495271d0f', 18],
      DSD: ['0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3', 18],
      ESD: ['0x36F3FD68E7325a35EB768F1AedaAe9EA0689d723', 18],
      BAC: ['0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a', 18],
      SXAU: ['0x261efcdd24cea98652b9700800a13dfbca4103ff', 18],
      'BUILD-ETH': ['0xdf6b861b4fbcfaffb62dd1906fcd3a863955704b', 18],
      'BSG-DAI': ['0x4a9596e5d2f9bef50e4de092ad7181ae3c40353e', 18],
      'BSGS-DAI': ['0x980a07e4f64d21a0cb2ef8d4af362a79b9f5c0da', 18],
    },
    baseLaunchDate: new Date('2021-01-23T04:00:00Z'),
    bondLaunchesAt: new Date('2021-01-23T04:00:00Z'),
    boardroomLaunchesAt: new Date('2021-01-23T04:00:00Z'),
    refreshInterval: 30000,
    gasLimitMultiplier: 1.7,
  },
  production: {
    chainId: ChainId.MAINNET,
    etherscanUrl: 'https://etherscan.io',
    defaultProvider: 'https://mainnet.infura.io/v3/12522e5176814bfda74dd672929641a3',
    deployments: require('./basis-gold/deployments/deployments.mainnet.json'),
    externalTokens: {
      DAI: ['0x6b175474e89094c44da98b954eedeac495271d0f', 18],
      DSD: ['0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3', 18],
      ESD: ['0x36F3FD68E7325a35EB768F1AedaAe9EA0689d723', 18],
      BAC: ['0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a', 18],
      SXAU: ['0x261efcdd24cea98652b9700800a13dfbca4103ff', 18],
      'BUILD-ETH': ['0xdf6b861b4fbcfaffb62dd1906fcd3a863955704b', 18],
      'BSG-DAI': ['0x4a9596e5d2f9bef50e4de092ad7181ae3c40353e', 18],
      'BSGS-DAI': ['0x980a07e4f64d21a0cb2ef8d4af362a79b9f5c0da', 18],
    },
    baseLaunchDate: new Date('2021-01-23T04:00:00Z'),
    bondLaunchesAt: new Date('2021-01-23T04:00:00Z'),
    boardroomLaunchesAt: new Date('2021-01-23T04:00:00Z'),
    refreshInterval: 30000,
    gasLimitMultiplier: 1.7,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  BSGDAIPool: {
    name: 'Earn BSG by DAI',
    contract: 'BSGDAIPool',
    depositTokenName: 'DAI',
    earnTokenName: 'BSG',
    finished: true,
    sort: 4,
  },
  BSGDSDPool: {
    name: 'Earn BSG by DSD',
    contract: 'BSGDSDPool',
    depositTokenName: 'DSD',
    earnTokenName: 'BSG',
    finished: true,
    sort: 6,
  },
  BSGESDPool: {
    name: 'Earn BSG by ESD',
    contract: 'BSGESDPool',
    depositTokenName: 'ESD',
    earnTokenName: 'BSG',
    finished: true,
    sort: 7,
  },
  BSGBACPool: {
    name: 'Earn BSG by BAC',
    contract: 'BSGBACPool',
    depositTokenName: 'BAC',
    earnTokenName: 'BSG',
    finished: true,
    sort: 8,
  },
  BSGSXAUPool: {
    name: 'Earn BSG by sXAU',
    contract: 'BSGSXAUPool',
    depositTokenName: 'SXAU',
    earnTokenName: 'BSG',
    finished: true,
    sort: 5,
  },
  BSGBUILDETHPool: {
    name: 'Earn BSG by BUILD-ETH',
    contract: 'BSGBUILDETHPool',
    depositTokenName: 'BUILD-ETH',
    earnTokenName: 'BSG',
    finished: true,
    sort: 3,
  },
  DAIBSGLPTokenSharePool: {
    name: 'Earn BSGS by BSG-DAI',
    contract: 'DAIBSGLPTokenSharePool',
    depositTokenName: 'BSG-DAI',
    earnTokenName: 'BSGS',
    finished: false,
    sort: 1,
  },
  DAIBSGSLPTokenSharePool: {
    name: 'Earn BSGS by BSGS-DAI',
    contract: 'DAIBSGSLPTokenSharePool',
    depositTokenName: 'BSGS-DAI',
    earnTokenName: 'BSGS',
    finished: false,
    sort: 2,
  },
};

export default configurations[process.env.NODE_ENV || "development"];
