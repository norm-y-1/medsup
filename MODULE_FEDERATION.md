# MedSup Pro - Module Federation Architecture

## Overview

This project implements a **Module Federation** architecture using Vite, where the crypto-payment functionality is built as a separate microfrontend that can be consumed by the main shell application.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Shell Application                        │
│                   (localhost:5173)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Main MedSup Pro App                    │   │
│  │  - Product Catalog                                  │   │
│  │  - Shopping Cart                                    │   │
│  │  - User Interface                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           │ Module Federation               │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Crypto Payment Remote                     │   │
│  │          (localhost:3001)                          │   │
│  │  - Payment Forms                                    │   │
│  │  - Cryptocurrency Support                          │   │
│  │  - Payment Status Tracking                         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Install Dependencies
```bash
# Install root dependencies
yarn install

### 2. Start Both Applications
```bash
# On Windows
./start-dev.bat

# On Linux/Mac
./start-dev.sh

# Terminal 2: Start shell app
yarn dev
```

### 3. Access the Applications
- **Shell App**: http://localhost:5173
- **Crypto Payment MFE**: http://localhost:3001

## Module Federation Configuration

### Shell (Main App - Port 5173)

```typescript
// vite.config.ts
federation({
  name: 'shell',
  remotes: {
    'crypto-payment': 'http://localhost:3001/assets/remoteEntry.js'
  },
  shared: {
    react: { requiredVersion: '^19.1.1' },
    'react-dom': { requiredVersion: '^19.1.1' },
    effector: { requiredVersion: '^23.4.2' },
    'effector-react': { requiredVersion: '^23.3.0' }
  }
})
```

## Usage Examples

### Basic Integration

```tsx
import React, { Suspense, lazy } from 'react';

// Lazy load the remote microfrontend
const CryptoPaymentApp = lazy(() => import('crypto-payment/CryptoPaymentApp'));

function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CryptoPaymentApp 
        initialAmount={100}
        initialCurrency="USD"
        onPaymentSuccess={(paymentId) => console.log('Payment successful:', paymentId)}
        onPaymentError={(error) => console.error('Payment error:', error)}
      />
    </Suspense>
  );
}
```

### Advanced Integration with Error Handling

```tsx
import React, { Suspense, lazy } from 'react';

const CryptoPaymentApp = lazy(() => import('crypto-payment/CryptoPaymentApp'));

class MFEErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Crypto Payment Service Unavailable</h2>
          <p>Please ensure the service is running on port 3001</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function SecurePaymentPage() {
  return (
    <MFEErrorBoundary>
      <Suspense fallback={<PaymentLoader />}>
        <CryptoPaymentApp />
      </Suspense>
    </MFEErrorBoundary>
  );
}
```

### Accessing Remote Store

```tsx
import { useStore } from 'effector-react';
import { $currentPayment, $isLoading } from 'crypto-payment/store';

function PaymentStatus() {
  const payment = useStore($currentPayment);
  const isLoading = useStore($isLoading);

  return (
    <div>
      {isLoading ? 'Processing...' : `Payment Status: ${payment?.status}`}
    </div>
  );
}
```

## Features

### Crypto Payment Microfrontend
- ✅ **Independent Deployment**: Can be deployed separately
- ✅ **Technology Isolation**: Uses its own dependencies
- ✅ **State Management**: Effector-based reactive state
- ✅ **Cryptocurrency Support**: Bitcoin, Ethereum, Litecoin, Monero
- ✅ **Real-time Updates**: Payment status polling
- ✅ **QR Code Generation**: For mobile wallet scanning
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Error Handling**: Comprehensive error boundaries
- ✅ **TypeScript Support**: Full type safety

### Shell Application
- ✅ **Module Federation Host**: Consumes remote microfrontends
- ✅ **Lazy Loading**: Dynamic imports with Suspense
- ✅ **Error Boundaries**: Graceful degradation
- ✅ **Shared Dependencies**: Optimized bundle sharing
- ✅ **Development Mode**: Hot reload support
- ✅ **Production Ready**: Build optimization

## Shared Dependencies

The following packages are shared between shell and remote:
- **React** (19.1.1): UI library
- **React-DOM** (19.1.1): DOM renderer
- **Effector** (23.4.2): State management
- **Effector-React** (23.3.0): React bindings

## Development Workflow

### 1. Start Crypto Payment MFE
```bash
cd apps/crypto-payment
yarn dev
```
- Runs on http://localhost:3001
- Exposes `remoteEntry.js` at `/assets/remoteEntry.js`
- Available for federation consumption

### 2. Start Shell Application
```bash
yarn dev
```
- Runs on http://localhost:5173
- Consumes crypto-payment remote
- Provides integrated experience

### 3. Development Features
- **Hot Reload**: Both apps support hot reload
- **Independent Development**: Each app can be developed separately
- **Shared State**: State can be shared between shell and remote
- **TypeScript**: Full TypeScript support with federation types

## Deployment

### Development
```bash
# Start crypto-payment
cd apps/crypto-payment && yarn dev

# Start shell (in another terminal)
yarn dev
```

### Production Build
```bash
# Build crypto-payment
cd apps/crypto-payment && yarn build

# Build shell
yarn build
```

### Docker Deployment
```dockerfile
# Crypto Payment MFE
FROM node:18-alpine
WORKDIR /app/crypto-payment
COPY apps/crypto-payment/package.json ./
RUN yarn install
COPY apps/crypto-payment ./
RUN yarn build
EXPOSE 3001
CMD ["yarn", "preview"]

# Shell Application
FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 5173
CMD ["yarn", "preview"]
```

## Troubleshooting

### Common Issues

1. **Remote Not Loading**
   - Ensure crypto-payment is running on port 3001
   - Check `http://localhost:3001/assets/remoteEntry.js` is accessible
   - Verify CORS settings

2. **TypeScript Errors**
   - Check `src/types/federation.d.ts` is properly configured
   - Ensure shared dependency versions match

3. **Runtime Errors**
   - Check browser console for federation errors
   - Verify shared dependencies are compatible
   - Ensure both apps use same React version

### Debug URLs
- **Remote Entry**: http://localhost:3001/assets/remoteEntry.js
- **Standalone MFE**: http://localhost:3001
- **Shell with Federation**: http://localhost:5173/crypto-payment

## Performance Considerations

- **Bundle Splitting**: Shared dependencies are loaded once
- **Lazy Loading**: Remote modules are loaded on demand
- **Caching**: Shared modules are cached by the browser
- **Network**: Initial load includes remote discovery overhead

## Security

- **CORS**: Properly configured for cross-origin requests
- **CSP**: Content Security Policy compatible
- **Dependency Isolation**: Each MFE has its own dependency tree
- **Runtime Isolation**: Separate execution contexts

## Benefits

1. **Independent Development**: Teams can work independently
2. **Technology Diversity**: Different tech stacks per MFE
3. **Deployment Flexibility**: Deploy services separately
4. **Scalability**: Scale individual services as needed
5. **Code Reusability**: Share components across applications
6. **Fault Isolation**: Failure in one MFE doesn't crash others

## Next Steps

1. **Add More MFEs**: Create additional microfrontends
2. **Implement CI/CD**: Automated deployment pipelines
3. **Add Monitoring**: Track MFE performance and errors
4. **Optimize Bundle**: Further optimize shared dependencies
5. **Add Tests**: E2E tests for federated scenarios
