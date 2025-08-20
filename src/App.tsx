import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { CatalogPage } from './pages/CatalogPage'
import AdyenPaymentIntegration from './pages/AdyenPaymentIntegration'
import { useUnit } from 'effector-react'
import { $cartCount, openCart } from './features/cart/model/cart'
import { CartDrawer } from './features/cart/ui/CartDrawer'
import { faCartShopping, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useRef } from 'react'
import useClickOutside from './shared/hooks/useClickOutSide'

export const App = () => {
  const navigate = useNavigate()
  const count = useUnit($cartCount)
  const [isMFEDropdownOpen, setIsMFEDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setIsMFEDropdownOpen(false), isMFEDropdownOpen)

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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsMFEDropdownOpen(!isMFEDropdownOpen)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  MFE
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-xs transition-transform ${isMFEDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isMFEDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[160px] z-50">
                    <Link 
                      to="/adyen-payment" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMFEDropdownOpen(false)}
                    >
                      Adyen Payment
                    </Link>
                  </div>
                )}
              </div>
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
          <Route path="/adyen-payment" element={<AdyenPaymentIntegration />} />
        </Routes>
      </main>

      <CartDrawer />
    </div>
  )
}
