# NFT Marketplace Frontend

A modern, decentralized NFT marketplace for tokenized company revenue shares. Built with React, Wagmi, and Emotion.

## Project Structure

```
src/
├── abis/           # Smart contract ABIs
├── assets/         # Static assets (images, fonts)
├── components/     # React components
│   ├── common/     # Shared components
│   ├── landing/    # Landing page components
│   ├── marketplace/# Marketplace components
│   └── nft/        # NFT detail components
├── config/         # Configuration files
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
└── styles/         # Global styles and theme

```

## Key Features

- **NFT Marketplace**: Browse, buy, and bid on company NFTs
- **Revenue Distribution**: Track and claim revenue from owned NFTs
- **Real-time Updates**: Live updates for bids and revenue data
- **Responsive Design**: Modern UI that works across all devices

## Smart Contract Integration

The frontend interacts with several smart contracts:
- `CompanyNFT`: Main NFT contract
- `Marketplace`: Handles listings and sales
- `PlatformToken`: ERC20 token for transactions
- `RevenueRouter`: Manages revenue distribution

## Development

### Prerequisites
- Node.js 16+
- npm or yarn
- MetaMask or similar Web3 wallet

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables
4. Start development server: `npm start`

### Environment Variables
```
REACT_APP_CHAIN_ID=1
REACT_APP_NFT_CONTRACT_ADDRESS=0x...
REACT_APP_MARKETPLACE_ADDRESS=0x...
REACT_APP_TOKEN_ADDRESS=0x...
REACT_APP_REVENUE_ROUTER_ADDRESS=0x...
```

## Code Organization

### Components
- Components are organized by feature/domain
- Common components are shared across features
- Each component has its own styles using Emotion
- Props are documented using JSDoc

### Hooks
- Custom hooks handle smart contract interactions
- Separate hooks for different contracts
- Error handling and loading states included

### State Management
- React Context for global state
- Wagmi for Web3 state
- Local state for component-specific data

## Testing

- Unit tests: `npm test`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`

## Deployment

1. Build production bundle: `npm run build`
2. Deploy to hosting service of choice
3. Update environment variables

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## License

MIT License - see LICENSE file for details
