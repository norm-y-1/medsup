// Type declarations for Module Federation remotes

declare module 'crypto-payment/CryptoPaymentApp' {
  import { ComponentType } from 'react';
  
  interface CryptoPaymentAppProps {
    initialAmount?: number;
    initialCurrency?: 'USD' | 'EUR';
    onPaymentSuccess?: (paymentId: string) => void;
    onPaymentError?: (error: string) => void;
  }
  
  const CryptoPaymentApp: ComponentType<CryptoPaymentAppProps>;
  export default CryptoPaymentApp;
}

declare module 'crypto-payment/store' {
  import { Store, Event, Effect } from 'effector';
  import { CryptoCurrency, PaymentRequest, PaymentFormData } from 'crypto-payment/types';
  
  export const $cryptoCurrencies: Store<CryptoCurrency[]>;
  export const $selectedCrypto: Store<string>;
  export const $paymentForm: Store<PaymentFormData>;
  export const $currentPayment: Store<PaymentRequest | null>;
  export const $isLoading: Store<boolean>;
  export const $error: Store<string | null>;
  
  export const selectCryptoCurrency: Event<string>;
  export const updatePaymentForm: Event<Partial<PaymentFormData>>;
  export const createPaymentRequest: Event<PaymentFormData>;
  export const checkPaymentStatus: Event<string>;
  export const resetPayment: Event<void>;
  
  export const fetchCryptoCurrenciesFx: Effect<void, CryptoCurrency[], Error>;
  export const createPaymentFx: Effect<PaymentFormData, PaymentRequest, Error>;
  export const checkPaymentStatusFx: Effect<string, PaymentRequest, Error>;
}

declare module 'crypto-payment/types' {
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
}
