import React, { useState } from 'react'
import {
  getSafetyDirectoryForCity,
  NATIONAL_EMERGENCY_HELPLINES,
  type CitySafetyDirectory,
} from '../data/emergencyContacts'
import {
  ShieldAlert,
  PhoneCall,
  MessageCircle,
  ExternalLink,
  MapPin,
  Clock,
  ShieldCheck,
  X,
  AlertTriangle,
  Hospital,
  Globe,
  Radio,
  LifeBuoy,
  CreditCard,
  Zap,
} from 'lucide-react'
import { EmergencyTravelLoanModal } from './EmergencyTravelLoanModal'

interface LocalGuideAndEmergencyHubProps {
  cityId: string
  isOpen: boolean
  onClose: () => void
  onToast?: (msg: string) => void
}

export const LocalGuideAndEmergencyHub: React.FC<LocalGuideAndEmergencyHubProps> = ({
  cityId,
  isOpen,
  onClose,
  onToast,
}) => {
  const directory: CitySafetyDirectory = getSafetyDirectoryForCity(cityId)
  const [activeTab, setActiveTab] = useState<'guide' | 'sos' | 'police' | 'portals' | 'hospitals' | 'loan'>('guide')
  const [loanModalOpen, setLoanModalOpen] = useState(false)

  if (!isOpen) return null

  const handleCopyPhone = (number: string, label: string) => {
    navigator.clipboard.writeText(number)
    if (onToast) onToast(`Copied ${label} phone number: ${number}`)
  }

  const guideWhatsappUrl = `https://wa.me/${directory.assignedGuide.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Namaste ${directory.assignedGuide.name}! I am exploring ${directory.cityName} using the HOMI app and need quick guidance on my current location.`
  )}`

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-editorial text-base font-bold text-white">
                  Local Guide & Safety Hub
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-300">
                Assigned for <strong>{directory.cityName}</strong> • 24x7 Assistance
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Safety Hub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50 px-3 py-1.5 overflow-x-auto gap-1 shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Assigned Local Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'sos'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>National SOS (112)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('police')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'police'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Local Police</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('portals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'portals'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Official Portals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hospitals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'hospitals'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            <span>Hospitals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('loan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'loan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Emergency Funds</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* =========================================================================
              TAB 1: ASSIGNED LOCAL GUIDE
             ========================================================================= */}
          {activeTab === 'guide' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-gradient-to-br from-indigo-50/90 to-purple-50/90 rounded-3xl p-5 border border-indigo-100 shadow-xs space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img
                      src={directory.assignedGuide.avatarImage}
                      alt={directory.assignedGuide.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-600 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-editorial text-base font-bold text-slate-900">
                        {directory.assignedGuide.name}
                      </h4>
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                      {directory.assignedGuide.badge}
                    </span>
                    <p className="text-xs text-slate-600">
                      {directory.assignedGuide.title}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-indigo-100/80">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{directory.assignedGuide.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{directory.assignedGuide.availableHours}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic bg-white/70 p-3 rounded-2xl border border-indigo-100">
                  "{directory.assignedGuide.bio}"
                </p>

                {/* Direct Action Buttons: Call & WhatsApp */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <a
                    href={`tel:${directory.assignedGuide.phone}`}
                    className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-200 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Guide</span>
                  </a>

                  <a
                    href={guideWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Help</span>
                  </a>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                  <span>Languages: {directory.assignedGuide.languages.join(', ')}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(directory.assignedGuide.phone, directory.assignedGuide.name)}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Copy Phone
                  </button>
                </div>
              </div>

              {/* Safety Guidance Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <LifeBuoy className="w-4 h-4 text-indigo-600" />
                  <span>When to contact your local companion?</span>
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                  <li>If you get lost in narrow alleys or offbeat lanes.</li>
                  <li>To verify authentic boat rates or avoid aggressive commission touts.</li>
                  <li>To double-check live temple opening hours or dress codes.</li>
                  <li>In any emergency situation where local translation or police coordination is needed.</li>
                </ul>
              </div>

              {/* Quick Emergency Travel Fund Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-900 flex items-center gap-1 text-[11px]">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Low on Cash in {directory.cityName}?</span>
                  </span>
                  <p className="text-[10px] text-emerald-800">
                    Access ₹5k–₹50k credit line with 0% No-Cost EMI via licensed RBI partners.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLoanModalOpen(true)}
                  className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs cursor-pointer whitespace-nowrap"
                >
                  Apply Now
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: NATIONAL SOS HELPLINES
             ========================================================================= */}
          {activeTab === 'sos' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong>Emergency Advice:</strong> Dial <strong>112</strong> immediately for police or medical crises anywhere in India. Calls are recorded and GPS-dispatched.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {NATIONAL_EMERGENCY_HELPLINES.map((hl) => (
                  <div
                    key={hl.code}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-editorial text-xl font-extrabold text-slate-900">
                          {hl.code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          24x7 Toll-Free
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-800">{hl.name}</h5>
                      <p className="text-[11px] text-slate-500 leading-snug">{hl.description}</p>
                    </div>

                    <a
                      href={`tel:${hl.code}`}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                      <span>{hl.actionText}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: LOCAL POLICE STATIONS
             ========================================================================= */}
          {activeTab === 'police' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-xs text-slate-500">
                Official Police Stations & Tourist Assistance Units in <strong>{directory.cityName}</strong>:
              </p>

              <div className="space-y-2.5">
                {directory.policeStations.map((ps, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-xs text-slate-900">{ps.name}</h5>
                          {ps.isTouristSpecialist && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                              Tourist Booth
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-indigo-600 font-medium">{ps.area}</p>
                      </div>

                      <a
                        href={`tel:${ps.phone}`}
                        className="py-1.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        <PhoneCall className="w-3 h-3 text-indigo-600" />
                        <span>Call</span>
                      </a>
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-1.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{ps.address}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Station Landline: {ps.phone}</span>
                        {ps.mobileOrInspector && (
                          <span className="text-[10px] text-slate-400">Inspector: {ps.mobileOrInspector}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: OFFICIAL WEBSITES & PORTALS
             ========================================================================= */}
          {activeTab === 'portals' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-xs text-slate-500">
                Verified official government, temple trust, and rail transit portals:
              </p>

              <div className="space-y-2.5">
                {directory.officialPortals.map((op, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-xs text-slate-900">{op.title}</h5>
                          {op.isGovernmentOfficial && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Govt Verified
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{op.description}</p>
                      </div>

                      <a
                        href={op.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: HOSPITALS & TRAUMA CENTRES
             ========================================================================= */}
          {activeTab === 'hospitals' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-xs text-slate-500">
                24x7 Emergency Hospitals & Trauma Centers in <strong>{directory.cityName}</strong>:
              </p>

              <div className="space-y-2.5">
                {directory.hospitals.map((hosp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{hosp.name}</h5>
                        <p className="text-[11px] text-slate-500">{hosp.type}</p>
                      </div>

                      <a
                        href={`tel:${hosp.phone}`}
                        className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        <PhoneCall className="w-3 h-3 text-rose-600" />
                        <span>Emergency</span>
                      </a>
                    </div>

                    <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-1.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{hosp.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: EMERGENCY TRAVEL CREDIT LINE (LICENSED RBI NBFC PARTNERS)
             ========================================================================= */}
          {activeTab === 'loan' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 border border-emerald-500/30 shadow-md space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    <span>RBI-Regulated NBFC Line</span>
                  </span>
                  <span className="text-[11px] text-emerald-200 font-semibold">
                    Instant 90-sec UPI payout
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-editorial text-lg font-bold text-white">
                    Emergency Travel Cash in {directory.cityName}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Never get stranded. Access instant credit from <strong>₹5,000 to ₹50,000</strong> with <strong>0% No-Cost EMI for 3 months</strong> directly to your UPI or Bank account via verified licensed lending partners.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div>• 0% No-Cost EMI (3 mos)</div>
                  <div>• 100% Paperless e-KYC</div>
                  <div>• Zero Prepayment Fee</div>
                  <div>• Direct Bank / UPI Push</div>
                </div>

                <button
                  type="button"
                  onClick={() => setLoanModalOpen(true)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Configure & Apply for Emergency Credit</span>
                </button>
              </div>

              {/* Partner Badges */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Licensed Lending Partners:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900 block">Axio (Capfloat)</strong>
                    <span className="text-[10px] text-slate-500">RBI NBFC B-05.05602</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900 block">IDFC FIRST Bank</strong>
                    <span className="text-[10px] text-slate-500">Scheduled Commercial</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900 block">CASHe (Bhanix)</strong>
                    <span className="text-[10px] text-slate-500">RBI NBFC 13.00221</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900 block">KreditBee (KrazyBee)</strong>
                    <span className="text-[10px] text-slate-500">RBI NBFC N-02.00288</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>HOMI 24x7 Traveler Protection</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-indigo-600 hover:underline"
          >
            Close
          </button>
        </div>
      </div>

      {loanModalOpen && (
        <EmergencyTravelLoanModal
          isOpen={loanModalOpen}
          onClose={() => setLoanModalOpen(false)}
          cityName={directory.cityName}
          initialAmount={15000}
          onToast={onToast}
        />
      )}
    </div>
  )
}
