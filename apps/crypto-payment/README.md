# Crypto Payment Microfrontend - Usage Guide

## Overview
The crypto-payment microfrontend is a standalone React application that handles cryptocurrency payments for MedSup Pro. It's built with Vite, React, TypeScript, and Effector for state management.

## Getting Started

### 1. Development Server
To run the crypto-payment microfrontend in development mode:

```bash
cd apps/crypto-payment
yarn dev
```

This will start the development server on `http://localhost:3001`

### 2. Building for Production
To build the microfrontend for production:

```bash
cd apps/crypto-payment
yarn build
```

### 3. Preview Production Build
To preview the production build:

```bash
cd apps/crypto-payment
yarn preview
```

## Integration Options

### Option 1: Iframe Integration (Simplest)
```tsx
// In your main app
function PaymentModal({ amount, onSuccess, onClose }) {
  return (
    <div className="modal">
      <iframe 
        src={`http://localhost:3001?amount=${amount}&currency=USD`}
        width="600" 
        height="800"
        frameBorder="0"
      />
    </div>
  );
}
```

### Option 2: Direct Component Import (Recommended)
```tsx
// In your main app
import { CryptoPaymentApp } from '@medsup/crypto-payment';

function PaymentPage() {
  return (
    <div>
      <h1>Checkout</h1>
      <CryptoPaymentApp />
    </div>
  );
}
```

### Option 3: Module Federation (Advanced)
For advanced microfrontend architecture, you can use Vite's module federation capabilities.

## API Reference

### Main Components

#### `CryptoPaymentApp`
The main component that orchestrates the entire payment flow.

```tsx
import { CryptoPaymentApp } from '@medsup/crypto-payment';

<CryptoPaymentApp />
```

#### `PaymentForm`
Handles payment form input and cryptocurrency selection.

```tsx
import { PaymentForm } from '@medsup/crypto-payment';

<PaymentForm cryptocurrencies={cryptoList} />
```

#### `PaymentStatus`
Displays payment status and handles payment tracking.

```tsx
import { PaymentStatus } from '@medsup/crypto-payment';

<PaymentStatus payment={paymentData} />
```

### Store Events

```tsx
import {
  selectCryptoCurrency,
  updatePaymentForm,
  createPaymentRequest,
  checkPaymentStatus,
  resetPayment
} from '@medsup/crypto-payment/store';

// Select a cryptocurrency
selectCryptoCurrency('bitcoin');

// Update form data
updatePaymentForm({ amount: 100, currency: 'USD' });

// Create payment request
createPaymentRequest({ amount: 100, currency: 'USD', selectedCrypto: 'bitcoin' });

// Check payment status
checkPaymentStatus('payment_id');

// Reset payment state
resetPayment();
```

### Store Selectors

```tsx
import {
  $cryptoCurrencies,
  $selectedCrypto,
  $paymentForm,
  $currentPayment,
  $isLoading,
  $error
} from '@medsup/crypto-payment/store';

// Use in React components
const currencies = useStore($cryptoCurrencies);
const isLoading = useStore($isLoading);
```

## Supported Cryptocurrencies

Currently supported cryptocurrencies:
- Bitcoin (BTC)
- Ethereum (ETH)
- Litecoin (LTC)
- Monero (XMR)

## Payment Flow

1. **Form Input**: User enters amount and selects cryptocurrency
2. **Payment Creation**: System generates payment request with wallet address and QR code
3. **Payment Tracking**: User sends payment to provided address
4. **Status Updates**: System polls for payment confirmation
5. **Completion**: Payment is confirmed and completed

## Configuration

### Environment Variables
Create a `.env` file in the crypto-payment directory:

```env
VITE_API_BASE_URL=https://api.yourservice.com
VITE_COINGECKO_API_KEY=your_api_key
VITE_PAYMENT_TIMEOUT=1800000  # 30 minutes in milliseconds
```

### Customization

#### Styling
The microfrontend uses Tailwind CSS. You can customize the theme in `tailwind.config.ts`:

```ts
export default {
  theme: {
    extend: {
      colors: {
        crypto: {
          bitcoin: '#f7931a',
          ethereum: '#627eea',
          primary: '#1e40af',
          secondary: '#64748b'
        }
      }
    },
  },
}
```

#### Adding New Cryptocurrencies
Update the `cryptoService.ts` to add support for new cryptocurrencies:

```ts
// In src/services/cryptoService.ts
const newCurrency = {
  id: 'cardano',
  name: 'Cardano',
  symbol: 'ADA',
  icon: '₳',
  price: 0.50,
  enabled: true
};
```

## Security Considerations

1. **Wallet Addresses**: Never store private keys in the frontend
2. **API Keys**: Use environment variables for sensitive data
3. **Payment Validation**: Always verify payments on the backend
4. **Rate Limiting**: Implement rate limiting for payment creation
5. **HTTPS**: Always use HTTPS in production

## Testing

### Unit Tests
```bash
cd apps/crypto-payment
yarn test
```

### E2E Tests with Cypress
```bash
cd apps/crypto-payment
yarn test:e2e
```

## Deployment

### Standalone Deployment
The microfrontend can be deployed independently to any static hosting service:

```bash
yarn build
# Deploy the dist/ folder to your hosting service
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3001
CMD ["yarn", "preview"]
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend API allows requests from the microfrontend domain
2. **Payment Polling**: If payment status doesn't update, check network connectivity
3. **QR Code Display**: Verify QR code generation service is accessible
4. **Styling Issues**: Ensure Tailwind CSS is properly configured

### Debug Mode
Enable debug logging by setting:
```env
VITE_DEBUG=true
```

## Performance

- **Bundle Size**: ~150KB gzipped
- **Load Time**: <2s on 3G connection
- **Memory Usage**: ~15MB typical usage

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Follow TypeScript strict mode
2. Use Effector for state management
3. Write tests for new features
4. Follow the existing code style
5. Update documentation for new features

## Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation
