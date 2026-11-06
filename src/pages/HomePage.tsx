import React from 'react'
import { MMTHomeInterface } from '../components/MMTHomeInterface'

export const HomePage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  return (
    <div className="w-full space-y-6 px-3 sm:px-4 py-4 sm:py-6">
      <MMTHomeInterface onSaveToast={onSaveToast} />
    </div>
  )
}

export default HomePage
