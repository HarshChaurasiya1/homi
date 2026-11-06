import React, { useState } from 'react'
import {
  VARANASI_LOCAL_VIDEO_INTEL,
  type VaranasiVideoIntel,
} from '../data/varanasiVideoIntel'
import {
  Video,
  Clock,
  Coins,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Sparkles,
  Quote,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  ExternalLink,
} from 'lucide-react'

const YouTubeIcon = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

export const VaranasiLocalVideoIntel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)
  const [activeLightbox, setActiveLightbox] = useState<VaranasiVideoIntel | null>(null)

  const categories = [
    { id: 'all', label: 'All 20 Videos' },
    { id: 'Ghats & Dawn Rituals', label: '🌅 Ghats & Dawn' },
    { id: 'Legendary Food & Sweets', label: '🍲 Food & Sweets' },
    { id: 'Temples & Sacred Etiquette', label: '🛕 Temples & Etiquette' },
    { id: 'Ancient Crafts & Bazaars', label: '🧵 Crafts & Bazaars' },
    { id: 'River Boats & Navigation', label: '🚤 River Boats' },
    { id: 'Havelis & Excursions', label: '🏰 Havelis & Excursions' },
  ]

  const filteredVideos = VARANASI_LOCAL_VIDEO_INTEL.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory
    const query = searchQuery.toLowerCase().trim()
    if (!query) return matchesCategory

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.creator.toLowerCase().includes(query) ||
      item.channel.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.groundTruth.toLowerCase().includes(query) ||
      item.tag.toLowerCase().includes(query) ||
      (item.videoTitle && item.videoTitle.toLowerCase().includes(query)) ||
      item.videoInsights.some((tip) => tip.toLowerCase().includes(query))

    return matchesCategory && matchesSearch
  })

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DACB] shadow-xs space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
            <Video className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Field Intelligence • 20 Real YouTube Video Walkthroughs</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#201C1A]">
            Varanasi Through Local Eyes
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7167] mt-1 max-w-2xl leading-relaxed">
            Curated from 20 on-ground Banarasi video creators, food historians, master weavers, and riverboat elders.
            Every scene features genuine video frame screenshots, verified boat tariffs, real timings, and direct YouTube source links.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[11px] font-bold text-red-700 flex items-center gap-1.5 shadow-xs">
            <YouTubeIcon className="w-3.5 h-3.5 text-red-600" />
            <span>20 Real YouTube Screenshots</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[11px] font-bold text-[#9A3412] hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>100% Ground Truth</span>
          </span>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#9A3412] text-white shadow-xs'
                  : 'bg-[#FAF7F2] border border-[#E5DACB] text-[#554D45] hover:bg-[#F2ECE1]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Instant Search Bar */}
        <div className="relative min-w-[240px] sm:min-w-[300px]">
          <Search className="w-4 h-4 text-[#8C2D19]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Ram Bhandar, Manikarnika, Lockers..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5DACB] bg-[#FAF7F2] text-xs focus:outline-none focus:ring-2 focus:ring-[#9A3412] focus:bg-white transition-all text-[#201C1A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid of 20 Video Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((item) => {
          const isExpanded = expandedCardId === item.id

          return (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden border border-[#EFE7DC] bg-[#FAF7F2] flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              {/* Photo Header with Overlay Badges */}
              <div
                className="relative h-48 overflow-hidden group cursor-pointer"
                onClick={() => setActiveLightbox(item)}
              >
                <img
                  src={item.photo}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35"></div>

                {/* Top badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white font-bold backdrop-blur-xs flex items-center gap-1 truncate max-w-[150px]">
                    <PlayCircle className="w-3 h-3 text-[#D97706] shrink-0" />
                    <span className="truncate">{item.channel}</span>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-red-600/95 text-white font-bold shadow-xs flex items-center gap-1">
                      <YouTubeIcon className="w-2.5 h-2.5" />
                      <span>Real Frame</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#9A3412] text-white font-bold shadow-xs">
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Bottom title & location on photo */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-white/90 font-medium">
                    <MapPin className="w-3 h-3 text-[#D97706]" />
                    <span>{item.location}</span>
                  </div>
                  <h3 className="font-editorial text-sm sm:text-base font-bold leading-snug line-clamp-2 mt-0.5">
                    {item.title}
                  </h3>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1 rounded-full bg-white/90 text-[11px] font-bold text-[#201C1A] flex items-center gap-1 shadow-md">
                    <Maximize2 className="w-3 h-3 text-[#9A3412]" />
                    <span>View Frame & Secrets</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                {/* Dialect quote */}
                <div className="p-2.5 rounded-xl bg-white border border-[#EFE7DC] relative">
                  <Quote className="w-3.5 h-3.5 text-[#9A3412]/30 absolute top-2 right-2" />
                  <p className="text-[11px] text-[#201C1A] font-semibold italic pr-4 leading-relaxed">
                    "{item.dialectQuote}"
                  </p>
                  <span className="text-[9px] text-[#7A7167] block mt-1 font-bold uppercase tracking-wider">
                    — {item.creator} ({item.channel})
                  </span>
                </div>

                {/* Key Execution Metrics: Timing & Cost */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/80 border border-[#EFE7DC] text-[#554D45]">
                    <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                    <span className="truncate">{item.bestTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/80 border border-[#EFE7DC] text-[#554D45]">
                    <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.approxCost}</span>
                  </div>
                </div>

                {/* Ground Truth Highlight */}
                <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F] flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Local Truth:</strong> {item.groundTruth}
                  </p>
                </div>

                {/* Watch on YouTube button + Insights drawer toggle */}
                <div className="pt-2 border-t border-[#EFE7DC] space-y-2">
                  {item.videoUrl && (
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors shadow-2xs"
                    >
                      <YouTubeIcon className="w-3.5 h-3.5 text-red-600" />
                      <span>Watch Video on YouTube</span>
                      <ExternalLink className="w-3 h-3 text-red-600 ml-0.5" />
                    </a>
                  )}

                  <button
                    onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-[#9A3412] hover:text-[#EA580C] transition-colors py-1"
                  >
                    <span>{isExpanded ? 'Hide Video Insights' : 'Watch Insights (3 Secrets)'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isExpanded && (
                    <ul className="mt-2 space-y-1.5 text-[11px] text-[#554D45] animate-in fade-in duration-150">
                      {item.videoInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className="p-8 text-center bg-[#FAF7F2] rounded-2xl border border-[#EFE7DC]">
          <p className="text-sm font-semibold text-[#554D45]">
            No video insights found matching "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="mt-3 px-4 py-1.5 rounded-xl bg-[#9A3412] text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Lightbox Modal for Full Screenshot View */}
      {activeLightbox && (
        <div
          onClick={() => setActiveLightbox(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-800"
          >
            <div className="relative aspect-video max-h-[50vh] sm:max-h-[60vh] w-full bg-black">
              <img
                src={activeLightbox.photo}
                alt={activeLightbox.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <YouTubeIcon className="w-3.5 h-3.5" />
                  <span>Real YouTube Video Frame</span>
                </span>
              </div>
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-bold hover:bg-black transition-colors"
              >
                Close ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-3 bg-[#FAF7F2]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DACB] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A3412]">
                    {activeLightbox.category} • {activeLightbox.location}
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-[#201C1A]">
                    {activeLightbox.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {activeLightbox.videoUrl && (
                    <a
                      href={activeLightbox.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <YouTubeIcon className="w-3.5 h-3.5" />
                      <span>Watch on YouTube ↗</span>
                    </a>
                  )}
                  <span className="px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-xs font-bold text-[#9A3412]">
                    {activeLightbox.channel} ({activeLightbox.creator})
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#554D45] leading-relaxed">
                <strong>Frame Scene:</strong> {activeLightbox.photoCaption}
              </p>

              <div className="p-3 rounded-2xl bg-white border border-[#E5DACB] text-xs italic text-[#201C1A]">
                "{activeLightbox.dialectQuote}"
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-[#E5DACB]">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">
                    Recommended Timing
                  </span>
                  <strong className="text-[#201C1A]">{activeLightbox.bestTime}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#E5DACB]">
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">
                    Estimated Expenditure
                  </span>
                  <strong className="text-emerald-700">{activeLightbox.approxCost}</strong>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#78350F]">
                <strong>Local Truth:</strong> {activeLightbox.groundTruth}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
