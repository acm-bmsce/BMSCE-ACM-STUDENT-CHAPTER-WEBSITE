import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, MapPin, Users, X, Edit, Trash2, 
  Link as LinkIcon, Image as ImageIcon, Loader2, 
  ChevronLeft, ChevronRight, Star 
} from 'lucide-react';
import eventService from '../../api/eventService';
import ImageUpload from '../../components/ImageUpload'; // ✅ Import Uploader

const ManageEvents = () => {
  // --- STATE ---
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const LIMIT = 9; // Items per page
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
    registration_link: '',
    is_featured: false // ✅ New Field
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- HELPER: Convert ISO Date to DD-MM-YYYY ---
  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // --- 1. FETCH EVENTS (With Pagination) ---
  const fetchEvents = async (currentPage = 1) => {
    try {
      setLoading(true);
      // Calculate skip based on page number
      const skip = (currentPage - 1) * LIMIT;
      
      // Call service with limit and skip
      const response = await eventService.getEvents(LIMIT, skip);
      const newEvents = response.data;
      
      setEvents(newEvents);
      
      // Determine if there are more pages
      if (newEvents.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever 'page' changes
  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  // --- HANDLERS ---
  const handleNextPage = () => {
    if (hasMore) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    // ✅ Handle Checkbox Logic
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  // --- 2. OPEN CREATE MODAL ---
  const openCreateModal = () => {
    setEditingId(null); // Reset ID
    setFormData(initialFormState); // Clear form
    setIsFormOpen(true);
  };

  // --- 3. OPEN EDIT MODAL ---
  const handleEdit = (event) => {
    const id = event.id || event._id;
    setEditingId(id); // Set ID

    // Populate form with existing data
    setFormData({
        title: event.title,
        date_str: formatDateForInput(event.date),
        description: event.description,
        fullDescription: event.fullDescription,
        location: event.location,
        attendees: event.attendees,
        image: event.image || '',
        registration_link: event.registration_link || '',
        is_featured: event.is_featured || false // ✅ Load featured state
    });
    
    setIsFormOpen(true);
  };

  // --- 4. SUBMIT (CREATE OR UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        // UPDATE MODE
        await eventService.updateEvent(editingId, formData);
        alert("Event Updated Successfully!");
      } else {
        // CREATE MODE
        await eventService.createEvent(formData);
        alert("Event Created Successfully!");
      }
      
      setIsFormOpen(false);
      setFormData(initialFormState);
      setEditingId(null);
      fetchEvents(page); // Refresh current page
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
        // Remove from UI immediately
        setEvents(prev => prev.filter(event => (event.id || event._id) !== id));
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event.");
      }
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 border-b border-[#1F3037] pb-6">
        <div>
          <h2 className="text-4xl font-bebas-neue text-white tracking-widest">Manage Events</h2>
          <p className="text-[#BFC7CC] text-sm mt-1">Page {page}</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-[#2FA6B8] hover:bg-[#268A98] text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all font-medium shadow-[0_0_15px_rgba(47,166,184,0.3)]"
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
        <div className="text-gray-500 text-center py-20 border border-dashed border-[#1F3037] rounded-xl">
            {page === 1 ? 'No events found. Click "Add Event" to create one.' : 'No more events on this page.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
            <div key={event.id || event._id} className="bg-[#0E181C] border border-[#1F3037] rounded-xl p-5 hover:border-[#2FA6B8] transition-all group relative">
                
                {/* Featured Badge */}
                {event.is_featured && (
                    <div className="absolute top-4 right-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 z-10">
                        <Star size={10} fill="currentColor" /> FEATURED
                    </div>
                )}

                <div className="flex justify-between items-start mb-4">
                <div className="bg-[#2FA6B8]/10 text-[#2FA6B8] p-2 rounded-lg">
                    <Calendar size={20} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* EDIT BUTTON */}
                    <button 
                        onClick={() => handleEdit(event)}
                        className="p-2 hover:bg-[#1F3037] rounded-full text-blue-400 transition-colors" 
                        title="Edit"
                    >
                       <Edit size={16} />
                    </button>
                    {/* DELETE BUTTON */}
                    <button 
                        onClick={() => handleDelete(event.id || event._id)} 
                        className="p-2 hover:bg-[#1F3037] rounded-full text-red-400 transition-colors" 
                        title="Delete"
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
                <div className="flex items-center gap-2">
                    <MapPin size={14} /> {event.location}
                </div>
                </div>
            </div>
            ))}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button 
          onClick={handlePrevPage} 
          disabled={page === 1 || loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#1F3037] text-white rounded-lg disabled:opacity-50 hover:bg-[#2FA6B8] transition-colors"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        
        <span className="text-[#BFC7CC] text-sm font-mono">Page {page}</span>
        
        <button 
          onClick={handleNextPage} 
          disabled={!hasMore || loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#1F3037] text-white rounded-lg disabled:opacity-50 hover:bg-[#2FA6B8] transition-colors"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          ></div>

          <div className="relative w-full max-w-xl bg-[#0E181C] border-l border-[#1F3037] h-full overflow-y-auto p-8 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bebas-neue text-white tracking-widest">
                  {editingId ? 'Edit Event' : 'Create Event'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-[#BFC7CC] hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pb-10">
              
              <div className="space-y-2">
                <label className="text-sm text-[#2FA6B8] font-medium uppercase tracking-wider">Event Title</label>
                <input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#BFC7CC] font-medium">Date (DD-MM-YYYY)</label>
                  <input 
                    name="date_str" 
                    value={formData.date_str}
                    onChange={handleInputChange} 
                    required
                    className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none"
                    placeholder="25-12-2025"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#BFC7CC] font-medium">Location</label>
                  <input 
                    name="location" 
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#BFC7CC] font-medium">Short Description</label>
                <textarea 
                  name="description" 
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  required
                  className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#BFC7CC] font-medium">Full Content</label>
                <textarea 
                  name="fullDescription" 
                  value={formData.fullDescription}
                  onChange={handleInputChange}
                  rows="6"
                  required
                  className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  {/* ✅ Replaced Text Input with ImageUpload Component */}
                  <ImageUpload 
                    existingImage={formData.image}
                    onUploadComplete={(url) => setFormData(prev => ({ ...prev, image: url }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#BFC7CC] font-medium flex items-center gap-2"><LinkIcon size={14}/> Link</label>
                  <input 
                    name="registration_link" 
                    value={formData.registration_link}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none"
                  />
                </div>
              </div>

               <div className="space-y-2">
                  <label className="text-sm text-[#BFC7CC] font-medium">Attendees</label>
                  <input 
                    type="number"
                    name="attendees" 
                    value={formData.attendees}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-[#1F3037] rounded-lg p-3 text-white focus:border-[#2FA6B8] outline-none"
                  />
                </div>

                {/* ✅ ADDED: Feature Toggle Checkbox */}
                <div className="flex items-center gap-3 bg-black border border-[#1F3037] p-3 rounded-lg hover:border-[#2FA6B8] transition-colors">
                <input 
                  type="checkbox" 
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-[#2FA6B8] cursor-pointer"
                />
                <div>
                  <label className="text-white font-medium block">Feature in Carousel?</label>
                  <p className="text-xs text-[#BFC7CC]">If checked, this event will appear in the main Hero section.</p>
                </div>
              </div>

              <div className="pt-6">
                <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-[#2FA6B8] hover:bg-[#268A98] text-white font-bebas-neue text-xl tracking-widest py-4 rounded-lg transition-all flex justify-center items-center gap-3 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : (editingId ? "Update Event" : "Create Event")}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageEvents;