import AdyenPaymentApp from './components/AdyenPaymentApp';
import './index.css';

function App() {
  return (
    <AdyenPaymentApp 
      initialAmount={100}
      initialCurrency="EUR"
      onPaymentSuccess={(paymentId) => {
        console.log('Payment successful:', paymentId);
      }}
      onPaymentError={(error) => {
        console.error('Payment error:', error);
      }}
    />
  );
}

export default App;
