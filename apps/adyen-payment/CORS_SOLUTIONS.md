# CORS Issues with Adyen Web SDK - Solutions

## Problem
When using Adyen Web SDK in development (localhost), you may encounter CORS errors like:

```
Access to fetch at 'https://checkoutanalytics-test.adyen.com/checkoutanalytics/v3/analytics?clientKey=...' 
from origin 'http://localhost:3002' has been blocked by CORS policy
```

## Root Cause
Adyen's analytics and telemetry services don't allow cross-origin requests from localhost domains for security reasons.

## Solutions Implemented

### 1. Disable Analytics in Development
```typescript
// In adyenConfig.ts
const configuration = {
  analytics: {
    enabled: !isDevelopment  // Disable in dev, enable in production
  },
  telemetry: false  // Disable telemetry completely in development
};
```

### 2. Environment-Specific Configuration
```typescript
export const getAdyenConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    environment: 'test',
    clientKey: process.env.VITE_ADYEN_CLIENT_KEY || 'fallback_test_key',
    analytics: {
      enabled: !isDevelopment  // Only enable analytics in production
    },
    ...(isDevelopment && {
      telemetry: false,
      paymentMethodsConfiguration: {
        card: {
          hasHolderName: true,
          holderNameRequired: false,
          billingAddressRequired: false
        }
      }
    })
  };
};
```

### 3. Vite Proxy Configuration (Optional)
```typescript
// In vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/checkoutanalytics': {
        target: 'https://checkoutanalytics-test.adyen.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
});
```

### 4. Error Handling in Component
```typescript
// Graceful error handling for CORS issues
const initializeAdyenCheckout = async () => {
  try {
    const configuration = getAdyenConfig();
    const adyenCheckout = await AdyenCheckout(configuration);
    // ... rest of initialization
  } catch (error) {
    if (error.message?.includes('CORS') || error.message?.includes('analytics')) {
      console.warn('Analytics disabled due to CORS restrictions in development');
      // Retry with minimal configuration
      const minimalConfig = {
        ...getAdyenConfig(),
        analytics: { enabled: false },
        telemetry: false
      };
      const adyenCheckout = await AdyenCheckout(minimalConfig);
    } else {
      throw error;
    }
  }
};
```

## Alternative Solutions

### Use a Different Client Key
If you have access to a different test client key that allows localhost origins:
```typescript
VITE_ADYEN_CLIENT_KEY=your_localhost_enabled_test_key
```

### Use a Local Development Domain
Instead of localhost, use a custom domain:
```bash
# Add to /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 dev.yoursite.com

# Then access your app at http://dev.yoursite.com:3002
```

### Use HTTPS in Development
```typescript
// In vite.config.ts
export default defineConfig({
  server: {
    https: true,  // Enable HTTPS
    port: 3002
  }
});
```

## Production Considerations

### Enable Analytics in Production
```typescript
// For production builds
const configuration = {
  environment: 'live',  // Use live environment
  analytics: {
    enabled: true  // Enable analytics in production
  }
};
```

### Proper Domain Configuration
Ensure your production domain is properly configured in your Adyen Customer Area:
1. Login to Adyen Customer Area
2. Go to Developers > API credentials
3. Add your production domain to allowed origins

## Testing

### Test Cards (No CORS Issues)
```typescript
export const TEST_CARDS = {
  VISA_SUCCESS: '4111111111111111',
  VISA_3DS: '4212345678901237',
  VISA_DECLINED: '4000000000000002',
  MASTERCARD_SUCCESS: '5555555555554444'
};
```

### Browser Console Commands
```javascript
// Check if analytics is disabled
console.log('Analytics enabled:', adyenCheckout.options.analytics?.enabled);

// Test payment without analytics
adyenCheckout.create('dropin', {
  analytics: { enabled: false }
});
```

## Status
✅ **Analytics disabled in development**  
✅ **Telemetry disabled in development**  
✅ **Graceful error handling implemented**  
✅ **Environment-specific configuration**  
✅ **Fallback configuration for CORS errors**  

The CORS issue should now be resolved in development while maintaining full functionality in production.
