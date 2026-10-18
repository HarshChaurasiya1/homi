import React, { useState } from 'react'
import { BRAND } from '../config/brand'
import { Link } from '../lib/router'
import { ShieldCheck } from 'lucide-react'


export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null)

  const openInfoModal = (type: 'about' | 'verify' | 'privacy' | 'terms') => {
    switch (type) {
      case 'about':
        setModalContent({
          title: `About ${BRAND.name}`,
          body: `${BRAND.name} is built on a simple conviction: ${BRAND.tagline} We believe real exploration should feel like walking through an Indian city with a trusted local friend. We don't accept commissions to rank attractions, and we keep our interface fast, lightweight, and clutter-free so you can spend less time staring at your screen and more time soaking in history.`,
        })
        break
      case 'verify':
        setModalContent({
          title: 'How We Verify Information',
          body: 'Every monument entry fee, opening timing, and public transport connection is manually cross-referenced with official portals: the Archaeological Survey of India (ASI), Delhi Tourism (DTTDC), Delhi Metro Rail Corporation (DMRC), Rajasthan Tourism Development Corporation (RTDC), and verified on-the-ground visits. We prominently state verification dates and warn travelers when timings are subject to change.',
        })
        break
      case 'privacy':
        setModalContent({
          title: 'Privacy Principles',
          body: `${BRAND.name} collects zero personal tracking cookies or behavioral profiles. Your saved bookmarks and draft trip itineraries are stored exclusively in your browser's private local storage. We believe in high utility with zero data harvesting.`,
        })
        break
      case 'terms':
        setModalContent({
          title: 'Terms & Travel Advice',
          body: 'Travel guidelines and monument tariffs in India can change during national gazetted holidays or maintenance cycles. HOMI provides verified indicative guidance. Travelers are encouraged to verify live opening hours during festivals and adhere to local cultural dress codes.',
        })
        break
    }
  }

  return (
    <footer className="bg-[#F2ECE1] border-t border-[#E5DACB] text-[#48423E] mt-16 pb-20 md:pb-8 pt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#DCD0C0]">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl font-bold text-[#201C1A]">
                {BRAND.name}
              </span>
              <span className="text-xs font-medium text-[#7D736A] uppercase tracking-wider">
                {BRAND.tagline}
              </span>
            </div>
            <p className="text-sm text-[#645C55] max-w-md leading-relaxed">
              {BRAND.description}
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-[#7A2211] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#8C2D19]" />
              <span>Independent & commission-free local curation</span>
            </div>
          </div>

          {/* Pilot Cities */}
          <div>
            <h3 className="font-editorial text-sm font-semibold text-[#201C1A] uppercase tracking-wider mb-3">
              5 Pilot Destinations
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { id: 'jaipur', name: 'Jaipur', color: '#C85A32', tag: 'Pink City' },
                { id: 'udaipur', name: 'Udaipur', color: '#1B4965', tag: 'Lakes' },
                { id: 'manali', name: 'Manali', color: '#1E4620', tag: 'Pines' },
                { id: 'varanasi', name: 'Varanasi', color: '#9B2226', tag: 'Ghats' },
                { id: 'mussoorie', name: 'Mussoorie', color: '#2E4057', tag: 'Hills' },
              ].map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/${c.id}`}
                    className="hover:underline transition-colors flex items-center justify-between"
                    style={{ color: c.color }}
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#E5DACB]">
                      {c.tag}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Platform & Trust */}
          <div>
            <h3 className="font-editorial text-sm font-semibold text-[#201C1A] uppercase tracking-wider mb-3">
              Trust & Transparency
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => openInfoModal('about')}
                  className="hover:text-[#201C1A] transition-colors text-left"
                >
                  About HOMI
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInfoModal('verify')}
                  className="hover:text-[#201C1A] transition-colors text-left flex items-center gap-1"
                >
                  <span>How we verify</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInfoModal('privacy')}
                  className="hover:text-[#201C1A] transition-colors text-left"
                >
                  Privacy policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openInfoModal('terms')}
                  className="hover:text-[#201C1A] transition-colors text-left"
                >
                  Terms & travel advice
                </button>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.contactEmail}`}
                  className="hover:text-[#201C1A] transition-colors"
                >
                  Contact curator
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#887F76] gap-3">
          <p>© 2026 {BRAND.name}. {BRAND.builtIn}.</p>
          <p className="flex items-center gap-1">

            <span>Fast, lightweight, static-first Indian travel platform</span>
          </p>
        </div>
      </div>

      {/* Lightweight Info Modal */}
      {modalContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalContent(null)}
        >
          <div
            className="bg-[#FAF7F2] border border-[#E5DACB] rounded-2xl max-w-md w-full p-6 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-editorial text-xl font-bold text-[#201C1A] mb-3">
              {modalContent.title}
            </h3>
            <p className="text-sm text-[#48423E] leading-relaxed mb-6">
              {modalContent.body}
            </p>
            <button
              onClick={() => setModalContent(null)}
              className="w-full py-2.5 rounded-lg bg-[#201C1A] text-white text-sm font-medium hover:bg-[#38332E] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  )
}
