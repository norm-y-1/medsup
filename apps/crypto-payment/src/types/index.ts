export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  price: number;
  enabled: boolean;
}

export interface PaymentRequest {
  id: string;
  amount: number;
  currency: 'USD' | 'EUR';
  cryptoCurrency: CryptoCurrency;
  cryptoAmount: number;
  walletAddress: string;
  status: PaymentStatus;
  createdAt: Date;
  expiresAt: Date;
  qrCode?: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'awaiting_confirmation'
  | 'confirmed'
  | 'completed'
  | 'expired'
  | 'failed';

export interface PaymentFormData {
  amount: number;
  currency: 'USD' | 'EUR';
  selectedCrypto: string;
  email?: string;
}

export interface WalletInfo {
  address: string;
  qrCode: string;
  network: string;
}
