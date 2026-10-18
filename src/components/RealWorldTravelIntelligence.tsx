import React, { useState, useEffect } from 'react'
import {
  Sun,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  Navigation,
  Users,
  Car,
  Footprints,
  Info,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import {
  generateRealWorldVaranasiPlan,
  type RealWorldTravelPlan,
} from '../services/travel-engine/travelIntelligenceEngine'
import {
  VARANASI_HOTEL_HUBS,
  compareHotelSunriseLogistics,
} from '../services/travel-engine/hotelLogisticsService'

const DEFAULT_TRAVEL_DATE = '2026-10-18'

interface RealWorldTravelIntelligenceProps {
  initialDate?: string
  onPlanGenerated?: (plan: RealWorldTravelPlan) => void
}

export const RealWorldTravelIntelligence: React.FC<RealWorldTravelIntelligenceProps> = ({
  initialDate,
  onPlanGenerated,
}) => {
  const [travelDate, setTravelDate] = useState<string>(
    initialDate || DEFAULT_TRAVEL_DATE
  )
  const [selectedHotelId, setSelectedHotelId] = useState<string>('taj_cantonment')
  const [travelerCount, setTravelerCount] = useState<number>(2)
  const [budgetTier, setBudgetTier] = useState<'budget' | 'moderate' | 'premium'>('moderate')
  const [includeHotelInTotal, setIncludeHotelInTotal] = useState<boolean>(false)
  const [plan, setPlan] = useState<RealWorldTravelPlan | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [showHotelComparison, setShowHotelComparison] = useState<boolean>(false)

  const handleDateChange = (val: string) => {
    setLoading(true)
    setTravelDate(val)
  }

  const handleHotelChange = (val: string) => {
    setLoading(true)
    setSelectedHotelId(val)
  }

  const handleTravelerCountChange = (val: number) => {
    setLoading(true)
    setTravelerCount(val)
  }

  const handleBudgetTierChange = (val: 'budget' | 'moderate' | 'premium') => {
    setLoading(true)
    setBudgetTier(val)
  }

  const handleIncludeHotelChange = (val: boolean) => {
    setLoading(true)
    setIncludeHotelInTotal(val)
  }

  useEffect(() => {
    let isMounted = true

    generateRealWorldVaranasiPlan({
      travelDate,
      hotelId: selectedHotelId,
      travelerCount,
      budgetTier,
      includeHotelCostInTotal: includeHotelInTotal,
    })
      .then((generated) => {
        if (isMounted) {
          setPlan(generated)
          setLoading(false)
          if (onPlanGenerated) onPlanGenerated(generated)
        }
      })
      .catch((err) => {
        console.error('Plan generation error:', err)
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [travelDate, selectedHotelId, travelerCount, budgetTier, includeHotelInTotal, onPlanGenerated])

  const hotelsList = Object.values(VARANASI_HOTEL_HUBS)
  const hotelSunriseImpact = plan
    ? compareHotelSunriseLogistics(selectedHotelId, travelDate, plan.solar.sunrise, travelerCount)
    : null

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA580C]/10 text-[#EA580C] text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Real-World Travel Intelligence Engine</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A]">
            Varanasi Real-Time Execution Planner
          </h2>
          <p className="text-xs sm:text-sm text-[#5D554C] mt-1 max-w-2xl leading-relaxed">
            Calculates astronomical sunrise, door-to-door cab travel with pedestrian drop-offs, open restaurant verification, and source-based transport tariffs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Validated Feasibility</span>
          </span>
        </div>
      </div>

      {/* Control Panel: Date, Hotel, Travelers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#FAF7F2] border border-[#EFE7DC]">
        {/* Travel Date */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#78350F] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Travel Date</span>
          </label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5DACB] text-xs font-semibold text-[#201C1A] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          />
        </div>

        {/* Accommodation Starting Point */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#78350F] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Starting Hotel Hub</span>
          </label>
          <select
            value={selectedHotelId}
            onChange={(e) => handleHotelChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5DACB] text-xs font-semibold text-[#201C1A] focus:outline-none focus:ring-2 focus:ring-[#D97706]"
          >
            {hotelsList.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* Traveler Count */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#78350F] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Travelers in Group</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 4, 6].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => handleTravelerCountChange(count)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  travelerCount === count
                    ? 'bg-[#9A3412] text-white shadow-xs'
                    : 'bg-white border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                }`}
              >
                {count} {count === 1 ? 'Solo' : 'Pax'}
              </button>
            ))}
          </div>
        </div>

        {/* Tier */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#78350F] flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Budget Tier</span>
          </label>
          <div className="flex items-center gap-2">
            {(['budget', 'moderate', 'premium'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => handleBudgetTierChange(tier)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  budgetTier === tier
                    ? 'bg-[#9A3412] text-white shadow-xs'
                    : 'bg-white border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center text-xs text-[#78350F]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D97706] mb-2"></div>
          <p>Calculating astronomical solar transit and real-world route logistics...</p>
        </div>
      )}

      {plan && !loading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Key Intelligence Badges: Sunrise, Weather, Alarm */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Astronomical Sunrise Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border border-[#FDE68A] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#9A3412]">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-[#EA580C]" />
                  <span>Astronomical Sunrise</span>
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#FDE68A]">
                  NOAA Solar Algorithm
                </span>
              </div>
              <div className="text-2xl font-bold font-editorial text-[#78350F]">
                {plan.solar.sunrise} <span className="text-xs font-normal text-[#9A3412]">IST</span>
              </div>
              <div className="text-[11px] text-[#78350F] leading-snug">
                Civil Dawn (first ambient light): <strong>{plan.solar.civilDawn}</strong>. Golden Hour concludes at <strong>{plan.solar.goldenHourMorningEnd}</strong>.
              </div>
            </div>

            {/* 2. Hotel Departure Alarm Card */}
            {hotelSunriseImpact && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>Hotel Departure Alarm</span>
                  </span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    Calculated Timing
                  </span>
                </div>
                <div className="text-2xl font-bold font-editorial text-emerald-950">
                  {hotelSunriseImpact.requiredDepartureTime} <span className="text-xs font-normal text-emerald-800">AM</span>
                </div>
                <div className="text-[11px] text-emerald-900 leading-snug">
                  Arrive at Assi Jetty by <strong>{hotelSunriseImpact.recommendedArrivalTime} AM</strong> (25 mins before sunrise). {hotelSunriseImpact.drivingMinutes > 0 ? `Cab: ~${hotelSunriseImpact.drivingMinutes} mins.` : 'Walk: 2 mins.'}
                </div>
              </div>
            )}

            {/* 3. Weather & Sunrise Visibility Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] border border-sky-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                <span className="flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-700" />
                  <span>Dawn Conditions</span>
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-sky-200">
                  {plan.weather.status === 'LIVE_FORECAST' ? 'Live Forecast' : 'Climatology Model'}
                </span>
              </div>
              <div className="text-2xl font-bold font-editorial text-sky-950">
                {plan.weather.temperatureC}°C <span className="text-xs font-normal text-sky-800">({plan.weather.conditionLabel})</span>
              </div>
              <div className="text-[11px] text-sky-900 leading-snug">
                Sunrise Visibility: <strong>{plan.weather.sunriseVisibility}</strong>. {plan.weather.sunriseAdvice}
              </div>
            </div>
          </div>

          {/* Hotel Location Impact Comparison Accordion */}
          <div className="border border-[#E5DACB] rounded-2xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setShowHotelComparison(!showHotelComparison)}
              className="w-full px-5 py-3.5 bg-[#FAF7F2] flex items-center justify-between text-left text-xs font-bold text-[#201C1A] hover:bg-[#F2ECE1] transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9A3412]" />
                <span>Compare How Hotel Location Changes Your Morning Logistics</span>
              </div>
              <div className="flex items-center gap-1 text-[#9A3412]">
                <span>{showHotelComparison ? 'Hide Comparison' : 'Compare 5 Hotel Hubs'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${showHotelComparison ? 'rotate-90' : ''}`} />
              </div>
            </button>

            {showHotelComparison && (
              <div className="p-5 border-t border-[#E5DACB] space-y-4 text-xs text-[#554D45]">
                <p className="text-xs text-[#7A7167]">
                  HOMI compares properties based on practical travel reality—not merely ratings. Notice how staying directly on Assi Ghat saves 30 minutes of sleep and eliminates cab fares compared to outer highway properties.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#EFE7DC] bg-[#FAF7F2] text-[#78350F]">
                        <th className="p-2.5 font-bold">Hotel Hub</th>
                        <th className="p-2.5 font-bold">Required Departure</th>
                        <th className="p-2.5 font-bold">En Route Time</th>
                        <th className="p-2.5 font-bold">One-Way Cab Fare</th>
                        <th className="p-2.5 font-bold">Luggage Access</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE1]">
                      {hotelsList.map((h) => {
                        const comp = compareHotelSunriseLogistics(h.id, travelDate, plan.solar.sunrise, travelerCount)
                        const isCurrent = h.id === selectedHotelId
                        return (
                          <tr key={h.id} className={isCurrent ? 'bg-[#FFFBEB] font-semibold' : 'hover:bg-[#FAF7F2]'}>
                            <td className="p-2.5">
                              <span className="text-[#201C1A]">{h.name}</span>
                              {isCurrent && <span className="ml-1.5 text-[10px] text-[#EA580C] font-bold">(Selected)</span>}
                            </td>
                            <td className="p-2.5 text-[#9A3412] font-mono">{comp.requiredDepartureTime} AM</td>
                            <td className="p-2.5">{comp.totalEnRouteMinutes} mins ({comp.drivingMinutes > 0 ? `${comp.drivingMinutes}m drive` : 'walk'})</td>
                            <td className="p-2.5">{comp.estimatedCabFareInr > 0 ? `₹${comp.estimatedCabFareInr}` : '₹0 (Walk)'}</td>
                            <td className="p-2.5 text-[11px] text-[#7A7167]">{h.luggageAccessibility.replace(/_/g, ' ')}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Chronological Step-by-Step Execution Itinerary */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-2">
              <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                Execution-Level Day Plan ({plan.steps.length} Sequenced Steps)
              </h3>
              <span className="text-xs text-[#7A7167]">
                Times calibrated to {travelDate} solar cycle
              </span>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-[#E5DACB]">
              {plan.steps.map((step) => (
                <div
                  key={step.id}
                  className="relative pl-12 group transition-all"
                >
                  {/* Step icon node */}
                  <div className="absolute left-2.5 top-3 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-[#9A3412] flex items-center justify-center text-[10px] font-bold text-[#9A3412] z-10 shadow-xs">
                    {step.stepNumber}
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#E5DACB] shadow-xs space-y-3 hover:border-[#D97706] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F9F6F0] pb-2.5">
                      <div className="space-y-0.5">
                        <span className="font-mono text-xs font-bold text-[#9A3412]">
                          {step.startTime} – {step.endTime} ({step.durationMinutes} mins)
                        </span>
                        <h4 className="font-editorial text-base sm:text-lg font-bold text-[#201C1A]">
                          {step.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {step.costInr > 0 ? (
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#201C1A]">
                              ₹{step.costInr}
                            </span>
                            {travelerCount > 1 && (
                              <span className="text-[10px] text-[#7A7167] block">
                                (₹{step.costPerPersonInr}/person)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            Free Activity
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#48423E] leading-relaxed">
                      {step.operationalNotes}
                    </p>

                    {/* Pedestrian Gateway & Vehicle Restriction Details */}
                    {step.routeDetails && step.routeDetails.pedestrianApproach.isVehicleRestrictedZone && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Footprints className="w-3.5 h-3.5 text-amber-700" />
                          <span>Vehicle Restriction Gateway: {step.routeDetails.pedestrianApproach.dropOffGatewayName}</span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-snug">
                          {step.routeDetails.pedestrianApproach.pedestrianApproachNotes}
                        </p>
                      </div>
                    )}

                    {/* Dining Feasibility Badge */}
                    {step.diningDetails && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                          {step.diningDetails.statusBadge}
                        </span>
                        <span className="text-[11px] text-stone-600">
                          {step.diningDetails.restaurant.openTimeString}
                        </span>
                      </div>
                    )}

                    {/* Practical Tips */}
                    {step.practicalTips && step.practicalTips.length > 0 && (
                      <ul className="space-y-1 pt-1 border-t border-[#F2ECE1] text-[11px] text-[#7A7167]">
                        {step.practicalTips.map((tip, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-1.5">
                            <span className="text-[#D97706] mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Google Maps Route Action Link */}
                    {step.routeDetails && (
                      <div className="pt-1">
                        <a
                          href={step.routeDetails.directDirectionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A3412] hover:text-[#EA580C] transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Open Turn-by-Turn Route in Google Maps</span>
                          <ExternalLink className="w-3 h-3 text-stone-400" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-World Budget Breakdown & Reconciliation */}
          <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-[#E5DACB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE7DC] pb-3">
              <div>
                <h4 className="font-editorial text-lg font-bold text-[#201C1A]">
                  Real-World Execution Budget Reconciliation
                </h4>
                <p className="text-xs text-[#7A7167]">
                  Calculated on actual transport tariffs, boat fees, meals, and 10% contingency buffer.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHotelInTotal}
                    onChange={(e) => handleIncludeHotelChange(e.target.checked)}
                    className="rounded text-[#9A3412] focus:ring-[#D97706]"
                  />
                  <span>Include Hotel Room (₹{plan.budgetSummary.accommodationTotal})</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#EFE7DC]">
                <span className="text-[#8C8276] block text-[10px] uppercase font-bold">Cabs & Autos</span>
                <strong className="text-sm font-bold text-[#201C1A]">₹{plan.budgetSummary.transportTotal}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#EFE7DC]">
                <span className="text-[#8C8276] block text-[10px] uppercase font-bold">Boat & Rituals</span>
                <strong className="text-sm font-bold text-[#201C1A]">₹{plan.budgetSummary.activitiesTotal}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#EFE7DC]">
                <span className="text-[#8C8276] block text-[10px] uppercase font-bold">Meals & Chaat</span>
                <strong className="text-sm font-bold text-[#201C1A]">₹{plan.budgetSummary.foodTotal}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#EFE7DC]">
                <span className="text-[#8C8276] block text-[10px] uppercase font-bold">Entry Tickets</span>
                <strong className="text-sm font-bold text-[#201C1A]">₹{plan.budgetSummary.ticketsTotal}</strong>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#EFE7DC]">
                <span className="text-[#8C8276] block text-[10px] uppercase font-bold">Contingency (10%)</span>
                <strong className="text-sm font-bold text-[#201C1A]">₹{plan.budgetSummary.contingencyTotal}</strong>
              </div>

              <div className="p-3 rounded-xl bg-[#9A3412] text-white">
                <span className="text-amber-200 block text-[10px] uppercase font-bold">Per Person Total</span>
                <strong className="text-sm font-bold text-white">₹{plan.budgetSummary.perPersonTotal}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#7A7167] pt-2 border-t border-[#EFE7DC]">
              <span>Group Total ({travelerCount} Travelers): <strong className="text-[#201C1A]">₹{plan.budgetSummary.grandTotal}</strong></span>
              <span className="text-[11px] text-emerald-800 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Hidden Fees • Tariff-Checked</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
