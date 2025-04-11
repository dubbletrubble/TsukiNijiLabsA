import '@testing-library/jest-dom';

// Add BigInt to global for tests
global.BigInt = require('big-integer');
import { ethers } from 'ethers';

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    Contract: jest.fn(),
    providers: {
      Web3Provider: jest.fn(),
    },
    utils: {
      parseEther: jest.fn(val => val),
      formatEther: jest.fn(val => val),
      parseUnits: jest.fn((val, decimals) => val),
      formatUnits: jest.fn((val, decimals) => val),
    },
    BigNumber: {
      from: jest.fn(val => val),
    },
    constants: {
      HashZero: '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
  },
}));

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  },
});

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback, options) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = IntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserver {
  constructor(callback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock window.URL.createObjectURL
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

// Suppress console errors during tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Error: Uncaught [') ||
     args[0].includes('act(...)') ||
     args[0].includes('Warning: An update to'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Mock fetch
global.fetch = jest.fn();

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
