import React from 'react'
import { InteractiveTripBuilder } from '../components/InteractiveTripBuilder'
import { Sparkles } from 'lucide-react'

export const PlannerPage: React.FC<{ onSaveToast: (msg: string) => void }> = ({ onSaveToast }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Header */}
      <section className="bg-white border-b border-[#E8DFD3] pt-8 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] text-xs font-bold uppercase tracking-wider text-[#8C2D19]">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Kid-Simple 1-by-1 Flow • User Board</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#201C1A]">
            Design Your Dream Trip in 30 Seconds
          </h1>

          <p className="text-sm sm:text-base text-[#645C55] max-w-2xl mx-auto leading-relaxed">
            Answer 3 fun questions. Your city friend (like Jaipur's <em>Bhaisaab</em> or Udaipur's <em>Banna Sa</em>) crafts a complete trip board with Reddit-voted cafes, secret sunspots, and verified rupee budgets.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <InteractiveTripBuilder onSaveToast={onSaveToast} />
      </div>
    </div>
  )
}
