import React from 'react'
import { InteractiveTripBuilder } from '../components/InteractiveTripBuilder'

export const PlannerPage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-20">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 pt-2 sm:pt-6">
        <InteractiveTripBuilder onSaveToast={onSaveToast} />
      </div>
    </div>
  )
}
