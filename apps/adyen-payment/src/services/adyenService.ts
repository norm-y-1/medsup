import { AdyenPaymentRequest, AdyenPaymentResponse } from '../types';

class AdyenService {
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-backend.com/api' 
    : 'http://localhost:8080/api';

  async submitPayment(paymentRequest: AdyenPaymentRequest): Promise<AdyenPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        throw new Error(`Payment failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Payment submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleAction(action: any): Promise<AdyenPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ details: action }),
      });

      if (!response.ok) {
        throw new Error(`Action handling failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Action handling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPaymentMethods(amount: { value: number; currency: string }, countryCode: string = 'NL'): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/paymentMethods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          countryCode,
          channel: 'Web'
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payment methods: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch payment methods: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const adyenService = new AdyenService();
