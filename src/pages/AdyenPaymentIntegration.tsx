import React, { Suspense, useState, useCallback, useEffect } from 'react';

// Fallback component for loading
const LoadingFallback = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading Payment MFE...</span>
  </div>
);

// Iframe-based integration as a reliable fallback
const IframeAdyenPayment = () => (
  <div className="w-full max-w-4xl mx-auto">
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold">Payment MFE Service</h3>
        <p className="text-sm text-gray-600">Loaded via iframe integration</p>
      </div>
      <iframe 
        src="http://localhost:3000"
        width="100%" 
        height="800"
        frameBorder="0"
        className="w-full"
        title="Payment MFE"
      />
    </div>
  </div>
);

// Try to load the federated module, fall back to iframe
function FederatedAdyenPayment() {
  const [useFederation, setUseFederation] = useState(true);
  const [federationError, setFederationError] = useState<string | null>(null);

  useEffect(() => {
    const testFederation = async () => {
      try {
        await import('adyen-payment/AdyenPaymentApp');
        console.log('Federation is working');
      } catch (error) {
        console.warn('Federation failed, falling back to iframe:', error);
        setFederationError(error instanceof Error ? error.message : 'Unknown error');
        setUseFederation(false);
      }
    };

    if (useFederation) {
      testFederation();
    }
  }, [useFederation]);

  if (!useFederation) {
    return (
      <div>
        {/* {federationError && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Module Federation failed, using iframe integration.
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-yellow-700">Error Details</summary>
              <pre className="mt-1 text-xs text-red-600">{federationError}</pre>
            </details>
          </div>
        )} */}
        <IframeAdyenPayment />
      </div>
    );
  }

  // Try federation with lazy loading
  const AdyenPaymentApp = React.lazy(() => 
    import('adyen-payment/AdyenPaymentApp').catch(error => {
      console.error('Federation import failed:', error);
      setFederationError(error.message);
      setUseFederation(false);
      
      return {
        default: () => (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Switching to iframe mode...</p>
          </div>
        )
      };
    })
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdyenPaymentApp />
    </Suspense>
  );
}

// Function-based error boundary using hooks
function MicrofrontendErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetErrorBoundary = useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  // Listen for errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught by boundary:', event.error);
      setError(event.error);
      setHasError(true);
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      console.error('Promise rejection caught by boundary:', event.reason);
      setError(new Error(event.reason));
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Payment Service Error
            </h3>
          </div>
        </div>
        <div className="text-sm text-red-700 mb-4">
          <p>Something went wrong loading the payment service.</p>
          {error && (
            <details className="mt-2">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto">
                {error.message || error.toString()}
              </pre>
            </details>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={resetErrorBoundary}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Main toggle component with error boundary
function AdyenPaymentToggle() {
  const [showFederated, setShowFederated] = useState(true);

  return (
    <div className="p-6">
      {/* Toggle Button */}
      <div className="mb-6 flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <button
            onClick={() => setShowFederated(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showFederated
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Federation Mode
          </button>
          <button
            onClick={() => setShowFederated(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !showFederated
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Iframe Mode
          </button>
        </div>
      </div>

      {/* Content */}
      <MicrofrontendErrorBoundary>
        {showFederated ? <FederatedAdyenPayment /> : <IframeAdyenPayment />}
      </MicrofrontendErrorBoundary>
    </div>
  );
}

interface AdyenPaymentIntegrationProps {
  amount?: number;
  currency?: 'USD' | 'EUR' | 'GBP';
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

function AdyenPaymentIntegration({ 
  amount = 100, 
  currency = 'EUR',
  onSuccess,
  onError 
}: AdyenPaymentIntegrationProps) {
  const handlePaymentSuccess = (paymentId: string) => {
    console.log('✅ Adyen Payment completed successfully:', paymentId);
    if (onSuccess) {
      onSuccess(paymentId);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('❌ Adyen Payment failed:', error);
    if (onError) {
      onError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment MFE Integration
            </h1>
            <p className="text-lg text-gray-600">
              Module Federation with iframe fallback
            </p>
            <div className="mt-4 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Amount: {amount} {currency}
              </span>
            </div>
          </div>

          {/* Integration Component */}
          <AdyenPaymentToggle />
        </div>
      </div>
    </div>
  );
}

export default AdyenPaymentIntegration;
