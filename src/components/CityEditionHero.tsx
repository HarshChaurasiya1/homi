import React from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight,
} from 'lucide-react'
import type { CityFlowchart } from '../data/flowcharts'
import { CITY_FLOWCHARTS } from '../data/flowcharts'

interface CityEditionHeroProps {
  currentCityId: string
  onSelectCity?: (cityId: string) => void
  onExploreFlowchart?: () => void
  className?: string
}

/**
 * CityEditionHero Component
 * Implements the ultra-clean, airy editorial theme inspired by the user's reference:
 * - Fluid sky-blue / ivory gradient background
 * - Crisp, bold grotesque sans typography ("Jaipur Edition")
 * - Micro-metadata row with minimalist icons (Date/Season, Duration, Location)
 * - Heroic architectural centerpiece photo
 * - Clean white info strip with fine hairline dividers
 * - Modern slate-blue pill CTA button
 */
export const CityEditionHero: React.FC<CityEditionHeroProps> = ({
  currentCityId,
  onSelectCity,
  onExploreFlowchart,
  className = '',
}) => {
  const cityFlow: CityFlowchart =
    CITY_FLOWCHARTS[currentCityId.toLowerCase()] || CITY_FLOWCHARTS.jaipur

  const allEditions = Object.values(CITY_FLOWCHARTS)

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-sm bg-gradient-to-b from-[#F0F5FA] via-[#F8FAFC] to-white ${className}`}
    >
      {/* Background Soft Fluid Glow Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#DCE8F5]/60 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gradient-to-tr from-[#E6EFF8]/50 to-transparent rounded-full blur-3xl pointer-events-none -ml-20"></div>

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-10 pb-8 sm:pb-10 flex flex-col items-center text-center space-y-6 sm:space-y-8">
        {/* Top Edition Selector Tabs (clean minimalist pills) */}
        {onSelectCity && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-white/80 backdrop-blur-md rounded-full border border-[#E2E8F0] shadow-2xs">
            {allEditions.map((ed) => {
              const isSelected = ed.cityId === cityFlow.cityId
              return (
                <button
                  key={ed.cityId}
                  onClick={() => onSelectCity(ed.cityId)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E293B] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70'
                  }`}
                >
                  {ed.cityName}
                </button>
              )
            })}
          </div>
        )}

        {/* Brand & Supertitle Row */}
        <div className="space-y-1 sm:space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#475569] text-[11px] font-semibold tracking-wide uppercase">
            <Compass className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>The HOMI Travel Discovery Tour</span>
          </div>

          {/* Crisp, Bold Modern Headline ("Jaipur Edition") */}
          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#0F172A] tracking-tight">
            {cityFlow.editionTitle}
          </h1>

          <p className="text-sm sm:text-base text-[#475569] max-w-xl mx-auto font-normal">
            {cityFlow.tagline}
          </p>
        </div>

        {/* Micro-Metadata Row with Minimalist Icons */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 sm:gap-x-8 text-xs text-[#334155] font-medium pt-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#64748B]" />
            <span>{cityFlow.bestSeason}</span>
          </div>

          <div className="hidden sm:block text-slate-300">•</div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#64748B]" />
            <span>{cityFlow.idealStay}</span>
          </div>

          <div className="hidden sm:block text-slate-300">•</div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#64748B]" />
            <span>{cityFlow.startingGateway.split('&')[0].trim()}</span>
          </div>
        </div>

        {/* Centerpiece Architectural Elevation Photo with Clean Framing */}
        <div className="relative w-full max-w-3xl aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-[#CBD5E1]/70 shadow-lg group bg-slate-900">
          <img
            src={cityFlow.heroImage}
            alt={cityFlow.heroImageAlt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          />

          {/* Subtle bottom vignette to ensure contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

          {/* Floating Local Host Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/60 shadow-md text-xs font-bold text-[#0F172A]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Curated by {cityFlow.curatorName}</span>
            <span className="text-slate-400 font-normal">({cityFlow.curatorBadge})</span>
          </div>

          {/* Bottom Floating Tagline on Photo */}
          <div className="absolute bottom-4 left-4 right-4 text-left text-white hidden sm:flex items-center justify-between text-xs">
            <span className="font-semibold tracking-wide drop-shadow-sm">
              {cityFlow.cityName} Official Verified City Trail
            </span>
            <span className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md text-[11px] font-medium border border-white/20">
              5 Connected Checkpoints
            </span>
          </div>
        </div>

        {/* Clean White Info Strip with Hairline Column Dividers */}
        <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-2xl border border-[#E2E8F0] shadow-sm p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 gap-3 sm:gap-0 text-left">
            {/* Column 1 */}
            <div className="sm:px-4 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                Gateway Point
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                {cityFlow.startingGateway.split('&')[0].trim()}
              </p>
            </div>

            {/* Column 2 */}
            <div className="sm:px-4 pt-2 sm:pt-0 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                Ideal Duration
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0F172A]">
                {cityFlow.idealStay}
              </p>
            </div>

            {/* Column 3 */}
            <div className="sm:px-4 pt-2 sm:pt-0 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                Best Timing
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#0F172A]">
                Golden Hour (Sunrise & Sunset)
              </p>
            </div>
          </div>
        </div>

        {/* Modern Pill CTA Button in Calm Slate Blue */}
        <div className="pt-1 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onExploreFlowchart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Explore {cityFlow.cityName} Flowchart</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href={`/planner`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#334155] border border-[#CBD5E1] text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>Customize with AI Brain</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
          </a>
        </div>
      </div>
    </div>
  )
}
