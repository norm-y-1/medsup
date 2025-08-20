import { useEffect } from 'react';
import { useStore } from 'effector-react';
import { PaymentRequest } from '../types';
import {
  $isLoading,
  checkPaymentStatus,
  resetPayment
} from '../store/paymentStore';

interface Props {
  payment: PaymentRequest;
}

function PaymentStatus({ payment }: Props) {
  const isLoading = useStore($isLoading);

  useEffect(() => {
    // Poll for status updates every 10 seconds
    const interval = setInterval(() => {
      if (payment.status !== 'completed' && payment.status !== 'failed' && payment.status !== 'expired') {
        checkPaymentStatus(payment.id);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [payment.id, payment.status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'awaiting_confirmation':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'confirmed':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Waiting for payment';
      case 'awaiting_confirmation':
        return 'Payment detected, awaiting confirmations';
      case 'confirmed':
        return 'Payment confirmed';
      case 'completed':
        return 'Payment completed successfully';
      case 'failed':
        return 'Payment failed';
      case 'expired':
        return 'Payment expired';
      default:
        return 'Unknown status';
    }
  };

  const formatTimeRemaining = () => {
    const now = new Date().getTime();
    const expires = new Date(payment.expiresAt).getTime();
    const remaining = expires - now;

    if (remaining <= 0) return 'Expired';

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const isCompleted = payment.status === 'completed';
  const isFailed = payment.status === 'failed' || payment.status === 'expired';

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(payment.status)}`}>
            {getStatusText(payment.status)}
          </div>

          <h2 className="text-xl font-semibold mt-4 mb-2">Payment Details</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">
                {payment.cryptoAmount} {payment.cryptoCurrency.symbol}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Value:</span>
              <span className="font-medium">
                ${payment.amount} {payment.currency}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-mono text-xs">{payment.id}</span>
            </div>

            {!isCompleted && !isFailed && (
              <div className="flex justify-between">
                <span className="text-gray-600">Time remaining:</span>
                <span className="font-medium text-orange-600">
                  {formatTimeRemaining()}
                </span>
              </div>
            )}
          </div>

          {!isCompleted && !isFailed && (
            <>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Send Payment To:</h3>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-600">Wallet Address:</span>
                    <button
                      onClick={() => copyToClipboard(payment.walletAddress)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="font-mono text-sm break-all bg-white p-2 rounded border">
                    {payment.walletAddress}
                  </div>
                </div>

                {payment.qrCode && (
                  <div className="mt-4 text-center">
                    <img
                      src={payment.qrCode}
                      alt="Payment QR Code"
                      className="mx-auto border rounded"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Scan with your wallet app
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Instructions:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Send exactly {payment.cryptoAmount} {payment.cryptoCurrency.symbol}</li>
                  <li>2. to the address above</li>
                  <li>3. Wait for network confirmations</li>
                  <li>4. Payment will be confirmed automatically</li>
                </ol>
              </div>
            </>
          )}

          {isCompleted && (
            <div className="mt-6 p-4 bg-green-50 rounded-md text-center">
              <div className="text-green-600 text-4xl mb-2">✓</div>
              <h3 className="text-lg font-medium text-green-900">Payment Successful!</h3>
              <p className="text-green-700 mt-1">
                Your payment has been processed successfully.
              </p>
            </div>
          )}

          {isFailed && (
            <div className="mt-6 p-4 bg-red-50 rounded-md text-center">
              <div className="text-red-600 text-4xl mb-2">✗</div>
              <h3 className="text-lg font-medium text-red-900">
                {payment.status === 'expired' ? 'Payment Expired' : 'Payment Failed'}
              </h3>
              <p className="text-red-700 mt-1">
                {payment.status === 'expired' 
                  ? 'The payment window has expired. Please create a new payment request.'
                  : 'There was an issue processing your payment. Please try again.'
                }
              </p>
            </div>
          )}

          <div className="mt-6 flex space-x-3">
            {(isCompleted || isFailed) && (
              <button
                onClick={() => resetPayment()}
                className="flex-1 px-4 py-2 bg-crypto-primary text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                New Payment
              </button>
            )}
            
            {!isCompleted && !isFailed && (
              <button
                onClick={() => checkPaymentStatus(payment.id)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Checking...' : 'Check Status'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentStatus;
