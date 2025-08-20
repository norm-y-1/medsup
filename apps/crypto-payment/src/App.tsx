import React from 'react'
import CryptoPaymentApp from './components/CryptoPaymentApp'
import './index.css'

function App() {
  return (
    <div className="crypto-payment-app">
      <CryptoPaymentApp />
    </div>
  )
}

export default App

// Export for microfrontend integration
export { default as CryptoPaymentApp } from './components/CryptoPaymentApp'
