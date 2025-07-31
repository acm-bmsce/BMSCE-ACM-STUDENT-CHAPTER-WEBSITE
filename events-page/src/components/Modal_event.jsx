import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Image as ImageIcon, FileText } from 'lucide-react';

export const EventModal = ({ event, onClose }) => {
  const [activeTab, setActiveTab] = useState('description');

  // Block body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-event-card border border-event-card-border rounded-xl shadow-elevated 
                   w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 
                       text-white p-2 rounded-full transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/90 text-primary-foreground px-3 py-1 
                              rounded-full text-sm font-medium">
                {event.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{event.attendees} attendees</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-event-card-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 
                         border-b-2 ${
                           activeTab === 'description'
                             ? 'border-primary text-primary'
                             : 'border-transparent text-muted-foreground hover:text-foreground'
                         }`}
            >
              <FileText className="h-4 w-4" />
              Description
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 
                         border-b-2 ${
                           activeTab === 'gallery'
                             ? 'border-primary text-primary'
                             : 'border-transparent text-muted-foreground hover:text-foreground'
                         }`}
            >
              <ImageIcon className="h-4 w-4" />
              Gallery ({event.gallery.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'description' ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">About this event</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.fullDescription}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-event-stats p-4 rounded-lg border border-event-card-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Date</span>
                    </div>
                    <p className="text-muted-foreground">{formatDate(event.date)}</p>
                  </div>

                  <div className="bg-event-stats p-4 rounded-lg border border-event-card-border">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Location</span>
                    </div>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>

                  <div className="bg-event-stats p-4 rounded-lg border border-event-card-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Attendees</span>
                    </div>
                    <p className="text-muted-foreground">{event.attendees} people</p>
                  </div>

                  <div className="bg-event-stats p-4 rounded-lg border border-event-card-border">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">Category</span>
                    </div>
                    <p className="text-muted-foreground">{event.category}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Event Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.gallery.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`${event.title} - Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 
                                 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 
                                   transition-colors duration-300 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
