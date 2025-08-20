import { createStore, createEvent, createEffect, sample } from 'effector';
import { CryptoCurrency, PaymentRequest, PaymentFormData, PaymentStatus } from '../types';
import { cryptoService } from '../services/cryptoService';
import { paymentService } from '../services/paymentService';

// Events
export const selectCryptoCurrency = createEvent<string>();
export const updatePaymentForm = createEvent<Partial<PaymentFormData>>();
export const createPaymentRequest = createEvent<PaymentFormData>();
export const checkPaymentStatus = createEvent<string>();
export const resetPayment = createEvent();

// Effects
export const fetchCryptoCurrenciesFx = createEffect(async () => {
  return await cryptoService.getSupportedCurrencies();
});

export const createPaymentFx = createEffect(async (formData: PaymentFormData) => {
  return await paymentService.createPayment(formData);
});

export const checkPaymentStatusFx = createEffect(async (paymentId: string) => {
  return await paymentService.checkStatus(paymentId);
});

// Stores
export const $cryptoCurrencies = createStore<CryptoCurrency[]>([]);
export const $selectedCrypto = createStore<string>('');
export const $paymentForm = createStore<PaymentFormData>({
  amount: 0,
  currency: 'USD',
  selectedCrypto: '',
  email: ''
});
export const $currentPayment = createStore<PaymentRequest | null>(null);
export const $isLoading = createStore<boolean>(false);
export const $error = createStore<string | null>(null);

// Updates
$cryptoCurrencies.on(fetchCryptoCurrenciesFx.doneData, (_, currencies) => currencies);

$selectedCrypto.on(selectCryptoCurrency, (_, crypto) => crypto);

$paymentForm.on(updatePaymentForm, (form, updates) => ({ ...form, ...updates }));

$currentPayment
  .on(createPaymentFx.doneData, (_, payment) => payment)
  .on(checkPaymentStatusFx.doneData, (current, updated) => 
    current?.id === updated.id ? updated : current
  )
  .reset(resetPayment);

$isLoading
  .on([fetchCryptoCurrenciesFx, createPaymentFx, checkPaymentStatusFx], () => true)
  .on([fetchCryptoCurrenciesFx.done, createPaymentFx.done, checkPaymentStatusFx.done], () => false)
  .on([fetchCryptoCurrenciesFx.fail, createPaymentFx.fail, checkPaymentStatusFx.fail], () => false);

$error
  .on([fetchCryptoCurrenciesFx.fail, createPaymentFx.fail, checkPaymentStatusFx.fail], (_, { error }) => error.message)
  .reset([fetchCryptoCurrenciesFx, createPaymentFx, checkPaymentStatusFx, resetPayment]);

// Sample connections
sample({
  clock: selectCryptoCurrency,
  source: $paymentForm,
  fn: (form, selectedCrypto) => ({ ...form, selectedCrypto }),
  target: updatePaymentForm
});
