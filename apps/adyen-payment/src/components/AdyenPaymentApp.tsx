import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import {
  $paymentState,
  $isLoading,
  $error,
  updatePaymentForm,
  resetPayment,
  setError
} from '../store/paymentStore';
import { PaymentFormData } from '../types';
import { paymentService } from '../services/paymentService';
import PaymentForm from './PaymentForm';
import PaymentStatus from './PaymentStatus';
import ErrorBoundary from './ErrorBoundary';

interface AdyenPaymentAppProps {
  initialAmount?: number;
  initialCurrency?: 'USD' | 'EUR' | 'GBP';
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

function AdyenPaymentApp({ 
  initialAmount, 
  initialCurrency = 'EUR',
  onPaymentSuccess,
  onPaymentError 
}: AdyenPaymentAppProps = {}) {
  const paymentState = useUnit($paymentState);
  const isLoading = useUnit($isLoading);
  const error = useUnit($error);

  useEffect(() => {
    // Initialize form with props
    if (initialAmount || initialCurrency) {
      updatePaymentForm({
        amount: initialAmount || 0,
        currency: initialCurrency,
        reference: paymentService.generatePaymentReference()
      });
    }
  }, [initialAmount, initialCurrency]);

  useEffect(() => {
    // Handle payment success callback
    if (paymentState.status === 'success' && onPaymentSuccess && paymentState.paymentData?.pspReference) {
      onPaymentSuccess(paymentState.paymentData.pspReference);
    }
  }, [paymentState.status, paymentState.paymentData, onPaymentSuccess]);

  useEffect(() => {
    // Handle payment error callback
    if (paymentState.status === 'error' && onPaymentError && error) {
      onPaymentError(error);
    }
  }, [paymentState.status, error, onPaymentError]);

  const handlePaymentSubmit = async (formData: PaymentFormData) => {
    try {
      // Note: With Adyen Web SDK, the actual payment submission 
      // is handled by the Drop-in component's onSubmit callback
      // This function now mainly handles the form validation and state updates
      console.log('Payment form data validated:', formData);
      
      const paymentRequest = paymentService.createPaymentRequest(formData);
      console.log('Payment request created:', paymentRequest);
      
      // The actual submission to Adyen will be handled by the Drop-in component
      // You can add additional logic here if needed
      
    } catch (err) {
      console.error('Failed to process payment form:', err);
      setError('Failed to process payment form. Please try again.');
    }
  };

  const handleRetry = () => {
    resetPayment();
  };

  const handleSuccess = (paymentId: string) => {
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentId);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Secure Payment</h1>
            <p className="mt-2 text-lg text-gray-600">
              Complete your payment securely with Adyen
            </p>
          </div>

          {paymentState.status === 'idle' ? (
            <PaymentForm />
          ) : (
            <PaymentStatus 
              onRetry={handleRetry}
              onSuccess={handleSuccess}
            />
          )}

          {/* Adyen branding */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
              Powered by Adyen - Secure Payment Processing
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default AdyenPaymentApp;
