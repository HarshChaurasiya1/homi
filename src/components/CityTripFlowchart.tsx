import React, { useState } from 'react'
import {
  Clock,
  ExternalLink,
  Sparkles,
  Footprints,
  Navigation,
  Box,
  Split,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react'
import type { CityFlowchart, FlowchartNode } from '../data/flowcharts'
import { CITY_FLOWCHARTS } from '../data/flowcharts'

interface CityTripFlowchartProps {
  cityId: string
  className?: string
  initialDuration?: '1-day' | '2-day' | '3-day'
}

type TravelerFilter = 'all' | 'solo' | 'friends' | 'family' | 'couple'

/**
 * CityTripFlowchart Component
 * Renders an ultra-clean, interactive visual flowchart for the user:
 * - Step-by-step connected timeline with SVG connectors
 * - Real-world transit links (walking lanes, auto routes, boat floats)
 * - Interactive decision branches (e.g. Royal Heritage vs Artisan Bazaars)
 * - Traveler persona filters (Solo, Friends, Family, Couple)
 * - Direct links to OpenStreetMap and OSM 3D view
 */
export const CityTripFlowchart: React.FC<CityTripFlowchartProps> = ({
  cityId,
  className = '',
  initialDuration = '1-day',
}) => {
  const cityFlow: CityFlowchart =
    CITY_FLOWCHARTS[cityId.toLowerCase()] || CITY_FLOWCHARTS.jaipur

  const [selectedDuration, setSelectedDuration] = useState<'1-day' | '2-day' | '3-day'>(
    initialDuration
  )
  const [selectedTraveler, setSelectedTraveler] = useState<TravelerFilter>('all')
  const [selectedBranch, setSelectedBranch] = useState<'branch_a' | 'branch_b'>('branch_a')
  const [activeNodeId, setActiveNodeId] = useState<string>(cityFlow.nodes[0]?.id || '')

  // Filter nodes based on traveler suitability
  const filterSuitability = (node: FlowchartNode) => {
    if (selectedTraveler === 'all') return true
    return node.travelerSuitability.includes(selectedTraveler)
  }

  // Determine which nodes to display
  let displayNodes: FlowchartNode[] = []
  if (selectedDuration === '1-day') {
    displayNodes = cityFlow.nodes.slice(0, 4)
  } else if (selectedDuration === '2-day') {
    displayNodes = cityFlow.nodes.slice(0, 5)
  } else {
    displayNodes = cityFlow.nodes
  }

  // Inject branch nodes if available
  const hasBranch = !!cityFlow.branchDecision
  const branchData = cityFlow.branchDecision
  const activeBranchNodes =
    selectedBranch === 'branch_a'
      ? branchData?.branchA.nodes || []
      : branchData?.branchB.nodes || []

  // Combine main nodes with active branch
  const finalNodesList = displayNodes.filter(filterSuitability)

  return (
    <div
      id="city-flowchart-section"
      className={`bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden space-y-6 ${className}`}
    >
      {/* Flowchart Header Bar */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-[#F8FAFC] to-white border-b border-[#F1F5F9] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B82F6]/10 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive User Flowchart</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F172A]">
              {cityFlow.cityName} Connected Journey Flow
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl">
              Follow this step-by-step visual sequence with accurate walking distances,
              e-rickshaw drop-offs, and insider local companion secrets.
            </p>
          </div>

          {/* Duration Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-2xl self-start md:self-auto border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setSelectedDuration('1-day')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDuration === '1-day'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              1-Day Flow
            </button>

            <button
              type="button"
              onClick={() => setSelectedDuration('2-day')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDuration === '2-day'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              2-Day Flow
            </button>

            <button
              type="button"
              onClick={() => setSelectedDuration('3-day')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDuration === '3-day'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              3-Day Flow
            </button>
          </div>
        </div>

        {/* Traveler Persona Filter Strip */}
        <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100 text-xs">
          <span className="text-[#94A3B8] font-semibold flex items-center gap-1 text-[11px] uppercase tracking-wider mr-1">
            <Users className="w-3.5 h-3.5" />
            <span>Filter By Vibe:</span>
          </span>

          {(
            [
              { key: 'all', label: 'All Explorers' },
              { key: 'solo', label: '🚶 Solo Explorer' },
              { key: 'couple', label: '❤️ Couple Romance' },
              { key: 'friends', label: '🎒 Friends Gang' },
              { key: 'family', label: '👨‍👩‍👦 Family with Elders' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedTraveler(item.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                selectedTraveler === item.key
                  ? 'bg-[#1E293B] text-white border-[#1E293B] shadow-2xs'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Connected Flowchart Tree */}
      <div className="px-5 sm:px-8 pb-8 space-y-6">
        <div className="relative">
          {/* Vertical Connecting Guide Line */}
          <div className="absolute top-8 bottom-8 left-6 sm:left-8 w-0.5 bg-gradient-to-b from-[#3B82F6] via-[#CBD5E1] to-[#3B82F6] z-0 hidden sm:block"></div>

          {/* Node Progression */}
          <div className="space-y-8 relative z-10">
            {finalNodesList.map((node, index) => {
              const isActive = activeNodeId === node.id

              return (
                <div key={node.id} className="space-y-4">
                  {/* Flowchart Node Card */}
                  <div
                    onClick={() => setActiveNodeId(node.id)}
                    className={`relative flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white border-[#3B82F6] ring-2 ring-[#3B82F6]/20 shadow-md'
                        : 'bg-[#FAFAFA] border-[#E2E8F0] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    {/* Step Number Circle with Pulsing Indicator */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs transition-colors ${
                          isActive
                            ? 'bg-[#3B82F6] text-white'
                            : 'bg-white text-[#0F172A] border border-[#CBD5E1]'
                        }`}
                      >
                        0{node.stepNumber}
                      </div>

                      {isActive && (
                        <span className="absolute -inset-1 rounded-2xl bg-[#3B82F6] opacity-35 animate-ping pointer-events-none"></span>
                      )}
                    </div>

                    {/* Node Main Content */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                            <Clock className="w-3 h-3 text-[#3B82F6]" />
                            <span>{node.timeRange}</span>
                          </span>

                          <span className="text-[11px] font-semibold text-[#64748B]">
                            {node.durationMinutes} mins
                          </span>
                        </div>

                        {/* Estimated Cost Badge */}
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {typeof node.costEstimateInr === 'number'
                            ? `₹${node.costEstimateInr}`
                            : node.costEstimateInr}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#0F172A]">
                          {node.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#475569] font-medium">
                          {node.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                        {node.description}
                      </p>

                      {/* Local Companion Pro-Tip Box */}
                      <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-xs text-[#166534] flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="font-medium">{node.localProTip}</span>
                      </div>

                      {/* Quick Action Buttons on Node */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${node.osmCoordinates[0]}&mlon=${node.osmCoordinates[1]}#map=17/${node.osmCoordinates[0]}/${node.osmCoordinates[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>View on OpenStreetMap</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <a
                          href={`https://demo.f4map.com/#lat=${node.osmCoordinates[0]}&lon=${node.osmCoordinates[1]}&zoom=17&camera.theta=55&camera.phi=-30`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D] hover:underline"
                        >
                          <Box className="w-3.5 h-3.5" />
                          <span>OSM 3D View</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Right Thumbnail Image */}
                    {node.imageUrl && (
                      <div className="w-full sm:w-36 h-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-200 mt-2 sm:mt-0">
                        <img
                          src={node.imageUrl}
                          alt={node.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  {/* Transit Connector between Nodes (Directional Arrow & Mode) */}
                  {node.transitToNext && index < finalNodesList.length - 1 && (
                    <div className="ml-4 sm:ml-6 pl-6 sm:pl-8 py-2 relative flex items-center gap-3 text-xs text-[#64748B]">
                      {/* Visual Flow Arrow */}
                      <div className="w-6 h-6 rounded-full bg-white border border-[#CBD5E1] shadow-2xs flex items-center justify-center text-[#3B82F6] shrink-0 font-bold">
                        ↓
                      </div>

                      {/* Transit Mode Pill */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-2xs font-semibold text-[#334155]">
                        <Footprints className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>{node.transitToNext.modeLabel}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[#64748B]">
                          ~{node.transitToNext.durationMinutes} mins ({node.transitToNext.distanceMeters}m)
                        </span>
                      </div>

                      {node.transitToNext.laneNote && (
                        <span className="hidden md:inline text-[11px] text-[#94A3B8] italic truncate max-w-xs">
                          {node.transitToNext.laneNote}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* =====================================================================
            INTERACTIVE DECISION BRANCHING (Choice Point)
           ===================================================================== */}
        {hasBranch && branchData && (
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#EFF6FF] to-[#F8FAFC] border border-[#BFDBFE] space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              <Split className="w-4 h-4" />
              <span>Interactive Decision Branch Point</span>
            </div>

            <div>
              <h4 className="font-editorial text-xl sm:text-2xl font-bold text-[#0F172A]">
                {branchData.prompt}
              </h4>
              <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                Time Window: {branchData.decisionTime}
              </p>
            </div>

            {/* Branch Switcher Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedBranch('branch_a')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedBranch === 'branch_a'
                    ? 'bg-white border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md'
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                      Branch Option 1
                    </span>
                    {selectedBranch === 'branch_a' && (
                      <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                    )}
                  </div>
                  <h5 className="font-bold text-sm text-[#0F172A] mt-1">
                    {branchData.branchA.title}
                  </h5>
                </div>
                <span className="mt-3 text-[11px] font-semibold text-slate-500">
                  {branchData.branchA.nodes.length} stops included
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBranch('branch_b')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedBranch === 'branch_b'
                    ? 'bg-white border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md'
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                      Branch Option 2
                    </span>
                    {selectedBranch === 'branch_b' && (
                      <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                    )}
                  </div>
                  <h5 className="font-bold text-sm text-[#0F172A] mt-1">
                    {branchData.branchB.title}
                  </h5>
                </div>
                <span className="mt-3 text-[11px] font-semibold text-slate-500">
                  {branchData.branchB.nodes.length} stops included
                </span>
              </button>
            </div>

            {/* Display Branch Stops */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Active Branch Stops:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeBranchNodes.map((bNode) => (
                  <div
                    key={bNode.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#2563EB]">{bNode.timeRange}</span>
                      <span className="text-emerald-700">
                        {typeof bNode.costEstimateInr === 'number'
                          ? `₹${bNode.costEstimateInr}`
                          : bNode.costEstimateInr}
                      </span>
                    </div>
                    <h6 className="font-bold text-xs text-[#0F172A]">{bNode.title}</h6>
                    <p className="text-[11px] text-[#64748B] line-clamp-2">
                      {bNode.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
