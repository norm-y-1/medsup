import React, { useRef, useEffect } from 'react';
import useClickOutside from '../hooks/useClickOutSide';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
}

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  className = '',
  overlayClassName = ''
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useClickOutside(popupRef, onClose, isOpen);

  // Close popup when pressing Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayClassName}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'popup-title' : undefined}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Popup Container */}
      <div
        ref={popupRef}
        className={`relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-lg transition-all duration-200 ease-out ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="mb-4 flex items-center justify-between">
            {title && (
              <h2 id="popup-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close popup"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="popup-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
