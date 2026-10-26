import React, { useState } from 'react'
import {
  Sparkles,
  Bot,
  ArrowRight,
  CheckCircle2,
  Send,
  Loader2,
  Lightbulb,
} from 'lucide-react'
import {
  getGeminiPersonalizedCardSelection,
  type GeminiCardSelectionRecommendation,
} from '../services/geminiTravelBrain'
import type { BudgetTier } from '../lib/plannerEngine'

interface GeminiTripPersonalizerProps {
  cityName: string
  cityId: string
  onApplyRecommendation: (rec: {
    days: number
    budgetTier: BudgetTier
    vibe: string
  }) => void
  className?: string
}

export const GeminiTripPersonalizer: React.FC<GeminiTripPersonalizerProps> = ({
  cityName,
  cityId,
  onApplyRecommendation,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<GeminiCardSelectionRecommendation | null>(null)

  const quickPresets = [
    {
      label: 'Family with Elders',
      desc: 'Gentle walking, sacred temples, relaxed afternoon tea',
      vibe: 'family',
      budget: 'moderate',
      days: 3,
    },
    {
      label: 'College Friends Gang',
      desc: 'Street food chaat crawl, sunset rooftops, budget e-rickshaws',
      vibe: 'friends',
      budget: 'budget',
      days: 2,
    },
    {
      label: 'Solo Culture & Photo',
      desc: 'Subah-e-Banaras dawn light, hidden galis, authentic silence',
      vibe: 'solo',
      budget: 'moderate',
      days: 4,
    },
    {
      label: 'Romantic Getaway',
      desc: 'Private dawn wooden boat, candlelight rooftop dining, ghats',
      vibe: 'couple',
      budget: 'premium',
      days: 3,
    },
  ]

  const handleRunGemini = async (travelerInput: string, vibePref?: string, budgetPref?: string) => {
    setIsLoading(true)
    try {
      const result = await getGeminiPersonalizedCardSelection({
        cityId,
        cityName,
        travelerDescription: travelerInput,
        vibe: vibePref,
        budget: budgetPref,
      })
      setRecommendation(result)
    } catch (err) {
      console.error('Gemini error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = () => {
    if (recommendation) {
      onApplyRecommendation({
        days: recommendation.recommendedDays,
        budgetTier: recommendation.recommendedBudgetTier,
        vibe: recommendation.recommendedVibe,
      })
      setIsOpen(false)
    }
  }

  return (
    <div
      className={`rounded-3xl border-2 border-[#FDE68A] bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDF6E2] p-6 shadow-sm space-y-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FDE68A] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EA580C] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#9A3412]">
              <Sparkles className="w-3 h-3 text-[#D97706]" />
              <span>Homi Bhai Travel Brain</span>
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
              Personalize Cards with Homi Bhai
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-1.5 rounded-full bg-white text-[#9A3412] text-xs font-bold border border-[#FDE68A] hover:bg-[#FFFBEB] transition-colors self-start sm:self-auto shadow-2xs"
        >
          {isOpen ? 'Close Assistant' : '✨ Ask Homi Bhai to Pick Cards'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <p className="text-xs text-[#78350F] leading-relaxed">
            Tell Homi Bhai who is traveling. Your local travel companion will evaluate crowd density, walking fatigue, and timing to pick the ideal duration and budget cards for you.
          </p>

          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {quickPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleRunGemini(preset.desc, preset.vibe, preset.budget)}
                disabled={isLoading}
                className="p-3 rounded-2xl bg-white/90 border border-[#FDE68A] hover:border-[#EA580C] text-left transition-all hover:bg-white text-xs group cursor-pointer shadow-2xs"
              >
                <div className="font-bold text-[#201C1A] group-hover:text-[#EA580C] flex items-center justify-between">
                  <span>{preset.label}</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-[#78350F] mt-1 line-clamp-2">{preset.desc}</p>
              </button>
            ))}
          </div>

          {/* Custom Prompt Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Or describe in your own words (e.g. 2 college friends wanting food & sunrises under 4k)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customPrompt.trim()) {
                  handleRunGemini(customPrompt)
                }
              }}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-[#FDE68A] text-xs font-medium text-[#201C1A] placeholder:text-[#9A3412]/50 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
            />
            <button
              type="button"
              onClick={() => customPrompt.trim() && handleRunGemini(customPrompt)}
              disabled={isLoading || !customPrompt.trim()}
              className="px-5 py-2.5 rounded-2xl bg-[#EA580C] text-white text-xs font-bold hover:bg-[#C2410C] transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Ask Homi Bhai</span>
            </button>
          </div>

          {/* Recommendation Result Card */}
          {recommendation && (
            <div className="p-5 rounded-2xl bg-white border-2 border-[#EA580C] shadow-md space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#FEF3C7]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="font-editorial text-base font-bold text-[#201C1A]">
                    Homi Bhai's Tailored Recommendation
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#9A3412] text-[11px] font-bold">
                  Card Selection Ready
                </span>
              </div>

              {/* Greeting */}
              <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] italic">
                “{recommendation.localFriendGreeting}”
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC]">
                  <span className="text-[#8C2D19] font-bold block text-[10px] uppercase">
                    Duration Card
                  </span>
                  <strong className="text-sm font-bold text-[#201C1A]">
                    {recommendation.recommendedDays} Days
                  </strong>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {recommendation.recommendedDaysReason}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC]">
                  <span className="text-[#8C2D19] font-bold block text-[10px] uppercase">
                    Budget Tier Card
                  </span>
                  <strong className="text-sm font-bold text-[#201C1A] capitalize">
                    {recommendation.recommendedBudgetTier}
                  </strong>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    {recommendation.recommendedBudgetReason}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7DC]">
                  <span className="text-[#8C2D19] font-bold block text-[10px] uppercase">
                    Must-Visit Spots
                  </span>
                  <ul className="text-[11px] text-stone-600 list-disc list-inside mt-0.5">
                    {recommendation.highlightedSpotNames.map((sp, idx) => (
                      <li key={idx} className="truncate">
                        {sp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#78350F]">
                <Lightbulb className="w-4 h-4 text-[#D97706] shrink-0" />
                <span>{recommendation.localAdviceText}</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-6 py-2.5 rounded-xl bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#6E1F0F] transition-all flex items-center gap-2 shadow-xs cursor-pointer hover:scale-102"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Apply Homi Bhai's Recommendation to Wizard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const HomiBhaiTripPersonalizer = GeminiTripPersonalizer
