// Adyen configuration utility
export const getAdyenConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    environment: 'test' as const,
    clientKey: process.env.VITE_ADYEN_CLIENT_KEY || 'test_226BB2VZWNDB3AINZXXPKZZ6TECNTRMS',
    merchantAccount: process.env.VITE_ADYEN_MERCHANT_ACCOUNT || 'YourMerchantAccount',
    locale: 'en-US' as const,
    countryCode: 'NL' as const,
    // Disable analytics in development to prevent CORS issues
    analytics: {
      enabled: !isDevelopment
    },
    telemetry: false,
    // Always provide payment methods to ensure Drop-in renders
    paymentMethods: {
      paymentMethods: [
        {
          type: 'scheme',
          name: 'Credit Card',
          brands: ['visa', 'mc', 'amex', 'maestro'],
          details: [
            { key: 'number', type: 'cardToken' },
            { key: 'expiryMonth', type: 'cardToken' },
            { key: 'expiryYear', type: 'cardToken' },
            { key: 'cvc', type: 'cardToken' }
          ]
        }
      ]
    }
  };
};

// Common payment configuration
export const getPaymentConfig = (amount: number, currency: string) => ({
  amount: {
    value: Math.round(amount * 100), // Convert to minor units
    currency
  }
});

// Test card numbers for development
export const TEST_CARDS = {
  VISA_SUCCESS: '4111111111111111',
  VISA_3DS: '4212345678901237',
  VISA_DECLINED: '4000000000000002',
  MASTERCARD_SUCCESS: '5555555555554444',
  AMEX_SUCCESS: '378282246310005'
} as const;
