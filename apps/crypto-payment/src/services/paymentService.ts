import { PaymentRequest, PaymentFormData, PaymentStatus } from '../types';
import { cryptoService } from './cryptoService';

class PaymentService {
  private payments: Map<string, PaymentRequest> = new Map();

  async createPayment(formData: PaymentFormData): Promise<PaymentRequest> {
    try {
      const currencies = await cryptoService.getSupportedCurrencies();
      const selectedCrypto = currencies.find(c => c.id === formData.selectedCrypto);
      
      if (!selectedCrypto) {
        throw new Error('Invalid cryptocurrency selected');
      }

      const exchangeRate = await cryptoService.getExchangeRate(
        formData.selectedCrypto, 
        formData.currency
      );

      const cryptoAmount = cryptoService.calculateCryptoAmount(
        formData.amount, 
        exchangeRate
      );

      const walletAddress = cryptoService.generateWalletAddress(formData.selectedCrypto);
      
      const paymentId = this.generatePaymentId();
      const payment: PaymentRequest = {
        id: paymentId,
        amount: formData.amount,
        currency: formData.currency,
        cryptoCurrency: selectedCrypto,
        cryptoAmount,
        walletAddress,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        qrCode: this.generateQRCode(walletAddress, cryptoAmount, selectedCrypto.symbol)
      };

      this.payments.set(paymentId, payment);
      
      // Simulate status updates
      this.simulatePaymentProgress(paymentId);
      
      return payment;
    } catch (error) {
      console.error('Failed to create payment:', error);
      throw new Error('Failed to create payment request');
    }
  }

  async checkStatus(paymentId: string): Promise<PaymentRequest> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  private generatePaymentId(): string {
    return 'pay_' + Math.random().toString(36).substr(2, 9);
  }

  private generateQRCode(address: string, amount: number, symbol: string): string {
    // In a real app, you'd use a QR code library
    return `data:image/svg+xml;base64,${btoa(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">
        QR Code
        ${symbol.toUpperCase()}
        ${amount}
        ${address.substring(0, 10)}...
      </text>
    </svg>`)}`;
  }

  private async simulatePaymentProgress(paymentId: string): Promise<void> {
    // Simulate payment progression for demo purposes
    setTimeout(() => {
      const payment = this.payments.get(paymentId);
      if (payment && payment.status === 'pending') {
        payment.status = 'awaiting_confirmation';
        this.payments.set(paymentId, payment);
      }
    }, 5000);

    setTimeout(() => {
      const payment = this.payments.get(paymentId);
      if (payment && payment.status === 'awaiting_confirmation') {
        payment.status = 'confirmed';
        this.payments.set(paymentId, payment);
      }
    }, 15000);

    setTimeout(() => {
      const payment = this.payments.get(paymentId);
      if (payment && payment.status === 'confirmed') {
        payment.status = 'completed';
        this.payments.set(paymentId, payment);
      }
    }, 25000);
  }
}

export const paymentService = new PaymentService();
