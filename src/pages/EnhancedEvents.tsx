import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Filter, Search, Plus, Star, Eye, ChevronRight, Image, Play, Award } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { EventRegistrationModal } from '../components/EventRegistrationModal';
import { EventIdeaModal } from '../components/EventIdeaModal';
import { EventDetailsModal } from '../components/EventDetailsModal';
import EventCountdown from '../components/EventCountdown';

interface Event {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  venue?: {
    name: string;
    address: string;
    city: string;
  };
  type: string;
  category: string;
  capacity: number;
  registeredCount: number;
  isVirtual: boolean;
  meetingLink?: string;
  images: Array<{
    url: string;
    caption: string;
    isPrimary: boolean;
  }>;
  gallery: Array<{
    url: string;
    caption: string;
    uploadedAt: string;
  }>;
  organizer: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
  };
  speakers: Array<{
    name: string;
    title: string;
    bio: string;
    image?: string;
    linkedin?: string;
  }>;
  agenda: Array<{
    time: string;
    title: string;
    description: string;
    speaker: string;
    duration: number;
  }>;
  requirements: string[];
  benefits: string[];
  tags: string[];
  registrationFee: {
    amount: number;
    currency: string;
  };
  registrationDeadline: string;
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  visibility: string;
  feedback: Array<{
    user: {
      firstName: string;
      lastName: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  averageRating: number;
  totalFeedback: number;
  isPast: boolean;
  isRegistrationOpen: boolean;
  spotsRemaining: number;
  createdAt: string;
}

const EnhancedEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, filter, typeFilter, searchTerm]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by time (upcoming/past)
    if (filter === 'upcoming') {
      filtered = filtered.filter(event => !event.isPast);
    } else if (filter === 'past') {
      filtered = filtered.filter(event => event.isPast);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type.toLowerCase() === typeFilter.toLowerCase());
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredEvents(filtered);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleRegisterClick = (event: Event) => {
    if (!user) {
      alert('Please login to register for events');
      return;
    }
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleGalleryClick = (event: Event) => {
    if (event.gallery && event.gallery.length > 0) {
      setSelectedGalleryImages(event.gallery.map(img => img.url));
      setCurrentImageIndex(0);
      setShowGalleryModal(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventImage = (event: Event) => {
    const primaryImage = event.images?.find(img => img.isPrimary);
    if (primaryImage) return primaryImage.url;
    if (event.images?.length > 0) return event.images[0].url;
    return 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  };

  const upcomingEvents = events.filter(event => !event.isPast).slice(0, 3);
  const featuredPastEvents = events.filter(event => event.isPast && event.averageRating >= 4).slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-800"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-green-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Alumni Events & Reunions</h1>
            <p className="text-xl mb-8">Connect, learn, and grow with fellow Namal alumni through our exciting events and reunions.</p>
            <div className="flex flex-wrap gap-4">
              {user && (
                <button
                  onClick={() => setShowIdeaModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-md transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Suggest an Event
                </button>
              )}
              <button
                onClick={() => document.getElementById('upcoming-events')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-green-900 font-bold rounded-md transition-colors"
              >
                View Upcoming Events
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Countdown Section */}
      {upcomingEvents.length > 0 && (
        <section id="upcoming-events" className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-4">Upcoming Events</h2>
              <p className="text-xl text-gray-600">Don't miss these exciting opportunities to connect</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCountdown 
                  key={event._id} 
                  title={event.title} 
                  date={event.date}
                  location={event.location}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Events Highlights */}
      {featuredPastEvents.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-4">Event Highlights</h2>
              <p className="text-xl text-gray-600">Relive the memories from our successful events</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPastEvents.map(event => (
                <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img 
                      src={getEventImage(event)} 
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
                        <button 
                          onClick={() => handleEventClick(event)}
                          className="p-2 bg-white rounded-full text-green-800 hover:bg-green-100 transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {event.gallery && event.gallery.length > 0 && (
                          <button 
                            onClick={() => handleGalleryClick(event)}
                            className="p-2 bg-white rounded-full text-green-800 hover:bg-green-100 transition-colors"
                          >
                            <Image className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm font-medium">{event.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-green-800 mb-2 line-clamp-2">{event.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{event.registeredCount} attendees</span>
                      <div className="flex items-center text-yellow-600">
                        <Award className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Featured</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events by title, description, or location"
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center flex-wrap gap-3">
              <Filter className="h-5 w-5 text-green-800" />
              
              {/* Time Filter */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilter('upcoming')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filter === 'upcoming' 
                      ? 'bg-green-800 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Upcoming
                </button>
                <button 
                  onClick={() => setFilter('past')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filter === 'past' 
                      ? 'bg-green-800 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Past Events
                </button>
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filter === 'all' 
                      ? 'bg-green-800 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  All Events
                </button>
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Types</option>
                <option value="reunion">Reunion</option>
                <option value="networking">Networking</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="social">Social</option>
                <option value="career">Career</option>
                <option value="conference">Conference</option>
                <option value="webinar">Webinar</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or check back later for new events.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={getEventImage(event)} 
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.type === 'Reunion' ? 'bg-purple-100 text-purple-800' :
                        event.type === 'Networking' ? 'bg-blue-100 text-blue-800' :
                        event.type === 'Workshop' ? 'bg-green-100 text-green-800' :
                        event.type === 'Seminar' ? 'bg-yellow-100 text-yellow-800' :
                        event.type === 'Social' ? 'bg-pink-100 text-pink-800' :
                        event.type === 'Career' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    {event.isPast && event.averageRating > 0 && (
                      <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">{event.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                    {event.gallery && event.gallery.length > 0 && (
                      <button 
                        onClick={() => handleGalleryClick(event)}
                        className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <Image className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.shortDescription || event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.isVirtual ? 'Virtual Event' : event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {event.registeredCount}/{event.capacity} registered
                        </span>
                      </div>
                    </div>

                    {event.registrationFee.amount > 0 && (
                      <div className="mb-4">
                        <span className="text-lg font-semibold text-green-700">
                          {event.registrationFee.currency} {event.registrationFee.amount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => handleEventClick(event)}
                        className="flex items-center text-green-800 hover:text-green-700 font-semibold"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                      
                      {!event.isPast && event.isRegistrationOpen && (
                        <button 
                          onClick={() => handleRegisterClick(event)}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-md transition-colors"
                        >
                          Register
                        </button>
                      )}
                      
                      {!event.isPast && !event.isRegistrationOpen && (
                        <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-sm">
                          Registration Closed
                        </span>
                      )}
                      
                      {event.isPast && (
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Modal */}
      {showGalleryModal && selectedGalleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full">
            <button 
              onClick={() => setShowGalleryModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-10"
            >
              <X className="h-6 w-6" />
            </button>
            
            <img 
              src={selectedGalleryImages[currentImageIndex]} 
              alt="Event gallery"
              className="max-w-full max-h-full object-contain"
            />
            
            {selectedGalleryImages.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : selectedGalleryImages.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                >
                  ←
                </button>
                <button 
                  onClick={() => setCurrentImageIndex((prev) => prev < selectedGalleryImages.length - 1 ? prev + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                >
                  →
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 rounded-full px-3 py-1">
                  {currentImageIndex + 1} / {selectedGalleryImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Event Registration Modal */}
      <EventRegistrationModal 
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        event={selectedEvent}
      />

      {/* Event Idea Modal */}
      <EventIdeaModal 
        isOpen={showIdeaModal}
        onClose={() => setShowIdeaModal(false)}
      />

      {/* Event Details Modal */}
      <EventDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        event={selectedEvent}
        onRegister={() => {
          setShowDetailsModal(false);
          setShowRegistrationModal(true);
        }}
      />
    </div>
  );
};

export default EnhancedEvents;