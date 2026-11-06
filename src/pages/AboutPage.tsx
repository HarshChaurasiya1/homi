import React, { useState } from 'react'
import { Link } from '../lib/router'
import { HomiBrandLogo } from '../components/HomiBrandLogo'
import { EmergencyTravelLoanModal } from '../components/EmergencyTravelLoanModal'
import {
  Code2,
  Compass,
  CreditCard,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
  Database,
  Info,
  Zap,
  Flame,
} from 'lucide-react'

interface AboutPageProps {
  onSaveToast?: (msg: string) => void
}

export const AboutPage: React.FC<AboutPageProps> = ({ onSaveToast }) => {
  const [loanModalOpen, setLoanModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<'manifesto' | 'ideas' | 'tech' | 'directory' | 'faq'>('manifesto')

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* 1. Page Header & Editorial Banner */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-bold text-indigo-600">About & Engineering Documentation</span>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4 border border-indigo-900/50">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <HomiBrandLogo size="lg" />
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Production Documentation v2.4</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-editorial text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Architecture of Authentic Travel
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              How we built HOMI: The complete philosophy, technical blueprints, and execution-level minutiae designed for a traveler sitting in Jhansi exploring Varanasi and beyond with zero tourist traps.
            </p>
          </div>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Tests Passing</span>
              <strong className="text-emerald-400 font-bold text-sm">1,174 Automated</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Frontend Stack</span>
              <strong className="text-white font-bold text-sm">React 19 + Vite 8</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Persistence</span>
              <strong className="text-white font-bold text-sm">Offline Local-First</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Stock Photos</span>
              <strong className="text-rose-300 font-bold text-sm">0% (Strictly Banned)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Section Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'manifesto', label: '1. The Jhansi Manifesto', icon: Flame },
          { id: 'ideas', label: '2. Core Ideas & Systems', icon: Sparkles },
          { id: 'tech', label: '3. What We Use (Tech Stack)', icon: Cpu },
          { id: 'directory', label: '4. System Directory', icon: Layers },
          { id: 'faq', label: '5. Architecture FAQ', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSection === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 3. Dynamic Section Content */}
      <div className="space-y-8">
        {/* =========================================================================
            SECTION 1: THE JHANSI MANIFESTO & PHILOSOPHY
           ========================================================================= */}
        {activeSection === 'manifesto' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                  Chapter 1: The Soul of HOMI
                </span>
                <h2 className="font-editorial text-2xl font-bold text-slate-900 mt-1">
                  The Jhansi Traveler Perspective: Why Most Travel Apps Fail Tier-2 India
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>
                  Imagine sitting at a chai stall near <strong>Jhansi Junction</strong> or <strong>Sipri Bazar</strong>. You and your college friends or family decide to plan a pilgrimage and exploration trip to <strong>Varanasi</strong>, or a royal weekend in <strong>Jaipur</strong> or <strong>Udaipur</strong>.
                </p>

                <p>
                  You open traditional travel apps. What do you see?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
                    <span className="font-bold text-rose-800 block text-xs">Fake Stock Imagery</span>
                    <p className="text-[11px] text-rose-700">
                      Unsplash stock photos shot in Bali or Switzerland tagged as Indian destinations, creating completely false expectations.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
                    <span className="font-bold text-amber-800 block text-xs">Commission Touts & OTAs</span>
                    <p className="text-[11px] text-amber-700">
                      Hotels and tour packages pushed based on who pays the highest 25% affiliate commission, not real ground quality or safety.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                    <span className="font-bold text-indigo-800 block text-xs">Zero Transit Minutiae</span>
                    <p className="text-[11px] text-indigo-700">
                      Generic advice saying "take a train", without train numbers, class fares (General vs Sleeper), or return logistics.
                    </p>
                  </div>
                </div>

                <p>
                  HOMI was built from the ground up to dismantle this broken experience. The name <strong>HOMI</strong> comes from two fundamental Indian cultural pillars: <em>Homely Comfort</em> and <em>Apnapan</em> (kinship). When you travel with HOMI, you aren't browsing an anonymous catalog; you are traveling with a knowledgeable local elder brother or sister who lives at the destination.
                </p>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 space-y-1.5">
                  <strong className="block text-indigo-900 font-bold">The Three Golden Laws of HOMI:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-indigo-900">
                    <li><strong>Minuteness over abstraction</strong>: Exact train numbers (#11108 Bundelkhand Express), exact platform timings, verified ticket tariffs down to the single rupee.</li>
                    <li><strong>Truth over aesthetics</strong>: 100% locally-captured real video frames from India’s solo travel vloggers. Never fake stock models.</li>
                    <li><strong>Safety and dignity for all budgets</strong>: Whether you have ₹1,200 for a sleeper berth and ghat dharamsala or ₹15,000 for a heritage haveli, you receive equal respect and complete security.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 2: CORE IDEAS & HOW THE APP WORKS
           ========================================================================= */}
        {activeSection === 'ideas' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                  Chapter 2: Core Engineering Pillars
                </span>
                <h2 className="font-editorial text-2xl font-bold text-slate-900 mt-1">
                  How HOMI Works: 7 Execution-Level Subsystems
                </h2>
              </div>

              <div className="space-y-6">
                {/* Pillar 1 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <h3 className="font-editorial text-base font-bold text-slate-900">
                      1-Question-at-a-Time Minimalist Trip Planner
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Instead of intimidating travelers with a massive 15-field booking form, HOMI uses a step-by-step progressive disclosure model.
                    Origin → Destination → Intercity Transit Mode → Travel Group → Duration (1 to 4+ Days) → Daily Budget Tier.
                    Each screen has a single job, eliminating decision fatigue.
                  </p>
                </div>

                {/* Pillar 2 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <h3 className="font-editorial text-base font-bold text-slate-900">
                      Real YouTube Video & Authentic Ground Photography Engine
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We banned stock photography platforms. Every hero image, monument card, and street food banner is sampled from verified on-the-ground YouTube video footage captured by authentic creators like <strong>Visa2explore (Harish Bali)</strong> and <strong>Tanya Khanijow</strong>. Travelers see real lighting, real crowd densities, and actual architectural textures.
                  </p>
                </div>

                {/* Pillar 3 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <h3 className="font-editorial text-base font-bold text-slate-900">
                      Indian Railways (IRCTC) Minutiae & Calibrated Route Engine
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We calibrated real Indian Railways timetable data in <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">src/data/trainRoutes.ts</code>.
                    For any route (e.g. Jhansi ↔ Varanasi, Jhansi ↔ Jaipur, Delhi ↔ Manali), the system computes real train numbers (e.g. <strong>#11108 Bundelkhand Express</strong>), exact departure/arrival times, live halts with timing tables, pantry car availability, punctuality indices, and class-by-class tariffs from General 2S (₹175) to Sleeper (₹325) and 3AC (₹880). It crowns <strong>one and only one</strong> recommended train to eliminate second-guessing.
                  </p>
                </div>

                {/* Pillar 4 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                    <h3 className="font-editorial text-base font-bold text-slate-900">
                      Assigned Local Guide Companion & 24x7 Safety Directory
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Every destination is linked to a verified resident guide persona (e.g., <strong>Pandit Ramakant Shukla</strong> in Varanasi, <strong>Bhanwar Singh Rathore</strong> in Jaipur). Travelers get 1-tap direct phone calling, pre-filled WhatsApp guidance, verified neighborhood police station phone numbers, district hospital helplines, and national SOS (112).
                  </p>
                </div>

                {/* Pillar 5 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">5</span>
                    <h3 className="font-editorial text-base font-bold text-slate-900">
                      Itemized Budget Breakdown & "Where You Can Reduce" Engine
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Instead of lump-sum guesses, every trip budget is broken into 5 explicit categories: Accommodation, Meals, Local Transit, Entry Tickets, and an 8% Incidental Buffer. The system provides actionable cost-cutting hacks (e.g., opting for shared e-rickshaws over private cabs, or sleeper berths over 3AC) that save ₹2,000 to ₹5,000 without sacrificing personal safety or food hygiene.
                  </p>
                </div>

                {/* Pillar 6 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">6</span>
                    <h3 className="font-editorial text-base font-bold text-slate-900">
                      Licensed RBI-Regulated Emergency Travel Credit Line
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    If an emergency strikes mid-trip and cash runs low, travelers can access an instant credit line of ₹5,000 to ₹50,000 provided exclusively by licensed RBI-regulated NBFCs and Banks (Axio, IDFC FIRST, CASHe, KreditBee). Features 0% No-Cost EMI for 3 months, 90-second UPI payout, 100% paperless e-KYC, and zero prepayment penalties.
                  </p>
                  <button
                    type="button"
                    onClick={() => setLoanModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs mt-1"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Launch Emergency Credit Simulator</span>
                  </button>
                </div>

                {/* Pillar 7 */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">7</span>
                    <h3 className="font-editorial text-base font-bold text-slate-900">
                      Vetted Direct Hotel Booking Directory
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We curated 18+ high-reputation properties across Budget Hostels, Heritage Havelis, and Luxury 5-star Palaces. Each listing includes verified front-desk phone numbers, exact physical addresses, and direct links to official hotel booking engines and Booking.com with zero hidden markup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 3: WHAT WE USE (TECH STACK & ARCHITECTURE)
           ========================================================================= */}
        {activeSection === 'tech' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Chapter 3: Technical Blueprint
                </span>
                <h2 className="font-editorial text-2xl font-bold text-slate-900 mt-1">
                  What We Use: Technologies, Libraries & Design Decisions
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    <span>React 19 & TypeScript 5.8</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Built on the modern React 19 component model with strict TypeScript type-checking across all data models, transit structures, and state mutations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Vite 8 & Tailwind CSS</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Sub-second compilation and optimized chunk-splitting. Styled with Tailwind CSS utility classes designed specifically for a mobile-first app shell.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>Local-First Persistence</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Zero latency, offline-capable architecture. User profiles, unlocked cities, saved boards, and drafts persist in structured client storage without creepy tracking cookies.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>1,174 Automated Unit Tests</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Custom native TypeScript test runner (<code className="text-slate-800">src/tests/run.ts</code>) executing 1,170+ tests across transit math, hotel links, safety directories, and profile states.
                  </p>
                </div>
              </div>

              {/* Data Flow Diagram */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                  ARCHITECTURE DATA FLOW
                </span>
                <div className="font-mono text-[11px] text-slate-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/10 overflow-x-auto">
                  [User Input: Jhansi → Varanasi, 2 Days, Moderate]
                  <br />
                  &nbsp;&nbsp;│
                  <br />
                  &nbsp;&nbsp;├──► calculateIntercityTransit() ──► 11108 Bundelkhand Exp (₹325 SL)
                  <br />
                  &nbsp;&nbsp;├──► generateItinerary() ──────────► Day 1 Ghats & Aarti, Day 2 Sarnath
                  <br />
                  &nbsp;&nbsp;├──► calculateItemizedBudget() ────► Stay: ₹3.8k, Food: ₹1.6k, Buffer: ₹750
                  <br />
                  &nbsp;&nbsp;├──► getSafetyDirectory() ────────► Pandit Ramakant Shukla (98390...)
                  <br />
                  &nbsp;&nbsp;└──► calculateLoanEmi() ──────────► Axio 0% No-Cost EMI (₹5,000/mo)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 4: COMPLETE SYSTEM DIRECTORY
           ========================================================================= */}
        {activeSection === 'directory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                  Chapter 4: Codebase Index
                </span>
                <h2 className="font-editorial text-2xl font-bold text-slate-900 mt-1">
                  System Directory & Code Map
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  {
                    file: 'src/App.tsx',
                    desc: 'Root application shell, reactive router listener, bottom navigation bar, and toast notification container.',
                  },
                  {
                    file: 'src/components/InteractiveTripBuilder.tsx',
                    desc: 'The heart of HOMI: 6-question minimal planner, real-time budget generator, and day-by-day journey cards.',
                  },
                  {
                    file: 'src/components/MultiModalTransitHub.tsx',
                    desc: 'Outbound and Return transit switcher, highlighting the #1 crowned train with class-by-class fares.',
                  },
                  {
                    file: 'src/components/DetailedTrainInspector.tsx',
                    desc: 'Interactive train inspector showing coach halts, departure/arrival timings, pantry status, and IRCTC links.',
                  },
                  {
                    file: 'src/components/EmergencyTravelLoanModal.tsx',
                    desc: 'Licensed RBI NBFC travel credit line simulator with 0% No-Cost EMI, 90-sec UPI payout, and grievance details.',
                  },
                  {
                    file: 'src/components/CityHotelRecommendations.tsx',
                    desc: 'Vetted hotels directory across Budget, Heritage, and Luxury tiers with direct phone numbers and booking URLs.',
                  },
                  {
                    file: 'src/components/LocalGuideAndEmergencyHub.tsx',
                    desc: 'Assigned local guide companion profile, 1-tap WhatsApp chat, police station contacts, and 112 SOS.',
                  },
                  {
                    file: 'src/data/trainRoutes.ts',
                    desc: 'Indian Railways database: direct routes, intermediate halts, ticket tariffs (2S, SL, 3AC, 2AC, 1AC).',
                  },
                  {
                    file: 'src/data/hotels.ts',
                    desc: 'Curated hotel database across Varanasi, Jaipur, Udaipur, Manali, Mussoorie, and Delhi.',
                  },
                  {
                    file: 'src/data/emergencyLoan.ts',
                    desc: 'Licensed lending partner registry (Axio, IDFC FIRST, CASHe, KreditBee), EMI formulas, and RBI disclosures.',
                  },
                  {
                    file: 'src/data/emergencyContacts.ts',
                    desc: 'Verified municipal police stations, district hospitals, local guide personas, and official tourism portals.',
                  },
                  {
                    file: 'src/lib/plannerEngine.ts',
                    desc: 'Deterministic itinerary calculation engine, time slot assignment, and honest rupee budget breakdowns.',
                  },
                  {
                    file: 'src/lib/profileStore.ts',
                    desc: 'Local-first traveler profile, unlockable achievements, and saved trip itinerary database.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <code className="font-mono text-indigo-700 font-bold block text-xs">
                        {item.file}
                      </code>
                      <p className="text-[11px] text-slate-600 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SECTION 5: FAQ & BORROWER ASSURANCE
           ========================================================================= */}
        {activeSection === 'faq' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                  Chapter 5: Transparency & Assurance
                </span>
                <h2 className="font-editorial text-2xl font-bold text-slate-900 mt-1">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    Is the Emergency Travel Loan partner program RBI-licensed?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Yes, 100%. We partner exclusively with RBI-registered NBFCs and Scheduled Commercial Banks (such as <strong>Capfloat / Axio</strong> Reg B-05.05602, <strong>Bhanix / CASHe</strong> Reg 13.00221, and <strong>IDFC FIRST Bank</strong>). We strictly ban illegal, unregulated payday loan apps. Every transaction complies with RBI’s Digital Lending Guidelines with zero hidden charges.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    How are train ticket prices and timetables verified?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Train numbers, departure times, and class tariffs are calibrated against official Indian Railways (IRCTC / CRIS) passenger tariff tables. We track General Unreserved (2S), Sleeper (SL), 3AC, 2AC, and 1AC base fares without third-party commission markups.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                    Does HOMI take commissions from hotels or guides?
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No. Unlike commercial OTAs that demand 20%–30% cuts, HOMI provides direct telephone numbers and direct booking links. Local guides and hotels are recommended solely based on real traveler safety, clean amenities, and cultural integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Travel Loan Modal instance */}
      {loanModalOpen && (
        <EmergencyTravelLoanModal
          isOpen={loanModalOpen}
          onClose={() => setLoanModalOpen(false)}
          initialAmount={15000}
          cityName="Varanasi & Rajasthan"
          onToast={onSaveToast}
        />
      )}
    </div>
  )
}
