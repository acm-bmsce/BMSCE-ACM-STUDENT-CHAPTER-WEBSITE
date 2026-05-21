import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, MapPin, Trash2, Edit, X, 
  Link as LinkIcon, Loader2, ChevronLeft, ChevronRight, Star, Download 
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
    gallery: [], 
    registration_link: '',
    is_featured: false,
    // ✅ REGISTRATION CONTROLS
    registration_open: true, 
    registration_limit: 0, // 0 means unlimited
    is_team_event: false // ✅ NEW: Team Event Toggle
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- Lock body scroll when modal is open ---
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
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
        gallery: event.gallery || [],
        registration_link: event.registration_link || '',
        is_featured: event.is_featured || false,
        // ✅ LOAD NEW FIELDS
        registration_open: event.registration_open !== false, 
        registration_limit: event.registration_limit || 0,
        is_team_event: event.is_team_event || false // ✅ Load Team Status
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

  const handleExportCSV = async (eventId, eventTitle) => {
    try {
      const response = await eventService.getEventRegistrations(eventId);
      const registrations = response.data;

      if (!registrations || registrations.length === 0) {
        alert("No registrations found for this event yet.");
        return;
      }

      // ✅ Reverted back to flat structure, but including Team data
      const cleanData = registrations.map(reg => ({
        "Registration Type": reg.is_team_event ? "Team" : "Individual",
        "Team Name": reg.is_team_event ? (reg.team_name || "N/A") : "N/A",
        "Captain/Name": reg.name,
        "Email": reg.email,
        "Phone": reg.phone,
        "USN": reg.usn,
        "Department": reg.department,
        "Registration Date": new Date(reg.registered_at).toLocaleString()
      }));

      const headers = Object.keys(cleanData[0]).join(",");
      const rows = cleanData.map(row => 
        Object.values(row).map(val => `"${val || ''}"`).join(",") 
      ).join("\n");
      const csvContent = `${headers}\n${rows}`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${eventTitle.replace(/\s+/g, '_')}_Registrations.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export registrations.");
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
                {/* Visual indicator if registration is closed */}
                {event.registration_open === false && (
                    <div className="absolute top-4 left-4 bg-red-500/10 text-red-500 border border-red-500/30 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 z-10 select-none">
                        CLOSED
                    </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[#2FA6B8]/10 text-[#2FA6B8] p-2 rounded-lg mt-6">
                      <Calendar size={20} />
                  </div>
                  <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-black/50 p-1 rounded-full border border-[#1F3037]">
                      {/* ✅ CSV EXPORT BUTTON */}
                      <button 
                          onClick={() => handleExportCSV(event.id || event._id, event.title)}
                          className="p-2 hover:bg-[#1F3037] rounded-full text-green-400 transition-colors" 
                          title="Download Registrations CSV"
                      >
                        <Download size={14} />
                      </button>
                      <button 
                          onClick={() => handleEdit(event)}
                          className="p-2 hover:bg-[#1F3037] rounded-full text-blue-400 transition-colors" 
                          title="Edit Event"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                          onClick={() => handleDelete(event.id || event._id)} 
                          className="p-2 hover:bg-[#1F3037] rounded-full text-red-400 transition-colors" 
                          title="Delete Event"
                      >
                        <Trash2 size={14} />
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
                  {/* ✅ Badge to show if it is a team event */}
                  {event.is_team_event && (
                    <div className="flex items-center gap-2 select-none text-purple-400 font-bold">
                      Team Event
                    </div>
                  )}
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
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          ></div>

          <div className="relative w-full sm:max-w-xl bg-[#0E181C] border-l border-[#1F3037] h-[100dvh] flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300">
            
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

                <div className="space-y-3 pt-4 border-t border-[#1F3037]">
                  <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Event Gallery</label>
                  
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
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

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

                {/* ✅ REGISTRATION CONTROLS */}
                <div className="bg-[#111C21] border border-[#1F3037] p-5 rounded-xl space-y-5">
                  <h4 className="text-[#2FA6B8] text-xs font-bold uppercase tracking-widest border-b border-[#1F3037] pb-3 mb-4">Registration Settings</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Capacity Limit</label>
                        <input 
                          type="number"
                          name="registration_limit" 
                          value={formData.registration_limit}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">Set to 0 for unlimited registrations.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Expected Attendees</label>
                        <input 
                          type="number"
                          name="attendees" 
                          value={formData.attendees}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                        />
                      </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-[#1F3037] pt-5">
                    
                    {/* ✅ TEAM EVENT TOGGLE */}
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        name="is_team_event"
                        id="is_team_event"
                        checked={formData.is_team_event}
                        onChange={handleInputChange}
                        className="w-5 h-5 accent-[#2FA6B8] cursor-pointer bg-black border-[#1F3037] rounded"
                      />
                      <label htmlFor="is_team_event" className="cursor-pointer select-none">
                        <span className="text-white text-sm font-medium">Is this a Team Event?</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        name="registration_open"
                        id="registration_open"
                        checked={formData.registration_open}
                        onChange={handleInputChange}
                        className="w-5 h-5 accent-[#2FA6B8] cursor-pointer bg-black border-[#1F3037] rounded"
                      />
                      <label htmlFor="registration_open" className="cursor-pointer select-none">
                        <span className="text-white text-sm font-medium">Registrations Open?</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        name="is_featured"
                        id="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="w-5 h-5 accent-[#2FA6B8] cursor-pointer bg-black border-[#1F3037] rounded"
                      />
                      <label htmlFor="is_featured" className="cursor-pointer select-none">
                        <span className="text-white text-sm font-medium">Feature in Carousel?</span>
                      </label>
                    </div>

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