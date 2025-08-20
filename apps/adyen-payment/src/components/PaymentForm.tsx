import React, { useEffect, useRef, useState } from 'react';
import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/adyen.css';
import './PaymentForm.css';
import { useUnit } from 'effector-react';
import { $paymentForm, setError } from '../store/paymentStore';
import { mockAdyenService } from '../services/mockAdyenService';

interface PaymentFormProps {
  onPaymentCompleted?: (result: any) => void;
  onPaymentError?: (error: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onPaymentCompleted,
  onPaymentError
}) => {
  const checkoutRef = useRef<HTMLDivElement>(null);
  const checkoutInstanceRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const paymentForm = useUnit($paymentForm);

  const initializeAdyenCheckout = async () => {
    if (!checkoutRef.current || isInitialized) return;

    try {
      console.log('Initializing Adyen checkout...');
      
      const configuration = {
        environment: 'test' as const,
        clientKey: 'test_226BB2VZWNDB3AINZXXPKZZ6TECNTRMS',
        analytics: {
          enabled: false
        },
        // Payment methods configuration for demo
        paymentMethodsResponse: {
          paymentMethods: [
            {
              name: 'Cards',
              type: 'scheme',
              brands: ['visa', 'mc', 'amex', 'discover', 'maestro'],
              details: [
                { key: 'number', type: 'cardToken' },
                { key: 'expiryMonth', type: 'cardToken' },
                { key: 'expiryYear', type: 'cardToken' },
                { key: 'cvc', type: 'cardToken' },
                { key: 'holderName', type: 'cardToken', optional: true }
              ]
            },
            {
              name: 'iDEAL',
              type: 'ideal',
              details: [
                {
                  key: 'issuer',
                  type: 'select',
                  items: [
                    { id: '1121', name: 'Test Issuer' },
                    { id: '1154', name: 'Test Issuer 2' },
                    { id: '1153', name: 'Test Issuer 3' }
                  ]
                }
              ]
            },
            {
              name: 'BLIK',
              type: 'blik'
            },
            {
              name: 'Klarna Pay now',
              type: 'klarna'
            }
          ]
        },
        amount: {
          value: paymentForm.amount * 100, // Convert to minor units
          currency: paymentForm.currency
        },
        countryCode: 'NL',
        locale: 'en-US',
        paymentMethodsConfiguration: {
          card: {
            hasHolderName: false,
            holderNameRequired: false,
            billingAddressRequired: false,
            enableStoreDetails: true,
            name: 'Cards',
            showPayButton: true
          },
          ideal: {
            showImage: true,
            showPayButton: true
          },
          blik: {
            showPayButton: true
          },
          klarna: {
            showPayButton: true
          }
        },
        onSubmit: async (state: any, dropin: any) => {
          console.log('Payment submitted:', state);
          try {
            dropin.setStatus('loading');
            
            // Use mock service for payment submission
            const result = await mockAdyenService.submitPayment({
              ...state.data,
              amount: {
                value: paymentForm.amount * 100,
                currency: paymentForm.currency
              },
              reference: paymentForm.reference || 'payment-' + Date.now()
            });
            
            if (result.resultCode === 'Authorised') {
              dropin.setStatus('success');
              if (onPaymentCompleted) {
                onPaymentCompleted(result);
              }
            } else if (result.resultCode === 'Refused') {
              dropin.setStatus('error', {
                message: result.refusalReason || 'Payment was declined'
              });
              if (onPaymentError) {
                onPaymentError(new Error(result.refusalReason || 'Payment declined'));
              }
            } else if (result.action) {
              // Handle 3D Secure or other actions
              dropin.handleAction(result.action);
            }
          } catch (error) {
            console.error('Payment submission error:', error);
            dropin.setStatus('error', {
              message: 'Payment failed. Please try again.'
            });
            if (onPaymentError) {
              onPaymentError(error);
            }
          }
        },
        onAdditionalDetails: async (state: any, dropin: any) => {
          console.log('Additional details required:', state);
          try {
            const result = await mockAdyenService.handleAction(state.data);
            if (result.resultCode === 'Authorised') {
              dropin.setStatus('success');
              if (onPaymentCompleted) {
                onPaymentCompleted(result);
              }
            } else {
              dropin.setStatus('error', {
                message: 'Authentication failed'
              });
            }
          } catch (error) {
            console.error('Action handling error:', error);
            dropin.setStatus('error', {
              message: 'Authentication failed'
            });
          }
        },
        onError: (error: any) => {
          console.error('Adyen error:', error);
          setError(error.message || 'Payment initialization failed');
          if (onPaymentError) {
            onPaymentError(error);
          }
        }
      };

      const checkout = await AdyenCheckout(configuration);
      const dropin = checkout.create('dropin');
      
      dropin.mount(checkoutRef.current);
      checkoutInstanceRef.current = checkout;
      setIsInitialized(true);
      
      console.log('Adyen checkout initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize Adyen checkout:', error);
      setError('Failed to initialize payment form');
      if (onPaymentError) {
        onPaymentError(error);
      }
    }
  };

  useEffect(() => {
    if (paymentForm.amount > 0) {
      initializeAdyenCheckout();
    }

    // Cleanup on unmount
    return () => {
      if (checkoutInstanceRef.current) {
        try {
          checkoutInstanceRef.current = null;
        } catch (error) {
          console.error('Error cleaning up checkout:', error);
        }
      }
    };
  }, [paymentForm.amount, paymentForm.currency]);

  return (
    <div className="max-w-md mx-auto bg-white">
      {/* Payment Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Checkout</h2>
        <p className="text-sm text-gray-600 uppercase tracking-wide">
          How would you like to pay?
        </p>
      </div>

      {/* Adyen Drop-in Container */}
      <div className="mb-6">
        <div 
          ref={checkoutRef} 
          className="adyen-checkout-container"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Loading State */}
      {!isInitialized && paymentForm.amount > 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading payment form...</span>
        </div>
      )}

      {/* Footer - Netherlands Country Selector */}
      <div className="mt-6 border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-6 h-4 bg-gradient-to-b from-red-500 via-white to-blue-500 border border-gray-300"></span>
            <span className="text-sm text-gray-700">Netherlands</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
