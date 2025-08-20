import { useState } from 'react';
import { useStore } from 'effector-react';
import { CryptoCurrency, PaymentFormData } from '../types';
import {
  $paymentForm,
  $selectedCrypto,
  $isLoading,
  updatePaymentForm,
  selectCryptoCurrency,
  createPaymentRequest
} from '../store/paymentStore';

interface Props {
  cryptocurrencies: CryptoCurrency[];
}

function PaymentForm({ cryptocurrencies }: Props) {
  const paymentForm = useStore($paymentForm);
  const selectedCrypto = useStore($selectedCrypto);
  const isLoading = useStore($isLoading);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedCurrency = cryptocurrencies.find(c => c.id === selectedCrypto);

  const handleInputChange = (field: keyof PaymentFormData, value: string | number) => {
    updatePaymentForm({ [field]: value });
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const calculateCryptoAmount = () => {
    if (!selectedCurrency || !paymentForm.amount) return 0;
    return Number((paymentForm.amount / selectedCurrency.price).toFixed(8));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!paymentForm.amount || paymentForm.amount <= 0) {
      errors.amount = 'Please enter a valid amount';
    }

    if (!selectedCrypto) {
      errors.selectedCrypto = 'Please select a cryptocurrency';
    }

    if (paymentForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    createPaymentRequest({
      ...paymentForm,
      selectedCrypto
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
          Amount ({paymentForm.currency})
        </label>
        <div className="relative">
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={paymentForm.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-crypto-primary ${
              formErrors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter amount"
          />
          <span className="absolute right-3 top-2 text-gray-500">
            {paymentForm.currency}
          </span>
        </div>
        {formErrors.amount && (
          <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
        )}
      </div>

      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
        <select
          id="currency"
          value={paymentForm.currency}
          onChange={(e) => handleInputChange('currency', e.target.value as 'USD' | 'EUR')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-crypto-primary"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Cryptocurrency
        </label>
        <div className="grid grid-cols-2 gap-3">
          {cryptocurrencies
            .filter(crypto => crypto.enabled)
            .map((crypto) => (
              <button
                key={crypto.id}
                type="button"
                onClick={() => selectCryptoCurrency(crypto.id)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedCrypto === crypto.id
                    ? 'border-crypto-primary bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{crypto.icon}</span>
                  <div>
                    <div className="font-medium">{crypto.name}</div>
                    <div className="text-sm text-gray-500">
                      ${crypto.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </button>
            ))}
        </div>
        {formErrors.selectedCrypto && (
          <p className="mt-1 text-sm text-red-600">{formErrors.selectedCrypto}</p>
        )}
      </div>

      {selectedCurrency && paymentForm.amount > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-sm text-gray-600 mb-1">You will pay:</div>
          <div className="text-lg font-semibold">
            {calculateCryptoAmount()} {selectedCurrency.symbol}
          </div>
          <div className="text-sm text-gray-500">
            ≈ ${paymentForm.amount} {paymentForm.currency}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email (optional)
        </label>
        <input
          type="email"
          id="email"
          value={paymentForm.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-crypto-primary ${
            formErrors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="your@email.com"
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !paymentForm.amount || !selectedCrypto}
        className="w-full px-4 py-3 bg-crypto-primary text-white rounded-md font-medium 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-crypto-primary 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Creating Payment...
          </div>
        ) : (
          'Create Payment Request'
        )}
      </button>
    </form>
  );
}

export default PaymentForm;
