import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ethers } from 'ethers';

// Mock contract factory
export const createMockContract = (overrides = {}) => ({
  hasRole: jest.fn().mockResolvedValue(true),
  paused: jest.fn().mockResolvedValue(false),
  getPlatformFee: jest.fn().mockResolvedValue(ethers.BigNumber.from('100')),
  getTreasuryAddress: jest.fn().mockResolvedValue('0x123...'),
  getMinBidIncrement: jest.fn().mockResolvedValue(ethers.utils.parseEther('0.1')),
  getMinAuctionDuration: jest.fn().mockResolvedValue(604800), // 7 days in seconds
  exists: jest.fn().mockResolvedValue(false),
  mint: jest.fn().mockResolvedValue({ wait: () => Promise.resolve() }),
  setPlatformFee: jest.fn().mockResolvedValue({ wait: () => Promise.resolve() }),
  setTreasuryAddress: jest.fn().mockResolvedValue({ wait: () => Promise.resolve() }),
  setMinBidIncrement: jest.fn().mockResolvedValue({ wait: () => Promise.resolve() }),
  setMinAuctionDuration: jest.fn().mockResolvedValue({ wait: () => Promise.resolve() }),
  pause: jest.fn().mockResolvedValue({ wait: () => Promise.resolve() }),
  unpause: jest.fn().mockResolvedValue({ wait: () => Promise.resolve() }),
  getPendingAction: jest.fn().mockResolvedValue({
    description: 'Test action',
    proposer: '0x456...',
    deadline: ethers.BigNumber.from('1717171717'),
    executed: false
  }),
  getActionSignatures: jest.fn().mockResolvedValue(['0x789...']),
  signAction: jest.fn().mockResolvedValue({ wait: () => Promise.resolve() }),
  revokeSignature: jest.fn().mockResolvedValue({ wait: () => Promise.resolve() }),
  queryFilter: jest.fn().mockResolvedValue([]),
  filters: {
    Transfer: jest.fn(),
    Paused: jest.fn(),
    Unpaused: jest.fn(),
    PlatformFeeUpdated: jest.fn(),
    RoleGranted: jest.fn(),
    MultiSigActionProposed: jest.fn()
  },
  ...overrides
});

// Mock contracts object
export const createMockContracts = (overrides = {}) => ({
  companyNFT: createMockContract(overrides.companyNFT),
  marketplace: createMockContract(overrides.marketplace),
  revenueRouter: createMockContract(overrides.revenueRouter)
});

// Custom render with providers
export const renderWithProviders = (ui, { contracts = createMockContracts(), ...options } = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock window.ethereum
export const mockEthereum = () => {
  const ethereum = {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
    providers: ['MetaMask']
  };
  global.window.ethereum = ethereum;
  return ethereum;
};

// Clean up mocks
export const cleanupMocks = () => {
  delete global.window.ethereum;
  jest.clearAllMocks();
};
