import { useState } from "react"
import { Plus } from "lucide-react"

export function InsightCard({ id, title, description, image, size = "medium" }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const sizeClasses = {
    small: "col-span-1",
    medium: "col-span-1",
    large: "col-span-2",
  }

  const openDialog = (e) => {
    e.preventDefault() // prevent navigation
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <a href={`/insight/${id}`} onClick={openDialog}>
        <div
          className={`relative group rounded-2xl p-8 min-h-80 flex flex-col justify-between transition-all duration-500 hover:shadow-xl cursor-pointer overflow-hidden border border-white/10 ${sizeClasses[size]}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

          {/* Plus Button */}
          <div
            className="absolute top-6 right-6 transition-all duration-500"
            onClick={(e) => {
              e.stopPropagation()
              openDialog(e)
            }}
          >
            <div className="border border-white/40 rounded-full w-10 h-10 flex items-center justify-center group-hover:border-white/80 group-hover:bg-white/10 transition-all duration-500">
              <Plus size={20} className="text-white/60 group-hover:text-white" />
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-bold bebas-neue tracking-wider text-white group-hover:text-white/95 transition-all duration-300 mb-4">
              {title}
            </h3>

            <div className="flex items-center gap-4 mb-6">
              {image && (
                <div
                  className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white/40 transition-all duration-500 flex-shrink-0 cursor-pointer"
                  onClick={openDialog} // <--- image click triggers dialog
                >
                  <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs md:text-sm opacity-70 group-hover:opacity-90 transition-opacity duration-300">
                {description}
              </p>
            </div>
          </div>

          {image && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 rounded-2xl transition-opacity duration-500 cursor-pointer"
              style={{ backgroundImage: `url(${image})` }}
              onClick={openDialog} // <--- background image click triggers dialog
            />
          )}
        </div>
      </a>

      {/* Simple Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-2xl max-w-md w-full relative">
            <button
              className="absolute top-4 right-4 text-black text-xl"
              onClick={closeDialog}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p>{description}</p>
            {image && <img src={image} alt={title} className="mt-4 rounded" />}
          </div>
        </div>
      )}
    </>
  )
}