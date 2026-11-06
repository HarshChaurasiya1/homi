import React from 'react'
import { InteractiveTripBuilder } from '../components/InteractiveTripBuilder'

export const HomePage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  return (
    <div className="w-full px-2 sm:px-4 py-3 sm:py-6">
      <InteractiveTripBuilder onSaveToast={onSaveToast} initialCityId="varanasi" />
    </div>
  )
}

export default HomePage
