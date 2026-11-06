import React from 'react'
import { type DetailedTrain } from '../data/trainRoutes'
import {
  Train,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Utensils,
  Award,
  Gauge,
  X,
  Compass,
} from 'lucide-react'

interface DetailedTrainInspectorProps {
  train: DetailedTrain | null
  isOpen: boolean
  onClose: () => void
}

export const DetailedTrainInspector: React.FC<DetailedTrainInspectorProps> = ({
  train,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !train) return null

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[90vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-mono font-bold tracking-wider flex items-center gap-1.5">
              <Train className="w-3.5 h-3.5 text-indigo-300" />
              <span>#{train.trainNumber}</span>
            </span>
            <span className="text-[11px] text-slate-300 uppercase font-semibold tracking-wider">
              Indian Railways Broad Gauge Express
            </span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {train.trainName}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-200">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">{train.fromStationName} ({train.fromStationCode})</span>
            </div>
            <span className="text-slate-400">➔</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">{train.toStationName} ({train.toStationCode})</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Recommendation Spotlight (if recommended) */}
          {train.isRecommended && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{train.recommendationBadge || 'HOMI’s One & Only Recommended Train'}</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed font-medium">
                {train.recommendationReason}
              </p>
            </div>
          )}

          {/* Timetable Cards (Departure / Duration / Arrival) */}
          <div className="grid grid-cols-3 gap-2.5 text-center p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Departure</span>
              <strong className="text-xl sm:text-2xl font-bold text-slate-900 block font-mono">
                {train.departureTime}
              </strong>
              <span className="text-[10px] text-slate-600 font-semibold">{train.fromStationCode}</span>
            </div>

            <div className="flex flex-col items-center justify-center border-x border-slate-200 px-2">
              <Clock className="w-4 h-4 text-indigo-600 mb-1" />
              <span className="text-xs font-bold text-slate-800">{train.duration}</span>
              <span className="text-[9px] text-slate-500">Non-Stop/Express</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Arrival</span>
              <strong className="text-xl sm:text-2xl font-bold text-slate-900 block font-mono">
                {train.arrivalTime}
              </strong>
              <span className="text-[10px] text-slate-600 font-semibold">{train.toStationCode}</span>
            </div>
          </div>

          {/* Running Days */}
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">
              Running Frequency
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {daysOfWeek.map((day) => {
                const isActive = train.runningDays.includes(day) || train.runningDays.includes('Daily')
                return (
                  <span
                    key={day}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {day}
                  </span>
                )
              })}
              <span className="text-xs text-slate-600 ml-2 font-medium">
                {train.runningDays.includes('Daily') ? 'Runs Every Day' : `${train.runningDays.length} days / week`}
              </span>
            </div>
          </div>

          {/* Real Class-by-Class Fares Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">
                Real Class-Wise Fares (General to AC)
              </span>
              <span className="text-[10px] text-indigo-600 font-bold">Official Indian Railways Base Fare</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {train.classes.map((cls) => {
                const isGeneral = cls.classCode === 'GEN' || cls.classCode === '2S'
                const isSleeper = cls.classCode === 'SL'

                return (
                  <div
                    key={cls.classCode}
                    className={`p-3 rounded-xl border flex flex-col justify-between ${
                      isSleeper
                        ? 'bg-indigo-50/70 border-indigo-200'
                        : isGeneral
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-slate-900">
                          {cls.classCode}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500">
                          {cls.className.split(' ')[0]}
                        </span>
                      </div>
                      <strong className="text-lg font-bold text-slate-900 block mt-1">
                        ₹{cls.fareInr}
                      </strong>
                    </div>
                    {cls.statusNote && (
                      <span className="text-[9px] text-slate-600 mt-1.5 leading-tight block">
                        {cls.statusNote}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Punctuality, Cleanliness & Catering Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
                <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                <span>Punctuality</span>
              </div>
              <strong className="text-sm font-bold text-slate-900 block">
                {train.punctualityScore}% On-Time
              </strong>
              <span className="text-[10px] text-slate-500">Over 30-day historical runs</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cleanliness</span>
              </div>
              <strong className="text-sm font-bold text-slate-900 block">
                {train.cleanlinessScore} / 5.0
              </strong>
              <span className="text-[10px] text-slate-500">OBHS onboard staff</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase">
                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                <span>Catering & Food</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-800 leading-tight">
                {train.pantry}
              </p>
            </div>
          </div>

          {/* Intermediate Key Halts Route Tracker */}
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">
              Key Route Halts & Timings
            </span>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex flex-wrap gap-2 items-center text-[11px] text-slate-700">
                {train.keyHalts.map((halt, i) => (
                  <React.Fragment key={i}>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium shadow-2xs">
                      {halt}
                    </span>
                    {i < train.keyHalts.length - 1 && (
                      <span className="text-slate-400">➔</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs: IRCTC & ConfirmTkt */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={train.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Train className="w-4 h-4 text-amber-300" />
              <span>Book Berth on IRCTC Official</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <a
              href={`https://www.confirmtkt.com/train-running-status/${train.trainNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Compass className="w-4 h-4 text-slate-600" />
              <span>Check Live Status & PNR</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-500" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
