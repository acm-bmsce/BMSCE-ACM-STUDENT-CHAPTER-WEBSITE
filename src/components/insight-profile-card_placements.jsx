import { Plus, ArrowRight, X } from "lucide-react"
import { useState } from "react"

export function InsightProfileCard({ image, name, job, company, link, year, description }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePlusClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDialogOpen(true)
  }

  return (
    <>
      {/* Main Card - no hover info now */}
      <div className="group flex flex-col items-center text-center">
        {/* Circular Image Container */}
        <div className="relative mb-6">
          <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-white/20 transition-all duration-300 cursor-pointer">
            <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
          </div>

          {/* Plus Icon in Corner - Click to open dialog */}
          <button
            onClick={handlePlusClick}
            className="absolute bottom-0 right-0 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg hover:scale-110 cursor-pointer"
            aria-label="View details"
          >
            <Plus size={24} className="text-black" strokeWidth={3} />
          </button>
        </div>

        {/* Person Info */}
        <h3 className="text-xl font-bold text-white bebas-neue tracking-widest mb-3">{name}</h3>
        <p className="text-base text-white/60 mb-1">{job}</p>
        <p className="text-sm text-white/50">{company}</p>
      </div>

      {isDialogOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsDialogOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-black to-gray-900 rounded-2xl border border-blue-400/30 w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section with Close Button - Centered Profile title */}
            <div className="flex justify-center items-center relative p-6 border-b border-blue-400/20">
              <h2 className="text-xl font-bold text-white bebas-neue tracking-widest mb-3">Profile</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="absolute right-6 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-white/60 hover:text-white" />
              </button>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="p-8 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Image */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-blue-400/50 mb-4 shadow-lg">
                    <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
                  </div>
                  {year && (
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-1">Year</p>
                      <p className="text-sm text-white/80 font-medium">{year}</p>
                    </div>
                  )}
                </div>

                {/* Right Column - Info */}
                <div className="md:col-span-2 flex flex-col justify-between">
                  {/* Name and Title */}
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-white mb-3 leading-tight">{name}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-lg font-semibold text-blue-400">{job}</p>
                      <p className="text-sm text-white/60">{company}</p>
                    </div>
                    {description && (
                      <p className="text-sm text-white/70 leading-relaxed mt-4 pt-4 border-t border-blue-400/20">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-none transition-all duration-300 flex items-center justify-center gap-2 group/button shadow-lg hover:shadow-blue-500/20 border-t border-blue-400/20"
            >
              See More
              <ArrowRight size={18} className="group-hover/button:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      )}
    </>
  )
}