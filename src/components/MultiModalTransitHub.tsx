import React, { useState } from 'react'
import {
  calculateReturnTransit,
  getTrainsForRoute,
  type DetailedTrain,
} from '../data/trainRoutes'
import {
  calculateIntercityTransit,
  type TransitMode,
} from '../services/travel-engine/intercityTransitEngine'
import { DetailedTrainInspector } from './DetailedTrainInspector'
import {
  Train,
  Bus,
  Plane,
  Car,
  Clock,
  ExternalLink,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  Info,
} from 'lucide-react'

interface MultiModalTransitHubProps {
  originCity: string
  destinationCityId: string
  destinationCityName: string
  onSelectTransit?: (option: { mode: string; title: string; priceFormatted: string; durationFormatted: string }) => void
}

export const MultiModalTransitHub: React.FC<MultiModalTransitHubProps> = ({
  originCity,
  destinationCityId,
  destinationCityName,
  onSelectTransit: _onSelectTransit,
}) => {
  const [activeTab, setActiveTab] = useState<'outbound' | 'return'>('return')
  const [selectedMode, setSelectedMode] = useState<TransitMode>('train')
  const [inspectedTrain, setInspectedTrain] = useState<DetailedTrain | null>(null)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)

  // Compute Outbound & Return data
  const outboundTransit = calculateIntercityTransit(originCity, destinationCityId)
  const returnTransit = calculateReturnTransit(destinationCityId, originCity)

  const outboundTrains = getTrainsForRoute(originCity, destinationCityId, 'outbound')
  const returnTrains = returnTransit.trains

  const currentTrains = activeTab === 'outbound' ? outboundTrains : returnTrains
  const recommendedTrain = currentTrains.find((t) => t.isRecommended) || currentTrains[0]

  const handleOpenTrainInspector = (train: DetailedTrain) => {
    setInspectedTrain(train)
    setIsInspectorOpen(true)
  }

  const isReturn = activeTab === 'return'
  const fromCityLabel = isReturn ? destinationCityName : originCity
  const toCityLabel = isReturn ? originCity : destinationCityName
  const distanceKm = isReturn ? returnTransit.distanceKm : outboundTransit.distanceKm

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E5DACB] shadow-xs space-y-6">
      {/* Header section with Direction Selector Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
            <Train className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Multi-Modal Intercity Transit & Indian Railways Engine</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A]">
            {isReturn ? `Return to ${originCity}` : `Reach ${destinationCityName} from ${originCity}`}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7167] mt-1 max-w-xl leading-relaxed">
            Compare verified Indian Railways express trains, state AC Volvo sleeper buses, highway cabs, and flights.
            Tap any train to view class-by-class fares, exact halts, and minutiae.
          </p>
        </div>

        {/* Direction Switcher Toggle */}
        <div className="flex items-center gap-1 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#E5DACB] self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('outbound')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'outbound'
                ? 'bg-[#9A3412] text-white shadow-xs'
                : 'text-[#6A6055] hover:text-[#201C1A]'
            }`}
          >
            <span>Outbound</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('return')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'return'
                ? 'bg-[#9A3412] text-white shadow-xs'
                : 'text-[#6A6055] hover:text-[#201C1A]'
            }`}
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>

      {/* Best Choice Recommendation Banner */}
      <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] flex items-start gap-3 shadow-2xs">
        <Sparkles className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold uppercase tracking-wider text-[10px] text-[#9A3412] block">
            ★ HOMI’s Single Recommended {isReturn ? 'Return' : 'Outbound'} Choice:
          </span>
          <p className="text-xs leading-relaxed font-semibold text-[#451A03]">
            {isReturn ? returnTransit.recommendationReason : outboundTransit.bestChoiceSummary}
          </p>
        </div>
      </div>

      {/* Mode Selector Tabs (Train, Bus, Flight, Taxi) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedMode('train')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
            selectedMode === 'train'
              ? 'bg-[#201C1A] text-white border-[#201C1A] shadow-xs'
              : 'bg-[#FAF7F2] border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
          }`}
        >
          <Train className="w-4 h-4 text-amber-400" />
          <span>Express Trains ({currentTrains.length} direct options)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('bus')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
            selectedMode === 'bus'
              ? 'bg-[#201C1A] text-white border-[#201C1A] shadow-xs'
              : 'bg-[#FAF7F2] border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
          }`}
        >
          <Bus className="w-4 h-4 text-emerald-500" />
          <span>AC Sleeper Bus</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('taxi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
            selectedMode === 'taxi'
              ? 'bg-[#201C1A] text-white border-[#201C1A] shadow-xs'
              : 'bg-[#FAF7F2] border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
          }`}
        >
          <Car className="w-4 h-4 text-blue-500" />
          <span>Highway Cab / Self-Drive</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMode('flight')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
            selectedMode === 'flight'
              ? 'bg-[#201C1A] text-white border-[#201C1A] shadow-xs'
              : 'bg-[#FAF7F2] border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
          }`}
        >
          <Plane className="w-4 h-4 text-sky-500" />
          <span>Flights & Air Link</span>
        </button>
      </div>

      {/* =========================================================================
          MODE 1: ALL AVAILABLE TRAINS WITH CLASS FARES & TAP-FOR-DETAILS
         ========================================================================= */}
      {selectedMode === 'train' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#7A7167]">
            <span className="font-semibold">
              Showing all verified direct express trains for {fromCityLabel} ➔ {toCityLabel} (~{distanceKm} km)
            </span>
            <span className="text-[11px] text-[#9A3412] font-bold">
              Tap any train card for minute halts & live status
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentTrains.map((train) => {
              const generalClass = train.classes.find((c) => c.classCode === 'GEN' || c.classCode === '2S')
              const sleeperClass = train.classes.find((c) => c.classCode === 'SL')
              const acClass = train.classes.find((c) => c.classCode === '3A' || c.classCode === 'CC')

              return (
                <div
                  key={train.id}
                  onClick={() => handleOpenTrainInspector(train)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative hover:shadow-md ${
                    train.isRecommended
                      ? 'border-[#9A3412] bg-[#FFFBF8] shadow-xs'
                      : 'border-[#EFE7DC] bg-[#FAF7F2] hover:border-[#D6C7B2]'
                  }`}
                >
                  {/* Recommended Ribbon */}
                  {train.isRecommended && (
                    <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-[#9A3412] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      <span>{train.recommendationBadge || 'One & Only Recommended Train'}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    {/* Left: Train details & route */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#201C1A] text-white font-mono text-xs font-bold">
                          #{train.trainNumber}
                        </span>
                        <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#201C1A]">
                          {train.trainName}
                        </h4>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {train.runningDays.includes('Daily') ? 'Daily' : `${train.runningDays.length} days/week`}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#554D45]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                          <span className="font-bold text-[#201C1A] font-mono text-sm">{train.departureTime}</span>
                          <span className="text-stone-500">({train.fromStationCode})</span>
                        </div>
                        <span className="text-stone-400">➔</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[#201C1A] font-mono text-sm">{train.arrivalTime}</span>
                          <span className="text-stone-500">({train.toStationCode})</span>
                        </div>
                        <span className="text-[11px] text-[#7A7167] font-medium border-l border-[#E5DACB] pl-3">
                          {train.duration}
                        </span>
                      </div>

                      {train.isRecommended && (
                        <p className="text-[11px] text-[#78350F] font-medium leading-relaxed max-w-xl">
                          {train.recommendationReason}
                        </p>
                      )}
                    </div>

                    {/* Right: Class Fares Breakdown Pills */}
                    <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {generalClass && (
                          <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                            <span className="text-[9px] text-emerald-800 font-bold block">General</span>
                            <strong className="text-xs font-bold text-emerald-900">₹{generalClass.fareInr}</strong>
                          </div>
                        )}

                        {sleeperClass && (
                          <div className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-center">
                            <span className="text-[9px] text-indigo-800 font-bold block">Sleeper</span>
                            <strong className="text-xs font-bold text-indigo-900">₹{sleeperClass.fareInr}</strong>
                          </div>
                        )}

                        {acClass && (
                          <div className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-center">
                            <span className="text-[9px] text-amber-800 font-bold block">{acClass.classCode}</span>
                            <strong className="text-xs font-bold text-amber-900">₹{acClass.fareInr}</strong>
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-[#9A3412] font-bold flex items-center gap-1 mt-1">
                        <span>Tap for all minute details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: BUS (DIRECT AC VOLVO SLEEPER)
         ========================================================================= */}
      {selectedMode === 'bus' && (
        <div className="p-5 rounded-2xl border border-[#EFE7DC] bg-[#FAF7F2] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE7DC] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A3412] block">
                Direct Highway Transit
              </span>
              <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                {returnTransit.bus.operator}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-[#9A3412]">
                {returnTransit.bus.fareFormatted}
              </span>
              <span className="text-[10px] text-[#7A7167] block">per passenger</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#554D45]">
            <div className="p-3 rounded-xl bg-white border border-[#EFE7DC]">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Boarding Point</span>
              <strong className="text-[#201C1A]">{returnTransit.bus.boardingPoint}</strong>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#EFE7DC]">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Dropping Point</span>
              <strong className="text-[#201C1A]">{returnTransit.bus.droppingPoint}</strong>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#EFE7DC]">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Schedule & Time</span>
              <strong className="text-[#201C1A]">{returnTransit.bus.schedule} ({returnTransit.bus.duration})</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Local Advice:</strong> {returnTransit.bus.tip}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <a
              href={returnTransit.bus.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-[#9A3412] hover:bg-[#802A0E] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Check Seats & Book on RedBus</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 3: HIGHWAY CAB / SELF-DRIVE
         ========================================================================= */}
      {selectedMode === 'taxi' && (
        <div className="p-5 rounded-2xl border border-[#EFE7DC] bg-[#FAF7F2] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE7DC] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A3412] block">
                Private Highway Route
              </span>
              <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                {returnTransit.taxi.highway}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-[#201C1A]">
                {returnTransit.taxi.fareFormatted}
              </span>
              <span className="text-[10px] text-stone-500 block">Sedan / SUV One-Way</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#554D45]">
            <div className="p-3 rounded-xl bg-white border border-[#EFE7DC]">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Driving Duration</span>
              <strong className="text-[#201C1A]">{returnTransit.taxi.duration}</strong>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#EFE7DC]">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">Estimated Highway Tolls</span>
              <strong className="text-emerald-700">~₹{returnTransit.taxi.tollEstimatedInr} (FASTag)</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Highway Pro Tip:</strong> {returnTransit.taxi.tip}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 4: FLIGHTS & AIR CONNECTIONS
         ========================================================================= */}
      {selectedMode === 'flight' && (
        <div className="p-5 rounded-2xl border border-[#EFE7DC] bg-[#FAF7F2] space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFE7DC] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
                Air Corridor Link
              </span>
              <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                Connecting Flights & Regional Airports
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200">
              ₹4,500 – ₹8,500+
            </span>
          </div>

          <p className="text-xs text-[#554D45] leading-relaxed">
            {fromCityLabel} and {toCityLabel} are separated by approximately {distanceKm} km.
            For routes under 600 km (like Jhansi ➔ Varanasi or Jhansi ➔ Jaipur), Indian Railways Express trains (like #{recommendedTrain?.trainNumber} {recommendedTrain?.trainName}) offer true center-to-center convenience, dropping you right in the city center with zero airport check-in queues and at 10% of the cost.
          </p>

          <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F]">
            <strong>HOMI Companion Verdict:</strong> We strongly advise taking Train #{recommendedTrain?.trainNumber} ({recommendedTrain?.trainName}) over flights for this sector.
          </div>
        </div>
      )}

      {/* Detailed Train Inspector Modal */}
      <DetailedTrainInspector
        train={inspectedTrain}
        isOpen={isInspectorOpen}
        onClose={() => {
          setIsInspectorOpen(false)
          setInspectedTrain(null)
        }}
      />
    </section>
  )
}
