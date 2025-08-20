# Adyen Payment Integration Example

## Usage with Real Adyen Web SDK

The Adyen Payment MFE now uses the official Adyen Web SDK with the Drop-in component. Here's how to integrate and use it:

### 1. Basic Integration

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
          console.log('✅ Payment successful:', paymentId);
          // Redirect to success page, update order status, etc.
        }}
        onPaymentError={(error) => {
          console.error('❌ Payment failed:', error);
          // Show error message, allow retry, etc.
        }}
      />
    </Suspense>
  );
}
```

### 2. Test Configuration

The MFE is configured with Adyen test credentials:

- **Environment**: `test`
- **Client Key**: Test client key (replace with your own)
- **Merchant Account**: `YourMerchantAccount` (replace with your test merchant account)

### 3. Available Payment Methods

With the Drop-in component, the following payment methods are automatically available:

- **Credit/Debit Cards**: Visa, Mastercard, American Express
- **Digital Wallets**: PayPal, Apple Pay, Google Pay (when available)
- **Local Payment Methods**: Based on the shopper's country
- **SEPA Direct Debit**: For European customers

### 4. Features Included

✅ **Real Adyen Integration**: Uses official Adyen Web SDK  
✅ **Drop-in Component**: Pre-built UI with all payment methods  
✅ **3D Secure Support**: Automatic 3DS2 authentication  
✅ **Multiple Currencies**: EUR, USD, GBP  
✅ **Responsive Design**: Mobile-optimized interface  
✅ **Error Handling**: Comprehensive error management  
✅ **Loading States**: User-friendly loading indicators  

### 5. Backend Requirements

You'll need to implement these API endpoints on your backend:

#### Submit Payment
```
POST /api/payments
{
  "amount": { "value": 10000, "currency": "EUR" },
  "reference": "ORDER_123",
  "paymentMethod": { /* Adyen payment method object */ },
  "returnUrl": "https://yoursite.com/payment/result",
  "merchantAccount": "YourMerchantAccount"
}
```

#### Handle Payment Details (for 3DS, etc.)
```
POST /api/payments/details
{
  "details": { /* Additional payment details */ }
}
```

### 6. Environment Variables

Create a `.env` file in the Adyen payment app:

```env
# Adyen Configuration
VITE_ADYEN_CLIENT_KEY=test_YOUR_CLIENT_KEY
VITE_ADYEN_MERCHANT_ACCOUNT=YourTestMerchantAccount
VITE_ADYEN_ENVIRONMENT=test

# Backend API
VITE_API_BASE_URL=http://localhost:8080/api
```

### 7. Testing

For testing, you can use these test card numbers:

- **Successful Payment**: 4111 1111 1111 1111
- **3DS Challenge**: 4212 3456 7891 0006
- **Declined Payment**: 4000 0000 0000 0002

**CVV**: Any 3 digits  
**Expiry**: Any future date  
**Cardholder Name**: Any name  

### 8. Production Setup

For production:

1. Change environment to `'live'`
2. Use live client key and merchant account
3. Implement proper backend validation
4. Configure webhooks for payment status updates
5. Ensure HTTPS and proper security headers

### 9. Customization

The Drop-in component styling can be customized via CSS:

```css
/* Custom styling is already included in index.css */
#dropin-container .adyen-checkout__button {
  background-color: #your-brand-color !important;
}
```

### 10. Development

```bash
# Start the MFE
cd apps/adyen-payment
npm run dev

# The Drop-in will be available at http://localhost:3002
```

### 11. Module Federation Integration

The component is exposed as `adyen-payment/AdyenPaymentApp` and can be consumed by any Module Federation host application.

---

## Key Differences from Custom Implementation

- ✅ **Official SDK**: Uses Adyen's tested and maintained components
- ✅ **Built-in Payment Methods**: Automatic support for all Adyen payment methods
- ✅ **3D Secure**: Built-in 3DS2 authentication flow
- ✅ **Localization**: Automatic language detection and localization
- ✅ **PCI Compliance**: Adyen handles sensitive card data
- ✅ **Updates**: Automatic updates when Adyen releases new features
