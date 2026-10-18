import React, { useState } from 'react'
import {
  MapPin,
  Compass,
  Footprints,
  Eye,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Navigation,
  Languages,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { STREET_VIEW_ROUTES } from '../data/streetViewRoutes'
import type { VisualStreetRoute } from '../services/geminiTravelBrain'

interface StreetViewVisualGuideProps {
  initialRouteId?: string
  className?: string
  onClose?: () => void
}

/**
 * Street View Visual Landmark & Navigation Overlay Engine
 * Shows real-world Street View panoramas with friendly local landmarks:
 * "Yahan utro, samne ye building dikhegi, wahan se left/right mudna hai"
 */
export const StreetViewVisualGuide: React.FC<StreetViewVisualGuideProps> = ({
  initialRouteId = 'dashashwamedh_ghat',
  className = '',
  onClose,
}) => {
  const [selectedRouteKey, setSelectedRouteKey] = useState<string>(initialRouteId)
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [useHinglish, setUseHinglish] = useState<boolean>(true)
  const [showPanoOverlay, setShowPanoOverlay] = useState<boolean>(true)

  const routes = Object.values(STREET_VIEW_ROUTES)
  const currentRoute: VisualStreetRoute =
    STREET_VIEW_ROUTES[selectedRouteKey] || STREET_VIEW_ROUTES.dashashwamedh_ghat
  const currentStep = currentRoute.steps[activeStepIndex] || currentRoute.steps[0]

  const handleNextStep = () => {
    if (activeStepIndex < currentRoute.steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1)
    }
  }

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1)
    }
  }

  return (
    <div
      className={`bg-white rounded-3xl border-2 border-[#E5DACB] shadow-lg overflow-hidden flex flex-col space-y-4 ${className}`}
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-[#F2ECE1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C2D19]/10 text-[#8C2D19] text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Street View Visual Landmark Navigator</span>
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#201C1A]">
            {currentRoute.destinationName}
          </h3>
          <p className="text-xs text-[#5D554C] flex items-center gap-2 mt-0.5">
            <Footprints className="w-3.5 h-3.5 text-[#D97706]" />
            <span>
              Drop-off: <strong>{currentRoute.vehicularDropOffName}</strong> •{' '}
              {currentRoute.totalWalkingMeters}m walk (~{currentRoute.approxWalkMinutes} mins)
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Language Toggle: Hinglish vs English */}
          <button
            type="button"
            onClick={() => setUseHinglish(!useHinglish)}
            className="px-3 py-1.5 rounded-xl border border-[#E5DACB] bg-white text-xs font-bold text-[#554D45] hover:bg-[#F2ECE1] transition-all flex items-center gap-1.5 shadow-2xs"
            title="Toggle between friendly local Hinglish guide and English"
          >
            <Languages className="w-3.5 h-3.5 text-[#8C2D19]" />
            <span>{useHinglish ? 'Bhaiya Guide (Hinglish)' : 'English Guide'}</span>
          </button>

          {/* Destination Selector */}
          <select
            value={selectedRouteKey}
            onChange={(e) => {
              setSelectedRouteKey(e.target.value)
              setActiveStepIndex(0)
            }}
            className="px-3 py-1.5 rounded-xl border border-[#E5DACB] bg-white text-xs font-bold text-[#201C1A] focus:outline-none focus:ring-2 focus:ring-[#8C2D19]"
          >
            {routes.map((r) => (
              <option key={r.destinationId} value={r.destinationId}>
                {r.destinationName.split('&')[0].trim()}
              </option>
            ))}
          </select>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Visual Street View Stage with Overlaid Landmarks */}
      <div className="relative aspect-video sm:aspect-[21/9] max-h-[460px] w-full bg-stone-900 overflow-hidden group select-none">
        {/* Real-World Street Scene */}
        <img
          src={currentRoute.panoramaImageUrl}
          alt={currentRoute.destinationName}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{
            transform: `scale(1.04) translate(${-(currentStep.overlayXPercent - 50) * 0.15}%, ${-(currentStep.overlayYPercent - 50) * 0.1}%)`,
          }}
        />

        {/* Ambient Gradient Shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none"></div>

        {/* Top Floating Compass Heading Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-md">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>Facing: {currentStep.streetViewHeading}° ({currentStep.streetViewHeading > 180 ? 'South-East' : 'East'})</span>
          </div>

          <button
            type="button"
            onClick={() => setShowPanoOverlay(!showPanoOverlay)}
            className="px-2.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 hover:bg-black/90 flex items-center gap-1"
          >
            <Eye className="w-3 h-3 text-emerald-400" />
            <span>{showPanoOverlay ? 'Hide Pins' : 'Show Pins'}</span>
          </button>
        </div>

        {/* Top-Right Google Street View 360 Action */}
        <div className="absolute top-4 right-4">
          <a
            href={currentRoute.googleStreetViewPanoramaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#6E1F0F] transition-all flex items-center gap-1.5 shadow-lg hover:scale-103"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open 360° in Google Street View</span>
            <ExternalLink className="w-3 h-3 text-stone-300" />
          </a>
        </div>

        {/* =====================================================================
            VISUAL LANDMARK OVERLAYS ("Put on over of that street view")
           ===================================================================== */}
        {showPanoOverlay &&
          currentRoute.steps.map((st, idx) => {
            const isCurrent = idx === activeStepIndex
            const isDone = idx < activeStepIndex

            return (
              <div
                key={st.stepNumber}
                onClick={() => setActiveStepIndex(idx)}
                className={`absolute transition-all duration-500 cursor-pointer -translate-x-1/2 -translate-y-1/2 ${
                  isCurrent ? 'z-30 scale-110' : 'z-20 opacity-85 hover:opacity-100 hover:scale-105'
                }`}
                style={{
                  left: `${st.overlayXPercent}%`,
                  top: `${st.overlayYPercent}%`,
                }}
              >
                {/* Pulsing ring for current step */}
                {isCurrent && (
                  <span className="absolute -inset-2 rounded-full bg-[#EA580C] opacity-75 animate-ping"></span>
                )}

                {/* Pin Container */}
                <div
                  className={`px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-bold border flex items-center gap-1.5 shadow-xl transition-colors ${
                    isCurrent
                      ? 'bg-[#8C2D19] text-white border-[#FDE68A] ring-2 ring-amber-400'
                      : isDone
                      ? 'bg-emerald-800 text-white border-emerald-400'
                      : 'bg-black/75 text-stone-100 border-white/30'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center text-[10px]">
                    {st.stepNumber}
                  </span>
                  <span className="max-w-[140px] truncate">{st.visualLandmark.split('&')[0]}</span>
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>}
                </div>

                {/* Pointer Tip */}
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#8C2D19] mx-auto mt-0.5"></div>
              </div>
            )
          })}

        {/* Bottom Conversational Guidance Banner ("Yaha jaoge ye building dikhegi") */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#EA580C] text-[10px] font-bold uppercase tracking-wider text-white">
                Step {currentStep.stepNumber} of {currentRoute.steps.length}
              </span>
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentStep.visualLandmark}</span>
              </span>
            </div>

            {/* Natural Hinglish / English Guidance */}
            <p className="text-sm sm:text-base font-medium text-white leading-snug">
              “{useHinglish ? currentStep.instructionHinglish : currentStep.instructionEnglish}”
            </p>
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={activeStepIndex === 0}
              className={`p-2 rounded-xl border border-white/30 text-white transition-all ${
                activeStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-white/20 cursor-pointer active:scale-95'
              }`}
              title="Previous landmark"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-stone-300 px-1">
              {activeStepIndex + 1}/{currentRoute.steps.length}
            </span>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={activeStepIndex === currentRoute.steps.length - 1}
              className={`p-2 rounded-xl border border-white/30 text-white transition-all ${
                activeStepIndex === currentRoute.steps.length - 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'bg-[#EA580C] hover:bg-[#C2410C] border-[#EA580C] cursor-pointer active:scale-95'
              }`}
              title="Next landmark"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Step Progress Strip & Landmark Details Below */}
      <div className="p-5 sm:p-6 pt-2 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {currentRoute.steps.map((step, idx) => (
            <div
              key={step.stepNumber}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                activeStepIndex === idx
                  ? 'bg-[#FAF5ED] border-[#8C2D19] ring-2 ring-[#8C2D19]/20 shadow-xs'
                  : 'bg-[#FAF7F2] border-[#EFE7DC] hover:border-[#8C2D19]/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#8C2D19]">Step {step.stepNumber}</span>
                  <span className="text-stone-500">{step.distanceMeters}m</span>
                </div>
                <h4 className="font-bold text-[#201C1A] leading-tight line-clamp-1">
                  {step.visualLandmark}
                </h4>
                <p className="text-[11px] text-[#554D45] line-clamp-2">
                  {useHinglish ? step.instructionHinglish : step.instructionEnglish}
                </p>
              </div>

              <div className="pt-2 border-t border-[#EFE7DC] mt-2 flex items-center justify-between text-[10px] font-semibold text-[#8C2D19]">
                <span>{activeStepIndex === idx ? '● Viewing on Street View' : 'Tap to View'}</span>
                {activeStepIndex === idx && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#7A7167] pt-2 border-t border-[#F2ECE1]">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#D97706]" />
            <span>
              Real-world pedestrian lane access. No private cabs can enter narrow galis past the barrier.
            </span>
          </span>
          <span className="font-semibold text-[#8C2D19]">
            Google Street View Enabled • Varanasi Visual Navigation
          </span>
        </div>
      </div>
    </div>
  )
}
