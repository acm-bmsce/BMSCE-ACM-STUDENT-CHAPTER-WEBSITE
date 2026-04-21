import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, MapPin, Trash2, Edit, X, 
  Link as LinkIcon, Loader2, ChevronLeft, ChevronRight, Star 
} from 'lucide-react';
import eventService from '../../api/eventService';
import ImageUpload from '../../components/ImageUpload';

const ManageEvents = () => {
  // --- STATE ---
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const LIMIT = 9;
  const [hasMore, setHasMore] = useState(true);

  // Track which ID we are editing (null = Create Mode)
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    title: '',
    date_str: '', 
    description: '',
    fullDescription: '',
    location: 'Online',
    attendees: 0,
    image: '',
    gallery: [], // ✅ Gallery array
    registration_link: '',
    is_featured: false
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- Lock body scroll when modal is open ---
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFormOpen]);

  // --- HELPER: Convert ISO Date to DD-MM-YYYY ---
  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // --- 1. FETCH EVENTS ---
  const fetchEvents = async (currentPage = 1) => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * LIMIT;
      const response = await eventService.getEvents(LIMIT, skip);
      const newEvents = response.data;
      
      setEvents(newEvents);
      setHasMore(newEvents.length === LIMIT);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  // --- HANDLERS ---
  const handleNextPage = () => hasMore && setPage(prev => prev + 1);
  const handlePrevPage = () => page > 1 && setPage(prev => prev - 1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // --- 2. OPEN CREATE MODAL ---
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsFormOpen(true);
  };

  // --- 3. OPEN EDIT MODAL ---
  const handleEdit = (event) => {
    const id = event.id || event._id;
    setEditingId(id);
    setFormData({
        title: event.title,
        date_str: formatDateForInput(event.date),
        description: event.description,
        fullDescription: event.fullDescription,
        location: event.location,
        attendees: event.attendees,
        image: event.image || '',
        gallery: event.gallery || [], // ✅ Load existing gallery
        registration_link: event.registration_link || '',
        is_featured: event.is_featured || false
    });
    setIsFormOpen(true);
  };

  // --- 4. SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await eventService.updateEvent(editingId, formData);
        alert("Event Updated Successfully!");
      } else {
        await eventService.createEvent(formData);
        alert("Event Created Successfully!");
      }
      setIsFormOpen(false);
      setFormData(initialFormState);
      setEditingId(null);
      fetchEvents(page);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- 5. DELETE EVENT ---
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this event?")) {
      try {
        await eventService.deleteEvent(id);
        setEvents(prev => prev.filter(event => (event.id || event._id) !== id));
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  return (
    <div className="relative min-h-screen pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 border-b border-[#1F3037] pb-6 pt-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bebas-neue text-white tracking-widest">Manage Events</h2>
          <p className="text-[#BFC7CC] text-sm mt-1">Page {page}</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="w-full sm:w-auto bg-[#2FA6B8] hover:bg-[#268A98] text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-medium shadow-[0_0_15px_rgba(47,166,184,0.3)] select-none"
        >
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {/* EVENTS GRID */}
      {loading ? (
        <div className="text-white text-center py-20 flex flex-col items-center">
             <Loader2 className="animate-spin mb-4 text-[#2FA6B8]" size={40} />
             <p>Loading Events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-gray-500 text-center py-20 border border-dashed border-[#1F3037] rounded-xl mx-4 sm:mx-0 select-none">
            {page === 1 ? 'No events found. Click "Add Event" to create one.' : 'No more events on this page.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
            <div key={event.id || event._id} className="bg-[#0E181C] border border-[#1F3037] rounded-xl p-5 hover:border-[#2FA6B8] transition-all group relative">
                
                {event.is_featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 z-10 select-none">
                        <Star size={10} fill="currentColor" /> FEATURED
                    </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#2FA6B8]/10 text-[#2FA6B8] p-2 rounded-lg">
                      <Calendar size={20} />
                  </div>
                  <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button 
                          onClick={() => handleEdit(event)}
                          className="p-2 bg-[#1F3037] sm:bg-transparent hover:bg-[#1F3037] rounded-full text-blue-400 transition-colors" 
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                          onClick={() => handleDelete(event.id || event._id)} 
                          className="p-2 bg-[#1F3037] sm:bg-transparent hover:bg-[#1F3037] rounded-full text-red-400 transition-colors" 
                      >
                        <Trash2 size={16} />
                      </button>
                  </div>
                </div>

                <h3 className="text-xl font-bebas-neue text-white tracking-wide mb-2 line-clamp-1">{event.title}</h3>
                <p className="text-[#BFC7CC] text-sm mb-4 line-clamp-2 min-h-[40px]">{event.description}</p>

                <div className="flex flex-col gap-2 text-xs text-[#BFC7CC]/70 border-t border-[#1F3037] pt-4">
                  <div className="flex items-center gap-2">
                      <span className="text-[#2FA6B8] font-bold">
                          {new Date(event.date).toLocaleDateString()}
                      </span>
                  </div>
                  <div className="flex items-center gap-2 select-none">
                      <MapPin size={14} /> {event.location}
                  </div>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-10 select-none">
        <button 
          onClick={handlePrevPage} 
          disabled={page === 1 || loading}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1F3037] text-white rounded-lg disabled:opacity-50 hover:bg-[#2FA6B8] transition-colors text-sm sm:text-base"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="text-[#BFC7CC] text-sm font-mono">Page {page}</span>
        <button 
          onClick={handleNextPage} 
          disabled={!hasMore || loading}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1F3037] text-white rounded-lg disabled:opacity-50 hover:bg-[#2FA6B8] transition-colors text-sm sm:text-base"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* --- FORM MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          ></div>

          {/* SIDEBAR PANEL */}
          <div className="relative w-full sm:max-w-xl bg-[#0E181C] border-l border-[#1F3037] h-[100dvh] flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300">
            
            {/* MODAL HEADER */}
            <div className="flex-none flex justify-between items-center p-6 border-b border-[#1F3037] bg-[#0E181C] sticky top-0 z-20 select-none">
              <h3 className="text-2xl sm:text-3xl font-bebas-neue text-white tracking-widest">
                  {editingId ? 'Edit Event' : 'Create Event'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="text-[#BFC7CC] hover:text-white transition-all p-2 rounded-full hover:bg-[#1F3037]"
                title="Close"
              >
                <X size={24} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#0E181C]">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm text-[#2FA6B8] font-medium uppercase tracking-wider select-none">Event Title</label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] focus:ring-1 focus:ring-[#2FA6B8]/50 outline-none transition-all placeholder:text-gray-700" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium flex items-center gap-2 select-none">Date (DD-MM-YYYY)</label>
                    <input 
                      name="date_str" 
                      value={formData.date_str}
                      onChange={handleInputChange} 
                      required
                      className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                      placeholder="25-12-2025"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium flex items-center gap-2 select-none">Location</label>
                    <input 
                      name="location" 
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Short Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    required
                    className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none resize-none transition-all placeholder:text-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Full Content</label>
                  <textarea 
                    name="fullDescription" 
                    value={formData.fullDescription}
                    onChange={handleInputChange}
                    rows="6"
                    required
                    className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Event/Project Image</label>
                    <ImageUpload 
                      existingImage={formData.image}
                      onUploadComplete={(url) => setFormData(prev => ({ ...prev, image: url }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium flex items-center gap-2 select-none"><LinkIcon size={14}/> Link</label>
                    <input 
                      name="registration_link" 
                      value={formData.registration_link}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>

                {/* EVENT GALLERY SECTION */}
                <div className="space-y-3 pt-4 border-t border-[#1F3037]">
                  <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Event Gallery</label>
                  
                  {/* Gallery Grid (Shows uploaded images) */}
                  {formData.gallery && formData.gallery.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      {formData.gallery.map((imgUrl, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border border-[#1F3037] aspect-video">
                          <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => setFormData(prev => ({...prev, gallery: prev.gallery.filter((_, i) => i !== index)}))}
                              className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition-colors"
                              title="Remove Image"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload New Gallery Image */}
                  <div className="w-full sm:max-w-xs">
                    <ImageUpload 
                      key={`gallery-upload-${formData.gallery?.length || 0}`}
                      existingImage=""
                      onUploadComplete={(url) => {
                        if(url) {
                          setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), url] }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* SPECIAL CONTROLS GROUP */}
                <div className="bg-black/40 border border-[#1F3037] p-5 rounded-xl space-y-5">
                  <div className="space-y-2">
                      <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Attendees</label>
                      <input 
                        type="number"
                        name="attendees" 
                        value={formData.attendees}
                        onChange={handleInputChange}
                        className="w-full sm:max-w-xs bg-black/80 border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                      />
                    </div>

                    <div className="flex items-start sm:items-center gap-4 border-t border-[#1F3037] pt-5">
                      <input 
                        type="checkbox" 
                        name="is_featured"
                        id="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="w-6 h-6 accent-[#2FA6B8] cursor-pointer mt-1 sm:mt-0 flex-shrink-0 bg-black border-[#1F3037] rounded transition-all focus:ring-offset-black"
                      />
                      <label htmlFor="is_featured" className="cursor-pointer select-none">
                        <span className="text-white text-sm sm:text-base font-medium flex items-center gap-2">
                          Feature in Carousel?
                        </span>
                        <p className="text-xs text-[#BFC7CC] mt-1 sm:mt-0.5">If checked, this event appears in the main Hero section.</p>
                      </label>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-6 pb-16">
                  <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full bg-[#2FA6B8] hover:bg-[#268A98] text-white font-bebas-neue text-2xl tracking-widest py-4 sm:py-5 rounded-xl transition-all flex justify-center items-center gap-3 disabled:opacity-50 shadow-[0_0_20px_rgba(47,166,184,0.4)] group select-none"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      editingId ? "Update Event" : "Create Event"
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;