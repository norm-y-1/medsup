import { useUnit } from 'effector-react';
import { $paymentState, resetPayment } from '../store/paymentStore';
import { paymentService } from '../services/paymentService';

interface PaymentStatusProps {
  onRetry?: () => void;
  onSuccess?: (paymentId: string) => void;
}

function PaymentStatus({ onRetry, onSuccess }: PaymentStatusProps = {}) {
  const paymentState = useUnit($paymentState);

  const handleRetry = () => {
    resetPayment();
    if (onRetry) {
      onRetry();
    }
  };

  const handleSuccess = () => {
    if (onSuccess && paymentState.paymentData?.pspReference) {
      onSuccess(paymentState.paymentData.pspReference);
    }
  };

  if (paymentState.status === 'loading') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Payment</h3>
          <p className="text-sm text-gray-500">
            Please wait while we process your payment securely...
          </p>
        </div>
      </div>
    );
  }

  if (paymentState.status === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-sm text-gray-500 mb-4">
            Your payment has been processed successfully.
          </p>
          {paymentState.paymentData?.pspReference && (
            <div className="bg-gray-50 rounded-md p-3 mb-4">
              <p className="text-xs text-gray-500">Transaction ID</p>
              <p className="text-sm font-mono text-gray-900">
                {paymentState.paymentData.pspReference}
              </p>
            </div>
          )}
          {paymentState.paymentData?.amount && (
            <div className="bg-gray-50 rounded-md p-3 mb-4">
              <p className="text-xs text-gray-500">Amount Paid</p>
              <p className="text-lg font-semibold text-gray-900">
                {paymentService.formatAmount(
                  paymentState.paymentData.amount.value / 100,
                  paymentState.paymentData.amount.currency
                )}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleSuccess}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue
            </button>
            <button
              onClick={() => resetPayment()}
              className="flex-1 bg-gray-200 text-gray-900 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              New Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentState.status === 'error') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Failed</h3>
          <p className="text-sm text-gray-500 mb-4">
            {paymentState.error || 'An unexpected error occurred during payment processing.'}
          </p>
          {paymentState.paymentData?.refusalReason && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-xs text-red-500">Reason</p>
              <p className="text-sm text-red-800">
                {paymentState.paymentData.refusalReason}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
            <button
              onClick={() => resetPayment()}
              className="flex-1 bg-gray-200 text-gray-900 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default PaymentStatus;
