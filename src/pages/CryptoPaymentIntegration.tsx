import React, { Suspense, useState, useCallback, useEffect } from 'react';

// Fallback component for loading
const LoadingFallback = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading Crypto Payment...</span>
  </div>
);

// Iframe-based integration as a reliable fallback
const IframeCryptoPayment = () => (
  <div className="w-full max-w-4xl mx-auto">
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold">Crypto Payment Service</h3>
        <p className="text-sm text-gray-600">Loaded via iframe integration</p>
      </div>
      <iframe 
        src="http://localhost:3001"
        width="100%" 
        height="800"
        frameBorder="0"
        className="w-full"
        title="Crypto Payment Microfrontend"
      />
    </div>
  </div>
);

// Try to load the federated module, fall back to iframe
function FederatedCryptoPayment() {
  const [useFederation, setUseFederation] = useState(true);
  const [federationError, setFederationError] = useState<string | null>(null);

  useEffect(() => {
    const testFederation = async () => {
      try {
        await import('crypto-payment/CryptoPaymentApp');
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
        <IframeCryptoPayment />
      </div>
    );
  }

  // Try federation with lazy loading
  const CryptoPaymentApp = React.lazy(() => 
    import('crypto-payment/CryptoPaymentApp').catch(error => {
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
      <CryptoPaymentApp />
    </Suspense>
  );
}

// Function-based error boundary using hooks
function MicrofrontendErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Application Error:', event.error);
      setHasError(true);
      setError(event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled Promise Rejection:', event.reason);
      setHasError(true);
      setError(new Error(event.reason));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-red-800 text-lg font-semibold mb-2">
          Application Error
        </h2>
        <p className="text-red-600 mb-4">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <div className="space-y-2">
          <button
            onClick={resetError}
            className="block w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Open Standalone App
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function CryptoPaymentIntegration() {
  const [debugInfo, setDebugInfo] = useState(false);
  const [federationStatus, setFederationStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkFederationStatus = async () => {
      try {
        await fetch('http://localhost:3001/', { method: 'HEAD', mode: 'no-cors' });
        setFederationStatus('connected');
      } catch (error) {
        setFederationStatus('disconnected');
      }
    };

    checkFederationStatus();
    const interval = setInterval(checkFederationStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (federationStatus) {
      case 'connected': return '🟢';
      case 'disconnected': return '🔴';
      case 'checking': return '🟡';
    }
  };

  const getStatusText = () => {
    switch (federationStatus) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'checking': return 'Checking...';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          MedSup Pro - Crypto Payment
        </h1>
        <p className="text-gray-600">
          Secure cryptocurrency payments powered by Module Federation
        </p>
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setDebugInfo(!debugInfo)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {debugInfo ? 'Hide' : 'Show'} Debug Info
          </button>
          <div className="text-sm">
            Federation Status: {getStatusIcon()} {getStatusText()}
          </div>
        </div>
      </header>

      {debugInfo && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
          <h3 className="font-semibold mb-2">Module Federation Debug Info:</h3>
          <ul className="space-y-1 text-gray-700">
            <li><strong>Remote:</strong> crypto-payment@localhost:3001</li>
            <li><strong>Exposed Module:</strong> ./CryptoPaymentApp</li>
            <li><strong>Loading Strategy:</strong> Federation with iframe fallback</li>
            <li><strong>Shared Dependencies:</strong> React, ReactDOM, Effector</li>
            <li><strong>Error Handling:</strong> Automatic fallback to iframe</li>
            <li><strong>Current Status:</strong> {federationStatus}</li>
          </ul>
          <div className="mt-2 space-x-2">
            <a 
              href="http://localhost:3001/remoteEntry.js" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Check Remote Entry
            </a>
            <a 
              href="http://localhost:3001" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Open MFE Standalone
            </a>
          </div>
        </div>
      )}

      <MicrofrontendErrorBoundary>
        <div className="max-w-2xl mx-auto">
          <FederatedCryptoPayment />
        </div>
      </MicrofrontendErrorBoundary>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-2">Microfrontend Architecture</h4>
          <p>
            This crypto payment functionality is implemented as a separate microfrontend
            using Vite Module Federation with automatic iframe fallback for reliability.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              View Standalone App
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">
              Status: {window.navigator.onLine ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CryptoPaymentIntegration;
