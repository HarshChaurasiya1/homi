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
  Box,
  Layers,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react'
import { STREET_VIEW_ROUTES } from '../data/streetViewRoutes'
import type { VisualStreetRoute } from '../services/geminiTravelBrain'

export type MapViewMode = 'osm_3d' | 'osm_map' | 'photo_guide'

interface StreetViewVisualGuideProps {
  initialRouteId?: string
  initialMode?: MapViewMode
  className?: string
  onClose?: () => void
}

/**
 * OpenStreetMap (OSM) 3D View & Visual Landmark Navigation Engine
 * 100% Open-Source, Free, and Independent of Google Studio API.
 * 
 * Provides:
 * 1. OSM 3D Perspective (F4Map 3D Buildings & Ghats)
 * 2. OpenStreetMap Interactive Map (Galis, Ghats & Pedestrian Alleys)
 * 3. Conversational Landmark Guide ("Yaha utro, samne ye building dikhegi, right mudo")
 */
export const StreetViewVisualGuide: React.FC<StreetViewVisualGuideProps> = ({
  initialRouteId = 'dashashwamedh_ghat',
  initialMode = 'osm_3d',
  className = '',
  onClose,
}) => {
  const [selectedRouteKey, setSelectedRouteKey] = useState<string>(initialRouteId)
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [viewMode, setViewMode] = useState<MapViewMode>(initialMode)
  const [useHinglish, setUseHinglish] = useState<boolean>(true)
  const [showPanoOverlay, setShowPanoOverlay] = useState<boolean>(true)
  
  // 3D Perspective interactive camera state
  const [cameraYaw, setCameraYaw] = useState<number>(45)
  const [cameraPitch, setCameraPitch] = useState<number>(55)
  const [zoomLevel, setZoomLevel] = useState<number>(1.1)

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

  const reset3DCamera = () => {
    setCameraYaw(45)
    setCameraPitch(55)
    setZoomLevel(1.1)
  }

  return (
    <div
      className={`bg-white rounded-3xl border-2 border-[#E5DACB] shadow-lg overflow-hidden flex flex-col space-y-4 ${className}`}
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-[#F2ECE1] flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#FAF7F2]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#15803D]/10 text-[#15803D] text-xs font-bold uppercase tracking-wider">
            <Box className="w-3.5 h-3.5" />
            <span>OpenStreetMap (OSM) 3D & Landmark Navigator</span>
          </div>
          <h3 className="font-editorial text-2xl font-bold text-[#201C1A]">
            {currentRoute.destinationName}
          </h3>
          <p className="text-xs text-[#5D554C] flex flex-wrap items-center gap-2">
            <Footprints className="w-3.5 h-3.5 text-[#D97706]" />
            <span>
              Drop-off: <strong>{currentRoute.vehicularDropOffName}</strong> •{' '}
              {currentRoute.totalWalkingMeters}m walk (~{currentRoute.approxWalkMinutes} mins)
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-[#8C2D19] font-medium">100% Open-Source (No Google API)</span>
          </p>
        </div>

        {/* View Mode Switcher & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Tabs: 3D View vs OSM Map vs Street Photo Guide */}
          <div className="bg-[#EFE7DC] p-1 rounded-2xl flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('osm_3d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'osm_3d'
                  ? 'bg-[#8C2D19] text-white shadow-xs'
                  : 'text-[#554D45] hover:text-[#201C1A]'
              }`}
              title="OpenStreetMap 3D Perspective"
            >
              <Box className="w-3.5 h-3.5" />
              <span>OSM 3D</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('osm_map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'osm_map'
                  ? 'bg-[#8C2D19] text-white shadow-xs'
                  : 'text-[#554D45] hover:text-[#201C1A]'
              }`}
              title="OpenStreetMap Interactive Gali Map"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>OSM Map</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('photo_guide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'photo_guide'
                  ? 'bg-[#8C2D19] text-white shadow-xs'
                  : 'text-[#554D45] hover:text-[#201C1A]'
              }`}
              title="Real-World Visual Landmark Guide"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Photo Guide</span>
            </button>
          </div>

          {/* Language Toggle: Hinglish vs English */}
          <button
            type="button"
            onClick={() => setUseHinglish(!useHinglish)}
            className="px-3 py-1.5 rounded-xl border border-[#E5DACB] bg-white text-xs font-bold text-[#554D45] hover:bg-[#F2ECE1] transition-all flex items-center gap-1.5 shadow-2xs"
            title="Toggle between friendly local Hinglish guide and English"
          >
            <Languages className="w-3.5 h-3.5 text-[#8C2D19]" />
            <span>{useHinglish ? 'Bhaiya Guide' : 'English'}</span>
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

      {/* =====================================================================
          VIEWPORT STAGE (Switches between OSM 3D, OSM Map, & Photo Guide)
         ===================================================================== */}
      <div className="relative aspect-video sm:aspect-[21/9] max-h-[480px] w-full bg-[#1A1817] overflow-hidden select-none">
        
        {/* -------------------------------------------------------------
            MODE 1: OPENSTREETMAP 3D VIEW (OSM 3D Buildings & Ghats)
           ------------------------------------------------------------- */}
        {viewMode === 'osm_3d' && (
          <div className="relative w-full h-full bg-[#181C20] flex items-center justify-center overflow-hidden">
            {/* Embedded OpenStreetMap 3D Viewer (F4Map OSM 3D Engine) */}
            <iframe
              src={currentRoute.osm3DUrl}
              title={`OpenStreetMap 3D - ${currentRoute.destinationName}`}
              className="w-full h-full border-0 pointer-events-auto"
              loading="lazy"
              allowFullScreen
            />

            {/* 3D Interactive Helper HUD Bar */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-md">
                <Box className="w-3.5 h-3.5 text-emerald-400" />
                <span>OSM 3D Buildings & Ghat Geometry</span>
              </div>

              <div className="hidden sm:flex items-center gap-1 bg-black/75 backdrop-blur-md rounded-full px-2 py-1 border border-white/20 text-white text-[11px]">
                <button
                  type="button"
                  onClick={() => setCameraPitch(Math.min(75, cameraPitch + 10))}
                  className="px-2 py-0.5 rounded hover:bg-white/20"
                  title="Tilt Camera Up"
                >
                  Tilt +
                </button>
                <button
                  type="button"
                  onClick={() => setCameraYaw((cameraYaw + 45) % 360)}
                  className="px-2 py-0.5 rounded hover:bg-white/20 flex items-center gap-1"
                  title="Rotate Camera"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>{cameraYaw}°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.2))}
                  className="p-1 rounded hover:bg-white/20"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
                  className="p-1 rounded hover:bg-white/20"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={reset3DCamera}
                  className="px-2 py-0.5 rounded hover:bg-white/20 text-stone-300"
                  title="Reset 3D View"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Top Right Direct Links */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <a
                href={currentRoute.osm3DUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#15803D] text-white text-xs font-bold hover:bg-[#166534] transition-all flex items-center gap-1.5 shadow-lg hover:scale-103"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen OSM 3D</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODE 2: OPENSTREETMAP (OSM) LIVE INTERACTIVE MAP
           ------------------------------------------------------------- */}
        {viewMode === 'osm_map' && (
          <div className="relative w-full h-full bg-[#E8E0D5]">
            {/* Live OpenStreetMap Iframe with High Precision Gali & Ghat Mapping */}
            <iframe
              src={currentRoute.osmEmbedUrl}
              title={`OpenStreetMap - ${currentRoute.destinationName}`}
              className="w-full h-full border-0"
              loading="lazy"
            />

            {/* Floating Map Legend */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#201C1A] text-xs font-bold border border-[#E5DACB] flex items-center gap-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-[#8C2D19]" />
                <span>OpenStreetMap Live • {currentRoute.destinationName.split('&')[0]}</span>
              </div>
            </div>

            {/* Top Right OSM Actions */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <a
                href={currentRoute.osmMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#6E1F0F] transition-all flex items-center gap-1.5 shadow-lg hover:scale-103"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in OpenStreetMap</span>
                <ExternalLink className="w-3 h-3 text-stone-300" />
              </a>

              <a
                href={currentRoute.osmDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-[#1D4ED8] text-white text-xs font-bold hover:bg-[#1E40AF] transition-all items-center gap-1.5 shadow-lg"
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>OSRM Foot Route</span>
                <ExternalLink className="w-3 h-3 text-blue-200" />
              </a>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODE 3: VISUAL LANDMARK PHOTO GUIDE ("Yaha jaoge ye building dikhegi")
           ------------------------------------------------------------- */}
        {viewMode === 'photo_guide' && (
          <div className="relative w-full h-full bg-stone-900 group">
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
                <Compass className="w-3.5 h-3.5 text-amber-400" />
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

            {/* Top-Right OpenStreetMap Action */}
            <div className="absolute top-4 right-4">
              <a
                href={currentRoute.osmMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-[#8C2D19] text-white text-xs font-bold hover:bg-[#6E1F0F] transition-all flex items-center gap-1.5 shadow-lg hover:scale-103"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in OpenStreetMap</span>
                <ExternalLink className="w-3 h-3 text-stone-300" />
              </a>
            </div>

            {/* Visual Landmark Overlays ("Put on over of that street view") */}
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
                    {isCurrent && (
                      <span className="absolute -inset-2 rounded-full bg-[#EA580C] opacity-75 animate-ping"></span>
                    )}

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

                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#8C2D19] mx-auto mt-0.5"></div>
                  </div>
                )
              })}
          </div>
        )}

        {/* =====================================================================
            CONVERSATIONAL GUIDANCE BANNER ("Yaha jaoge ye building dikhegi")
           ===================================================================== */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20">
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

      {/* =====================================================================
          STEP PROGRESS STRIP & LANDMARK CARDS BELOW
         ===================================================================== */}
      <div className="p-5 sm:p-6 pt-2 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
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
                <span>{activeStepIndex === idx ? '● Active Landmark' : 'Tap to Focus'}</span>
                {activeStepIndex === idx && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              </div>
            </div>
          ))}
        </div>

        {/* OpenStreetMap Footnote */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#7A7167] pt-2 border-t border-[#F2ECE1] gap-2">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span>
              Real-world pedestrian lane access. OpenStreetMap accurately maps narrow galis and ghat steps that cars cannot enter.
            </span>
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={currentRoute.osmDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1D4ED8] hover:underline font-semibold flex items-center gap-1"
            >
              <span>OSRM Foot Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="font-semibold text-[#15803D]">
              OpenStreetMap (OSM) 3D Powered
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Convenient alias export for modern OpenStreetMap 3D Guide
 */
export const Osm3DVisualGuide = StreetViewVisualGuide
