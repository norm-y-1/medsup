import { useEffect } from 'react';
import { useStore } from 'effector-react';
import {
  $cryptoCurrencies,
  $currentPayment,
  $isLoading,
  $error,
  fetchCryptoCurrenciesFx,
  resetPayment,
  updatePaymentForm
} from '../store/paymentStore';
import PaymentForm from './PaymentForm';
import PaymentStatus from './PaymentStatus';
import ErrorBoundary from './ErrorBoundary';

interface CryptoPaymentAppProps {
  initialAmount?: number;
  initialCurrency?: 'USD' | 'EUR';
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

function CryptoPaymentApp({ 
  initialAmount, 
  initialCurrency = 'USD',
  onPaymentSuccess,
  onPaymentError 
}: CryptoPaymentAppProps = {}) {
  const cryptoCurrencies = useStore($cryptoCurrencies);
  const currentPayment = useStore($currentPayment);
  const isLoading = useStore($isLoading);
  const error = useStore($error);

  useEffect(() => {
    fetchCryptoCurrenciesFx();
    
    // Set initial values if provided
    if (initialAmount || initialCurrency) {
      updatePaymentForm({
        amount: initialAmount || 0,
        currency: initialCurrency
      });
    }
    
    return () => {
      resetPayment();
    };
  }, [initialAmount, initialCurrency]);

  // Handle payment success callback
  useEffect(() => {
    if (currentPayment?.status === 'completed' && onPaymentSuccess) {
      onPaymentSuccess(currentPayment.id);
    }
  }, [currentPayment?.status, onPaymentSuccess]);

  // Handle payment error callback
  useEffect(() => {
    if (error && onPaymentError) {
      onPaymentError(error);
    }
  }, [error, onPaymentError]);

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-red-800 text-lg font-semibold mb-2">Payment Error</h2>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="crypto-payment-container max-w-2xl mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crypto Payment Gateway
          </h1>
          <p className="text-gray-600">
            Secure cryptocurrency payments for MedSup Pro
          </p>
        </header>

        {isLoading && !currentPayment && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-primary"></div>
            <span className="ml-3 text-gray-600">Loading payment options...</span>
          </div>
        )}

        {!currentPayment && !isLoading && cryptoCurrencies.length > 0 && (
          <PaymentForm cryptocurrencies={cryptoCurrencies} />
        )}

        {currentPayment && (
          <PaymentStatus payment={currentPayment} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default CryptoPaymentApp;
