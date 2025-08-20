import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { CatalogPage } from './pages/CatalogPage'
import CryptoPaymentIntegration from './pages/CryptoPaymentIntegration'
import { useUnit } from 'effector-react'
import { $cartCount, openCart } from './features/cart/model/cart'
import { CartDrawer } from './features/cart/ui/CartDrawer'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const App = () => {
  const navigate = useNavigate()
  const count = useUnit($cartCount)

  return (
    <div>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-xl font-semibold tracking-tight text-brand-700"
            >
              MedSup Pro
            </button>
            <nav className="flex gap-4">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Catalog
              </Link>
              <Link to="/crypto-payment" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Crypto Payment
              </Link>
              <Link to="https://medline.com" target='_blank' className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Medline
              </Link>
            </nav>
          </div>
          <button
            data-testid="open-cart"
            onClick={() => openCart()}
            className="btn btn-primary gap-2"
            aria-label="Open cart"
            title="Open cart"
          >
            <FontAwesomeIcon className="ml-2 text-white" icon={faCartShopping} />
            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-white text-brand-700 w-6 h-6 text-xs">{count}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/crypto-payment" element={<CryptoPaymentIntegration />} />
        </Routes>
      </main>

      <CartDrawer />
    </div>
  )
}
