import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Filter, Search, Plus, Star, Eye, ChevronRight } from 'lucide-react';
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

const Events = () => {
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
  const [nextEventCountdown, setNextEventCountdown] = useState('');

  // Sample upcoming events data
  const sampleEvents: Event[] = [
    {
      _id: '1',
      title: 'Annual Alumni Reunion 2025',
      description: 'Join us for our biggest alumni gathering of the year! Reconnect with classmates, network with professionals, and celebrate our shared Namal experience.',
      shortDescription: 'The biggest alumni gathering of the year with networking and celebrations.',
      date: '2025-06-15',
      startTime: '10:00',
      endTime: '18:00',
      duration: 480,
      location: 'Namal University Campus, Mianwali',
      venue: {
        name: 'Main Auditorium',
        address: '30 km Talagang Road',
        city: 'Mianwali'
      },
      type: 'Reunion',
      category: 'Social',
      capacity: 500,
      registeredCount: 287,
      isVirtual: false,
      images: [{
        url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        caption: 'Alumni Reunion',
        isPrimary: true
      }],
      gallery: [],
      organizer: {
        name: 'Alumni Relations Office',
        email: 'alumni@namal.edu.pk',
        organization: 'Namal University'
      },
      speakers: [],
      agenda: [],
      requirements: [],
      benefits: ['Networking opportunities', 'Campus tour', 'Dinner included'],
      tags: ['reunion', 'networking', 'campus'],
      registrationFee: { amount: 2000, currency: 'PKR' },
      registrationDeadline: '2025-06-10',
      createdBy: { firstName: 'Admin', lastName: 'User', email: 'admin@namal.edu.pk' },
      status: 'Published',
      visibility: 'Public',
      feedback: [],
      averageRating: 0,
      totalFeedback: 0,
      isPast: false,
      isRegistrationOpen: true,
      spotsRemaining: 213,
      createdAt: '2025-01-15'
    },
    {
      _id: '2',
      title: 'Tech Career Workshop',
      description: 'Learn about the latest trends in technology careers, get insights from industry experts, and discover new opportunities in the tech sector.',
      shortDescription: 'Industry insights and career guidance for tech professionals.',
      date: '2025-02-20',
      startTime: '14:00',
      endTime: '17:00',
      duration: 180,
      location: 'Virtual Event',
      type: 'Workshop',
      category: 'Professional',
      capacity: 200,
      registeredCount: 156,
      isVirtual: true,
      meetingLink: 'https://zoom.us/j/123456789',
      images: [{
        url: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        caption: 'Tech Workshop',
        isPrimary: true
      }],
      gallery: [],
      organizer: {
        name: 'Tech Alumni Chapter',
        email: 'tech@namal.edu.pk'
      },
      speakers: [],
      agenda: [],
      requirements: [],
      benefits: ['Industry insights', 'Networking', 'Career guidance'],
      tags: ['technology', 'career', 'workshop'],
      registrationFee: { amount: 0, currency: 'PKR' },
      registrationDeadline: '2025-02-18',
      createdBy: { firstName: 'Tech', lastName: 'Chapter', email: 'tech@namal.edu.pk' },
      status: 'Published',
      visibility: 'Public',
      feedback: [],
      averageRating: 0,
      totalFeedback: 0,
      isPast: false,
      isRegistrationOpen: true,
      spotsRemaining: 44,
      createdAt: '2025-01-10'
    },
    {
      _id: '3',
      title: 'Entrepreneurship Summit',
      description: 'Connect with successful alumni entrepreneurs, learn about startup strategies, and explore funding opportunities.',
      shortDescription: 'Learn from successful entrepreneurs and explore startup opportunities.',
      date: '2025-03-10',
      startTime: '09:00',
      endTime: '16:00',
      duration: 420,
      location: 'Lahore Business Center',
      venue: {
        name: 'Conference Hall A',
        address: 'MM Alam Road',
        city: 'Lahore'
      },
      type: 'Conference',
      category: 'Business',
      capacity: 150,
      registeredCount: 89,
      isVirtual: false,
      images: [{
        url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        caption: 'Entrepreneurship Summit',
        isPrimary: true
      }],
      gallery: [],
      organizer: {
        name: 'Business Alumni Network',
        email: 'business@namal.edu.pk'
      },
      speakers: [],
      agenda: [],
      requirements: [],
      benefits: ['Startup insights', 'Funding opportunities', 'Mentorship'],
      tags: ['entrepreneurship', 'business', 'startup'],
      registrationFee: { amount: 3500, currency: 'PKR' },
      registrationDeadline: '2025-03-05',
      createdBy: { firstName: 'Business', lastName: 'Network', email: 'business@namal.edu.pk' },
      status: 'Published',
      visibility: 'Public',
      feedback: [],
      averageRating: 0,
      totalFeedback: 0,
      isPast: false,
      isRegistrationOpen: true,
      spotsRemaining: 61,
      createdAt: '2025-01-05'
    },
    {
      _id: '4',
      title: 'Global Alumni Networking Night',
      description: 'An exclusive evening for alumni to network, share experiences, and build lasting professional relationships.',
      shortDescription: 'Exclusive networking evening for professional relationship building.',
      date: '2025-04-05',
      startTime: '19:00',
      endTime: '22:00',
      duration: 180,
      location: 'Pearl Continental Hotel, Karachi',
      venue: {
        name: 'Grand Ballroom',
        address: 'Club Road',
        city: 'Karachi'
      },
      type: 'Networking',
      category: 'Social',
      capacity: 100,
      registeredCount: 67,
      isVirtual: false,
      images: [{
        url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        caption: 'Networking Event',
        isPrimary: true
      }],
      gallery: [],
      organizer: {
        name: 'Karachi Alumni Chapter',
        email: 'karachi@namal.edu.pk'
      },
      speakers: [],
      agenda: [],
      requirements: [],
      benefits: ['Professional networking', 'Dinner included', 'Industry connections'],
      tags: ['networking', 'professional', 'social'],
      registrationFee: { amount: 4000, currency: 'PKR' },
      registrationDeadline: '2025-04-01',
      createdBy: { firstName: 'Karachi', lastName: 'Chapter', email: 'karachi@namal.edu.pk' },
      status: 'Published',
      visibility: 'Public',
      feedback: [],
      averageRating: 0,
      totalFeedback: 0,
      isPast: false,
      isRegistrationOpen: true,
      spotsRemaining: 33,
      createdAt: '2025-01-01'
    }
  ];

  useEffect(() => {
    // Use sample data instead of API call
    setEvents(sampleEvents);
    setLoading(false);
  }, []);

  useEffect(() => {
    filterEvents();
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [events, filter, typeFilter, searchTerm]);

  const updateCountdown = () => {
    const upcomingEvents = events.filter(event => !event.isPast).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (upcomingEvents.length > 0) {
      const nextEvent = upcomingEvents[0];
      const eventDate = new Date(`${nextEvent.date} ${nextEvent.startTime}`);
      const now = new Date();
      const timeDiff = eventDate.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        setNextEventCountdown(`${days} days ${hours} hours ${minutes} minutes left`);
      } else {
        setNextEventCountdown('Event has started!');
      }
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

  const upcomingEvents = events.filter(event => !event.isPast).slice(0, 4);

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
          <div className="max-w-3xl text-center mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Alumni Events & Reunions</h1>
            <p className="text-xl mb-8">Connect, learn, and grow with fellow Namal alumni through our exciting events and reunions.</p>
            
            {/* Live Countdown */}
            {nextEventCountdown && upcomingEvents.length > 0 && (
              <div className="bg-yellow-500 text-green-900 px-8 py-4 rounded-lg mb-8 inline-block">
                <h2 className="text-2xl font-bold mb-2">Next Event: {upcomingEvents[0].title}</h2>
                <p className="text-3xl font-extrabold">{nextEventCountdown}</p>
              </div>
            )}
            
            {user && (
              <button
                onClick={() => setShowIdeaModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-md transition-colors mx-auto"
              >
                <Plus className="h-5 w-5" />
                Suggest an Event
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-green-800 mb-12 text-center">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {upcomingEvents.map(event => (
              <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={getEventImage(event)} 
                    alt={event.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.type === 'Reunion' ? 'bg-purple-100 text-purple-800' :
                      event.type === 'Networking' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'Workshop' ? 'bg-green-100 text-green-800' :
                      event.type === 'Conference' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-green-800 mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.shortDescription || event.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-3 text-green-800" />
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 mr-3 text-green-800" />
                      <span className="font-medium">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-3 text-green-800" />
                      <span className="font-medium">{event.isVirtual ? 'Virtual Event' : event.location}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center text-gray-600 ml-8">
                        <span className="text-sm">Venue: {event.venue.name}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-700">
                      <Users className="h-5 w-5 mr-3 text-green-800" />
                      <span className="font-medium">
                        {event.registeredCount}/{event.capacity} registered ({event.spotsRemaining} spots left)
                      </span>
                    </div>
                  </div>

                  {event.registrationFee.amount > 0 && (
                    <div className="mb-4">
                      <span className="text-xl font-bold text-green-700">
                        {event.registrationFee.currency} {event.registrationFee.amount.toLocaleString()}
                      </span>
                      <span className="text-gray-600 ml-2">Registration Fee</span>
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
                    
                    {event.isRegistrationOpen && (
                      <button 
                        onClick={() => handleRegisterClick(event)}
                        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-md transition-colors"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-gray-50 py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events by title, description, or location"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <option value="conference">Conference</option>
                <option value="seminar">Seminar</option>
                <option value="social">Social</option>
                <option value="career">Career</option>
                <option value="webinar">Webinar</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* All Events Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-green-800 mb-8">All Events</h2>
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
                        event.type === 'Conference' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
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

export default Events;