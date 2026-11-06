import React, { useState } from 'react'
import {
  LICENSED_LENDING_PARTNERS,
  LOAN_TENURE_OPTIONS,
  calculateLoanEmi,
  EMERGENCY_LOAN_KYC_CHECKLIST,
  type LicensedLendingPartner,
} from '../data/emergencyLoan'
import {
  ShieldCheck,
  X,
  CreditCard,
  Zap,
  CheckCircle2,
  ChevronRight,
  Clock,
} from 'lucide-react'

interface EmergencyTravelLoanModalProps {
  isOpen: boolean
  onClose: () => void
  initialAmount?: number
  cityName?: string
  onToast?: (msg: string) => void
}

export const EmergencyTravelLoanModal: React.FC<EmergencyTravelLoanModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 15000,
  cityName = 'your trip',
  onToast,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount)
  const [selectedTenureMonths, setSelectedTenureMonths] = useState<number>(3)
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('axio')

  // Application / Simulation state
  const [mobileNumber, setMobileNumber] = useState<string>('')
  const [upiId, setUpiId] = useState<string>('')
  const [applicationStep, setApplicationStep] = useState<'configure' | 'verifying' | 'approved'>('configure')
  const [approvedDetails, setApprovedDetails] = useState<{
    referenceId: string
    disbursedAmount: number
    monthlyEmi: number
    tenureMonths: number
    partnerName: string
    upiId: string
    repaymentDateFormatted: string
  } | null>(null)

  if (!isOpen) return null

  const selectedTenure =
    LOAN_TENURE_OPTIONS.find((t) => t.months === selectedTenureMonths) || LOAN_TENURE_OPTIONS[0]
  const selectedPartner: LicensedLendingPartner =
    LICENSED_LENDING_PARTNERS.find((p) => p.id === selectedPartnerId) || LICENSED_LENDING_PARTNERS[0]

  const calculation = calculateLoanEmi(
    selectedAmount,
    selectedTenure.months,
    selectedTenure.annualInterestRatePercent
  )

  const handleApplyNow = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 10) {
      if (onToast) onToast('Please enter a valid 10-digit mobile number')
      return
    }

    setApplicationStep('verifying')

    // Simulate 90-second instant paperless NBFC disbursement
    setTimeout(() => {
      const generatedRef = `IMPS${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`
      const destinationUpi = upiId.trim() || `${mobileNumber.trim()}@upi`
      const nextMonthDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

      setApprovedDetails({
        referenceId: generatedRef,
        disbursedAmount: calculation.netDisbursedAmount,
        monthlyEmi: calculation.monthlyEmi,
        tenureMonths: calculation.tenureMonths,
        partnerName: selectedPartner.name,
        upiId: destinationUpi,
        repaymentDateFormatted: nextMonthDate,
      })

      setApplicationStep('approved')
      if (onToast) onToast(`Credit line of ₹${calculation.netDisbursedAmount.toLocaleString('en-IN')} approved!`)
    }, 1800)
  }

  const handleReset = () => {
    setApplicationStep('configure')
    setApprovedDetails(null)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-emerald-300 border border-white/20 flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-base sm:text-lg font-bold text-white">
                  Emergency Travel Credit Line
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold">
                  RBI Regulated
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/80">
                Licensed NBFC safety net • Instant 90-sec payout to UPI for {cityName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-emerald-100 hover:text-white transition-colors cursor-pointer"
            title="Close Loan Window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {applicationStep === 'configure' && (
            <>
              {/* Empathy & Licensed Guarantee Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-900 block text-xs">
                    Run out of budget mid-trip? Never get stranded.
                  </span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Access an instant ₹5,000–₹50,000 credit line provided exclusively by <strong>RBI-licensed NBFCs & Scheduled Banks</strong>. 100% paperless e-KYC, zero prepayment penalty, and 0% No-Cost EMI for 3 months.
                  </p>
                </div>
              </div>

              {/* Amount Selector Slider */}
              <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Emergency Cash Amount
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-indigo-700">
                    ₹{selectedAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  aria-label="Loan Amount Slider"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>Min: ₹5,000</span>
                  <span>Max: ₹50,000</span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {[5000, 10000, 15000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedAmount(amt)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedAmount === amt
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Repayment Tenure Options */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Select Repayment Tenure
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LOAN_TENURE_OPTIONS.map((tenure) => {
                    const isSelected = selectedTenureMonths === tenure.months
                    return (
                      <button
                        key={tenure.months}
                        type="button"
                        onClick={() => setSelectedTenureMonths(tenure.months)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-200 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">
                            {tenure.months} Months
                          </span>
                          <span
                            className={`text-[10px] font-bold block mt-0.5 ${
                              tenure.isNoCostEmi ? 'text-emerald-700 font-extrabold' : 'text-slate-500'
                            }`}
                          >
                            {tenure.isNoCostEmi ? '0% No-Cost EMI' : `${tenure.annualInterestRatePercent}% p.a.`}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500 block mt-2">
                          {tenure.tag}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Real-time Calculation Breakdown Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                      Monthly EMI
                    </span>
                    <strong className="text-2xl font-bold text-emerald-400">
                      ₹{calculation.monthlyEmi.toLocaleString('en-IN')}
                      <span className="text-xs text-slate-300 font-normal"> / month</span>
                    </strong>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Tenure</span>
                    <span className="text-xs font-bold text-slate-200">
                      {calculation.tenureMonths} Months
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Net Payout:</span>
                    <strong className="text-white">₹{calculation.netDisbursedAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Processing Fee:</span>
                    <strong className="text-emerald-400">₹0 (Zero)</strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Interest Rate:</span>
                    <strong className="text-white">
                      {calculation.isNoCostEmi ? '0% No-Cost' : `${calculation.annualInterestRatePercent}% APR`}
                    </strong>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Total Repayment:</span>
                    <strong className="text-white">₹{calculation.totalRepaymentAmount.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              {/* Licensed Lending Partners Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Choose Licensed Lending Partner
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    100% RBI Direct Transfer
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {LICENSED_LENDING_PARTNERS.map((partner) => {
                    const isSelected = selectedPartnerId === partner.id
                    return (
                      <button
                        key={partner.id}
                        type="button"
                        onClick={() => setSelectedPartnerId(partner.id)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-200 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 block truncate max-w-[170px]">
                              {partner.name}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {partner.entityType === 'RBI Registered NBFC' ? 'RBI-NBFC' : 'Bank'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {partner.description}
                          </p>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                          <span className="flex items-center gap-1 font-semibold text-emerald-700">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span>{partner.turnaroundTime}</span>
                          </span>
                          <span className="text-slate-400">Reg: {partner.rbiRegistrationNumber}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 4-Item Transparent KYC Checklist */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Transparent 100% Paperless Digital KYC</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  {EMERGENCY_LOAN_KYC_CHECKLIST.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800 block">{item.title}</strong>
                        <span className="text-[10px] text-slate-500">{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Application Form */}
              <form onSubmit={handleApplyNow} className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Mobile Number (Aadhaar Linked)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      maxLength={10}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      UPI ID for Instant IMPS Payout
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. traveler@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>
                    Get Instant ₹{calculation.netDisbursedAmount.toLocaleString('en-IN')} in 90 Seconds
                  </span>
                </button>

                {/* Grievance & RBI Regulatory Disclosure Footer */}
                <div className="text-[10px] text-slate-400 text-center leading-relaxed space-y-0.5">
                  <p>
                    Loans disbursed directly by RBI-registered NBFC {selectedPartner.parentCompany} (Reg: {selectedPartner.rbiRegistrationNumber}).
                  </p>
                  <p>
                    Grievance Officer: {selectedPartner.grievanceOfficerEmail} • National Helpline: {selectedPartner.customerSupportPhone}
                  </p>
                </div>
              </form>
            </>
          )}

          {applicationStep === 'verifying' && (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-14 h-14 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="font-editorial text-lg font-bold text-slate-900">
                  Verifying Aadhaar & Digital Credit Limit...
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Connecting to {selectedPartner.name} via DigiLocker and initiating instant IMPS settlement to your UPI.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>Estimated Time: 15–30 seconds</span>
              </div>
            </div>
          )}

          {applicationStep === 'approved' && approvedDetails && (
            <div className="py-6 px-2 space-y-5 animate-in fade-in duration-200">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-editorial text-xl font-bold text-slate-900">
                  ₹{approvedDetails.disbursedAmount.toLocaleString('en-IN')} Disbursed Successfully!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Funds have been pushed to <strong>{approvedDetails.upiId}</strong> via IMPS. Continue your journey with complete peace of mind.
                </p>
              </div>

              {/* Transfer Receipt Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">IMPS Reference:</span>
                  <strong className="font-mono text-slate-900 font-bold">{approvedDetails.referenceId}</strong>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Lending Partner:</span>
                  <strong className="text-indigo-700 font-bold">{approvedDetails.partnerName}</strong>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Monthly Installment (EMI):</span>
                  <strong className="text-emerald-700 font-bold">
                    ₹{approvedDetails.monthlyEmi.toLocaleString('en-IN')} / mo ({approvedDetails.tenureMonths} mos)
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">1st Repayment Date:</span>
                  <strong className="text-slate-800 font-bold">
                    {approvedDetails.repaymentDateFormatted}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Return to Trip Itinerary</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
                >
                  <span>Apply for Another Credit Limit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
