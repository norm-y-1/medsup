import { PaymentFormData, AdyenPaymentRequest } from '../types';

export class PaymentService {
  generatePaymentReference(): string {
    return `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createPaymentRequest(formData: PaymentFormData): AdyenPaymentRequest {
    const request: AdyenPaymentRequest = {
      amount: {
        value: Math.round(formData.amount * 100), // Convert to minor units
        currency: formData.currency
      },
      reference: formData.reference || this.generatePaymentReference(),
      paymentMethod: {
        type: 'scheme' // Default to card payment
      },
      returnUrl: `${window.location.origin}/payment/result`,
      merchantAccount: process.env.VITE_ADYEN_MERCHANT_ACCOUNT || 'YourMerchantAccount',
      countryCode: 'NL',
      shopperLocale: 'en_US'
    };

    if (formData.shopperEmail) {
      request.shopperEmail = formData.shopperEmail;
      request.shopperReference = formData.shopperEmail;
    }

    return request;
  }

  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  validatePaymentForm(formData: PaymentFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.amount || formData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!formData.currency) {
      errors.push('Currency is required');
    }

    if (formData.shopperEmail && !this.isValidEmail(formData.shopperEmail)) {
      errors.push('Invalid email address');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const paymentService = new PaymentService();
