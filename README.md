# ChainSight - Solana Blockchain Visualizer

![ChainSight Banner](https://i.imgur.com/JfQ1Njl.png)

ChainSight is an interactive web-based visualization tool designed to map and analyze activity across the Solana blockchain. It provides investigators, analysts, and crypto enthusiasts with an intuitive way to track wallet interactions, transaction flows, and protocol activity in real-time.

## 🌟 Features

### 🔍 Dynamic Wallet Mapping
- Interactive force-directed graphs of wallet connections
- Visualize transaction histories and relationships
- Cluster analysis for identifying wallet groups

### 💸 Fund Flow Tracking
- Sankey diagrams for token movements
- Color-coded paths by token type
- Historical transaction analysis

### 📊 Protocol Activity Monitoring
- TVL and volume metrics for major protocols
- Protocol interaction visualization
- Time-series data analysis

### ⚡ Real-time Updates
- Live transaction feed with WebSocket
- Instant wallet balance updates
- Network activity monitoring

### 🕵️ Investigator Tools
- Wallet tagging and bookmarking
- Investigation history tracking
- Export findings as PDF/CSV
- Shared investigation links

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- Redis 6+
- Yarn or npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/thetruesammyjay/chain-sight.git
   cd chain-sight
   ```
2. Install dependencies:
   ```bash
   # Server
   cd server && npm install

   # Client
   cd ../client && npm install
   ```
3. Set up environment variables:
- Create `.env` files in both `server` and `client` directories
  ```env
  RPC_URL=https://api.mainnet-beta.solana.com
  PORT=5000
  ```

4. Start Development Servers:
```bash
# In one terminal
cd server && npm run dev

# In another terminal
cd ../client && npm start
```

## 🏗️ Project Structure
```markdown
chain-sight/
├── client/               # React frontend
├── server/               # Node.js backend
├── .gitignore
└── README.md
```

### Client Architecture
- **Components**: Reusable UI components

- **Pages**: Main application views

- **Hooks**: Custom React hooks

- **Services**: API communication

- **Store**: Zustand state management

- **Utils**: Helper functions

### Server Architecture
- **API**: REST and GraphQL endpoints

- **Services**: Business logic

- **Jobs**: Background processing

- **Types**: TypeScript definitions

- **Config**: Environment configuration

## 📚 Documentation
### API Endpoints
| Endpoint                        | Method | Description            |
|--------------------------------|--------|------------------------|
| `/api/wallet/:address`         | GET    | Get wallet details     |
| `/api/transaction/:signature` | GET    | Get transaction details|
| `/api/protocols/metrics`      | GET    | Get protocol metrics   |
| `/graphql`                    | POST   | GraphQL API            |

### Key Client Components
1. **WalletGraph**: Force-directed wallet visualization

2. **TransactionFlow**: Sankey diagram for fund flows

3. **LiveFeed**: Real-time transaction stream

4. **ProtocolMetrics**: TVL and volume charts

5. **InvestigatorTools**: Bookmarking and export

## 🛠️ Development
### Common Commands
```bash
# Run development servers
yarn dev

# Build for production
yarn build

# Lint code
yarn lint

# Run tests
yarn test
```
### Database Setup
1. Create PostgreSQL database:
```bash
createdb chainsight
```
2. Run migrations:
```bash
cd server
yarn db:migrate
```
### Deployment
1. **Client**: Deploy to Vercel
```bash
cd client
yarn build
vercel --prod
```
2. **Server**: Deploy to Railway
```bash
cd server
yarn build
railway up
```

## 🤝 Contributing
- Fork the repository

- Create your feature branch (`git checkout -b feature/amazing-feature`)

- Commit your changes (`git commit -m 'Add some amazing feature'`)

- Push to the branch (`git push origin feature/amazing-feature`)

- Open a Pull Request

## 📄 License
**MIT License** – See [LICENSE](https://license.md/) for details

## 📬 Contact Us
- **X (Twitter):** [@thatbwoysammyj](https://x.com/thatbwoysammyj)  
- **Telegram:** [t.me/sammyjayisthename](https://t.me/sammyjayisthename)  
- **Email:** [thetruesammyjay@gmail.com](mailto:thetruesammyjay@gmail.com)

## 🙏 Acknowledgements
- Solana Web3.js

- Visx visualization library

- React Force Graph

- The Graph Protocol