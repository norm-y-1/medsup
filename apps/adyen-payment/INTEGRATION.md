# Adyen Payment Micro Frontend (MFE)

## Overview

The Adyen Payment MFE is a standalone payment processing module that can be integrated into the main Medsup application. It provides secure payment processing using Adyen's payment platform with support for multiple payment methods including credit cards, debit cards, and other digital payment options.

## Features

- 🎯 **Secure Payment Processing**: Uses Adyen's secure payment infrastructure
- 💳 **Multiple Payment Methods**: Supports various payment methods (currently focused on card payments)
- 🌍 **Multi-Currency Support**: EUR, USD, GBP currencies supported
- 📱 **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- ⚡ **Real-time Status**: Live payment status updates
- 🔄 **Error Handling**: Comprehensive error handling and retry mechanisms
- 🧩 **Module Federation**: Standalone MFE that can be integrated into any host application

## Architecture

### Technology Stack
- **React 19.1.1**: UI framework
- **TypeScript**: Type safety
- **Effector**: State management
- **Tailwind CSS**: Styling
- **Vite**: Build tool and dev server
- **Module Federation**: Micro frontend architecture

### Port Configuration
- **Development**: http://localhost:3002
- **Module Federation Remote**: `http://localhost:3002/remoteEntry.js`

## Integration

### 1. Module Federation Setup

Add the remote to your host application's `vite.config.ts`:

```typescript
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'shell',
      remotes: {
        'adyen-payment': 'http://localhost:3002/remoteEntry.js'
      }
    })
  ]
})
```

### 2. Type Declarations

Add type declarations to your `federation.d.ts`:

```typescript
declare module 'adyen-payment/AdyenPaymentApp' {
  import { ComponentType } from 'react';
  
  interface AdyenPaymentAppProps {
    initialAmount?: number;
    initialCurrency?: 'USD' | 'EUR' | 'GBP';
    onPaymentSuccess?: (paymentId: string) => void;
    onPaymentError?: (error: string) => void;
  }
  
  const AdyenPaymentApp: ComponentType<AdyenPaymentAppProps>;
  export default AdyenPaymentApp;
}
```

### 3. Usage Example

```tsx
import { lazy, Suspense } from 'react';

const AdyenPaymentApp = lazy(() => import('adyen-payment/AdyenPaymentApp'));

function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <AdyenPaymentApp
        initialAmount={100}
        initialCurrency="EUR"
        onPaymentSuccess={(paymentId) => {
          console.log('Payment successful:', paymentId);
          // Handle success (redirect, show confirmation, etc.)
        }}
        onPaymentError={(error) => {
          console.error('Payment failed:', error);
          // Handle error (show error message, retry options, etc.)
        }}
      />
    </Suspense>
  );
}
```

## Configuration

### Environment Variables

The MFE supports the following environment variables:

```env
# Adyen Configuration
VITE_ADYEN_MERCHANT_ACCOUNT=YourMerchantAccount
VITE_ADYEN_CLIENT_KEY=your_client_key
VITE_ADYEN_ENVIRONMENT=test  # or 'live' for production

# API Endpoints
VITE_API_BASE_URL=http://localhost:8080/api  # Your backend API
```

### Backend Integration

The MFE expects the following API endpoints on your backend:

#### 1. Submit Payment
```
POST /api/payments
Content-Type: application/json

{
  "amount": { "value": 10000, "currency": "EUR" },
  "reference": "PAY_123456789",
  "paymentMethod": { "type": "scheme" },
  "returnUrl": "https://your-domain.com/payment/result",
  "merchantAccount": "YourMerchantAccount",
  "countryCode": "NL",
  "shopperLocale": "en_US",
  "shopperEmail": "customer@example.com"
}
```

#### 2. Handle Payment Details
```
POST /api/payments/details
Content-Type: application/json

{
  "details": { /* Adyen action details */ }
}
```

#### 3. Get Payment Methods
```
POST /api/paymentMethods
Content-Type: application/json

{
  "amount": { "value": 10000, "currency": "EUR" },
  "countryCode": "NL",
  "channel": "Web"
}
```

## Component Props

### AdyenPaymentApp

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialAmount` | `number` | `undefined` | Initial amount to be charged |
| `initialCurrency` | `'USD' \| 'EUR' \| 'GBP'` | `'EUR'` | Currency for the payment |
| `onPaymentSuccess` | `(paymentId: string) => void` | `undefined` | Callback when payment succeeds |
| `onPaymentError` | `(error: string) => void` | `undefined` | Callback when payment fails |

## Development

### Running the MFE

```bash
# Navigate to the MFE directory
cd apps/adyen-payment

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Scripts Available

```bash
# Development
npm run dev          # Start dev server on port 3002

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Type checking
tsc --noEmit        # Type check without emitting files
```

## File Structure

```
apps/adyen-payment/
├── src/
│   ├── components/
│   │   ├── AdyenPaymentApp.tsx    # Main component
│   │   ├── PaymentForm.tsx        # Payment form
│   │   ├── PaymentStatus.tsx      # Status display
│   │   └── ErrorBoundary.tsx      # Error handling
│   ├── services/
│   │   ├── adyenService.ts        # Adyen API integration
│   │   └── paymentService.ts      # Payment utilities
│   ├── store/
│   │   └── paymentStore.ts        # Effector state management
│   ├── types/
│   │   └── index.ts               # TypeScript definitions
│   ├── App.tsx                    # Standalone app
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Styles
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

## Security Considerations

1. **Environment Variables**: Never expose sensitive keys in client-side code
2. **API Security**: Ensure your backend validates all payment requests
3. **HTTPS**: Always use HTTPS in production
4. **CSP Headers**: Configure proper Content Security Policy headers
5. **Merchant Account**: Use separate merchant accounts for test and production

## Testing

The MFE includes comprehensive error handling and can be tested in isolation:

1. **Unit Tests**: Test individual components and utilities
2. **Integration Tests**: Test the complete payment flow
3. **Error Scenarios**: Test network failures, invalid responses, etc.

## Troubleshooting

### Common Issues

1. **Module Federation Loading Error**:
   - Ensure the MFE is running on port 3002
   - Check network connectivity between host and remote
   - Verify the remote URL in federation config

2. **Type Errors**:
   - Ensure federation type declarations are up to date
   - Check that all required props are provided

3. **Payment Failures**:
   - Verify backend API endpoints are responding
   - Check Adyen merchant account configuration
   - Ensure proper error handling in your backend

### Debug Mode

Enable debug logging by setting:

```typescript
// In your integration
console.log('Adyen Payment MFE Debug Mode Enabled');
```

## Production Deployment

1. Build the MFE: `npm run build`
2. Deploy the `dist` folder to your CDN
3. Update the remote URL in host applications
4. Configure production environment variables
5. Test the integration thoroughly

## Support

For issues related to:
- **MFE Integration**: Check this documentation and Module Federation guides
- **Adyen Configuration**: Refer to Adyen's official documentation
- **Backend Integration**: Ensure your API matches the expected interface

## Changelog

### v0.1.0 (Initial Release)
- Basic Adyen payment processing
- Multi-currency support (EUR, USD, GBP)
- Responsive UI with Tailwind CSS
- Module Federation integration
- Comprehensive error handling
- TypeScript support
