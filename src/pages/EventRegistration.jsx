import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, CheckCircle, ChevronDown, AlertTriangle } from 'lucide-react';
import eventService from '../api/eventService'; 

const departments = [
  "Computer Science and Engineering", "Computer Science and Engineering (DS)", "Computer Science and Business Systems",
  "Computer Science and Engineering (IoT and CS)", "Artificial Intelligence and Data Science", "Machine Learning (AIML)",
  "Civil Engineering", "Mechanical Engineering", "Electrical and Electronics Engineering", "Electronics and Communication Engineering",
  "Industrial Engineering and Management", "Electronics and Telecommunication Engineering", "Information Science and Engineering",
  "Electronics and Instrumentation Engineering", "Medical Electronics Engineering", "Chemical Engineering", "Bio-Technology",
  "Aerospace Engineering", "Other"
];

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [eventData, setEventData] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventError, setEventError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    usn: '',
    department: '',
    team_name: '', // Captures Team Name if applicable
    is_team_event: false 
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await eventService.getEvent(eventId);
        const event = res.data;
        setEventData(event);
        
        // Let the form data know if it's a team event so it gets sent to the backend
        setFormData(prev => ({
          ...prev,
          is_team_event: event.is_team_event || false
        }));

      } catch (err) {
        setEventError("Could not load event details. It may have been deleted.");
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    
    try {
      await eventService.registerForEvent(eventId, formData);
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDERS ---

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-[#0E181C] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#2FA6B8] mb-4" size={48} />
        <p className="text-[#BFC7CC] font-bebas-neue text-xl tracking-widest">Loading Event Protocols...</p>
      </div>
    );
  }

  if (eventError || !eventData) {
    return (
      <div className="min-h-screen bg-[#0E181C] flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h2 className="text-3xl font-bebas-neue text-white tracking-widest mb-4">Event Not Found</h2>
        <p className="text-[#BFC7CC] mb-8">{eventError}</p>
        <button onClick={() => navigate('/event')} className="bg-[#2FA6B8] text-white px-6 py-2 rounded-lg font-bold uppercase text-xs tracking-widest">Return to Events</button>
      </div>
    );
  }

  if (eventData.registration_open === false) {
    return (
      <div className="min-h-screen bg-[#0E181C] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl max-w-md w-full">
            <h2 className="text-4xl font-bebas-neue text-red-500 tracking-widest mb-4">Registrations Closed</h2>
            <p className="text-[#BFC7CC] text-sm">We are no longer accepting registrations for <strong className="text-white">{eventData.title}</strong>. If you believe this is an error, please contact the organizers.</p>
            <button onClick={() => navigate('/event')} className="mt-8 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold uppercase text-xs tracking-widest w-full transition-colors border border-white/10">Return to Events</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0E181C] flex flex-col items-center justify-center p-6">
        <CheckCircle size={64} className="text-[#2FA6B8] mb-6 animate-bounce" />
        <h2 className="text-4xl font-bebas-neue text-white tracking-widest mb-4">Registration Complete!</h2>
        <p className="text-[#BFC7CC] mb-8 text-center max-w-md">
          You have successfully registered for <strong>{eventData.title}</strong>. Keep an eye on your email for further instructions.
        </p>
        <button onClick={() => navigate('/event')} className="bg-[#2FA6B8] hover:bg-[#268A98] text-white px-8 py-3 rounded-lg font-bebas-neue text-xl tracking-widest transition-all">Return to Events</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E181C] pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-2xl">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#BFC7CC] hover:text-[#2FA6B8] mb-8 transition-colors">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="bg-black/40 border border-[#1F3037] p-8 sm:p-10 rounded-2xl shadow-2xl">
          <div className="mb-8 border-b border-[#1F3037] pb-6">
             <h2 className="text-4xl font-bebas-neue text-white tracking-widest mb-2">{eventData.title}</h2>
             <p className="text-[#BFC7CC] text-sm">
                {eventData.is_team_event ? `Team Registration` : "Individual Registration"}
             </p>
          </div>

          {submitError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ✅ CONDITIONAL TEAM NAME INPUT */}
            {eventData.is_team_event && (
                <div className="space-y-2 bg-[#111C21] p-6 rounded-xl border border-[#2FA6B8]/30 mb-8">
                    <label className="text-sm text-[#2FA6B8] font-bold uppercase tracking-wider select-none">Team Name</label>
                    <input 
                        name="team_name" 
                        value={formData.team_name} 
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-[#1F3037] rounded-lg p-4 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                        placeholder="e.g., The Cyberpunks"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                {/* ✅ DYNAMIC LABEL */}
                <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">
                  {eventData.is_team_event ? "Team Captain Name" : "Full Name"}
                </label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-[#1F3037] rounded-lg p-4 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Email Address</label>
                <input 
                  type="email"
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-[#1F3037] rounded-lg p-4 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Phone Number</label>
                <input 
                  type="tel"
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-[#1F3037] rounded-lg p-4 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">College ID / USN</label>
                <input 
                  name="usn" 
                  value={formData.usn} 
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-[#1F3037] rounded-lg p-4 text-white focus:border-[#2FA6B8] outline-none transition-all placeholder:text-gray-700"
                  placeholder="e.g., 1BM22CS001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-[#BFC7CC] uppercase tracking-wider font-medium select-none">Department</label>
              <div className="relative">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black border border-[#1F3037] rounded-lg p-4 text-white focus:border-[#2FA6B8] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled hidden>Select your department</option>
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept} className="bg-[#0E181C] text-white py-2">
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#2FA6B8]">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1F3037]">
              <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-[#2FA6B8] hover:bg-[#268A98] text-white font-bebas-neue text-2xl tracking-widest py-4 rounded-xl transition-all flex justify-center items-center gap-3 disabled:opacity-50 shadow-[0_0_20px_rgba(47,166,184,0.4)] select-none"
              >
                {submitting ? <Loader2 className="animate-spin" /> : "Confirm Registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;