import React, { useEffect } from 'react'
import { Bookmark, X } from 'lucide-react'


interface ToastProps {
  message: string | null
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose()
    }, 3200)
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-sm z-50 bg-[#201C1A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between gap-3 text-sm transition-all animate-in fade-in slide-in-from-bottom-2"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5">
        <Bookmark className="w-4 h-4 text-[#D97706] flex-shrink-0" />
        <span className="leading-tight">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-stone-400 hover:text-white rounded-md"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
