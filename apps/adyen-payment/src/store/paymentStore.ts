import { createStore, createEvent, createEffect, sample } from 'effector';
import { AdyenPaymentRequest, AdyenPaymentResponse, PaymentFormData } from '../types';
import { adyenService } from '../services/adyenService';

export interface PaymentState {
  status: 'idle' | 'loading' | 'success' | 'error';
  paymentData?: any;
  error?: string | null;
  reference?: string;
}

// Events
export const initializePayment = createEvent<PaymentFormData>();
export const updatePaymentForm = createEvent<Partial<PaymentFormData>>();
export const submitPayment = createEvent<AdyenPaymentRequest>();
export const handlePaymentAction = createEvent<any>();
export const resetPayment = createEvent();
export const setError = createEvent<string>();

// Effects
export const submitPaymentFx = createEffect<AdyenPaymentRequest, AdyenPaymentResponse>({
  handler: async (paymentRequest) => {
    return await adyenService.submitPayment(paymentRequest);
  }
});

export const handleActionFx = createEffect<any, AdyenPaymentResponse>({
  handler: async (action: any) => {
    return await adyenService.handleAction(action);
  }
});

// Stores
export const $paymentForm = createStore<PaymentFormData>({
  amount: 23.30, // Default amount like in the screenshot
  currency: 'EUR',
  reference: '',
  shopperEmail: '',
  description: 'InsureCare POC Payment'
});

export const $paymentState = createStore<PaymentState>({
  status: 'idle'
});

export const $isLoading = $paymentState.map(state => state.status === 'loading');
export const $error = $paymentState.map(state => state.error || null, { skipVoid: false });
export const $isSuccess = $paymentState.map(state => state.status === 'success');

// Store updates
$paymentForm.on(updatePaymentForm, (state, payload) => ({
  ...state,
  ...payload
}));

$paymentState
  .on(submitPaymentFx, (state) => ({
    ...state,
    status: 'loading',
    error: null
  }))
  .on(submitPaymentFx.doneData, (state, response) => ({
    ...state,
    status: response.resultCode === 'Authorised' ? 'success' : 'error',
    paymentData: response,
    error: response.resultCode !== 'Authorised' ? (response.refusalReason || 'Payment failed') : null
  }))
  .on(submitPaymentFx.failData, (state, error) => ({
    ...state,
    status: 'error',
    error: error.message || 'Payment failed'
  }))
  .on(handleActionFx, (state) => ({
    ...state,
    status: 'loading'
  }))
  .on(handleActionFx.doneData, (state, response) => ({
    ...state,
    status: (response as AdyenPaymentResponse).resultCode === 'Authorised' ? 'success' : 'error',
    paymentData: response,
    error: (response as AdyenPaymentResponse).resultCode !== 'Authorised' ? ((response as AdyenPaymentResponse).refusalReason || 'Action failed') : null
  }))
  .on(handleActionFx.failData, (state, error) => ({
    ...state,
    status: 'error',
    error: (error as any)?.message || 'Action handling failed'
  }))
  .on(setError, (state, error) => ({
    ...state,
    status: 'error',
    error
  }))
  .on(resetPayment, () => ({
    status: 'idle',
    error: null
  }));

// Samples
sample({
  clock: submitPayment,
  target: submitPaymentFx
});

sample({
  clock: handlePaymentAction,
  target: handleActionFx
});
