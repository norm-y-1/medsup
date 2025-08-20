export interface AdyenPaymentRequest {
  amount: {
    value: number; // Amount in minor units (e.g., cents)
    currency: string;
  };
  reference: string;
  paymentMethod: {
    type: string;
    [key: string]: any;
  };
  returnUrl: string;
  merchantAccount: string;
  countryCode?: string;
  shopperLocale?: string;
  shopperReference?: string;
  shopperEmail?: string;
}

export interface AdyenPaymentResponse {
  resultCode: 'Authorised' | 'Refused' | 'Error' | 'Cancelled' | 'Pending' | 'Received';
  action?: any;
  pspReference?: string;
  refusalReason?: string;
  merchantReference?: string;
  additionalData?: Record<string, string>;
}

export interface PaymentState {
  status: 'idle' | 'loading' | 'success' | 'error';
  paymentData?: any;
  error?: string;
  reference?: string;
}

export interface AdyenConfig {
  environment: 'test' | 'live';
  clientKey: string;
  locale?: string;
  countryCode?: string;
  amount?: {
    value: number;
    currency: string;
  };
}

export interface PaymentFormData {
  amount: number;
  currency: string;
  reference: string;
  shopperEmail?: string;
  description?: string;
}
