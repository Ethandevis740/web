import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Briefcase, GraduationCap, Mail, Phone, Linkedin, Globe, User } from 'lucide-react';

interface Alumni {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  graduationYear: number;
  degreeProgram: string;
  currentPosition?: string;
  currentLocation?: string;
  membershipType: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  profilePicture?: string;
}

const AlumniDirectory: React.FC = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    graduationYear: '',
    degreeProgram: '',
    location: '',
    membershipType: ''
  });
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    filterAlumni();
  }, [alumni, searchTerm, filters]);

  const fetchAlumni = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/alumni');
      const data = await response.json();
      
      if (data.success) {
        setAlumni(data.data);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAlumni = () => {
    let filtered = alumni;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(person =>
        `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.currentPosition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.currentLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.degreeProgram.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Year filter
    if (filters.graduationYear) {
      filtered = filtered.filter(person => person.graduationYear.toString() === filters.graduationYear);
    }

    // Program filter
    if (filters.degreeProgram) {
      filtered = filtered.filter(person => person.degreeProgram === filters.degreeProgram);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(person => 
        person.currentLocation?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Membership filter
    if (filters.membershipType) {
      filtered = filtered.filter(person => person.membershipType === filters.membershipType);
    }

    setFilteredAlumni(filtered);
  };

  const getUniqueValues = (key: keyof Alumni) => {
    return [...new Set(alumni.map(person => person[key]).filter(Boolean))];
  };

  const getGraduationYears = () => {
    return [...new Set(alumni.map(person => person.graduationYear))].sort((a, b) => b - a);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-800"></div>
          <p className="mt-4 text-gray-600">Loading alumni directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Alumni Directory</h1>
          <p className="text-xl">Connect with fellow Namal graduates around the world</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, position, location, or program..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filters.graduationYear}
                onChange={(e) => setFilters({ ...filters, graduationYear: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Years</option>
                {getGraduationYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select
                value={filters.degreeProgram}
                onChange={(e) => setFilters({ ...filters, degreeProgram: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Programs</option>
                {getUniqueValues('degreeProgram').map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <select
                value={filters.membershipType}
                onChange={(e) => setFilters({ ...filters, membershipType: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Members</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="Lifetime">Lifetime</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAlumni.length} of {alumni.length} alumni
          </div>
        </div>
      </div>

      {/* Alumni Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAlumni.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No alumni found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlumni.map(person => (
              <div key={person._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {person.profilePicture ? (
                      <img 
                        src={person.profilePicture} 
                        alt={`${person.firstName} ${person.lastName}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-green-800" />
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {person.firstName} {person.lastName}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        person.membershipType === 'Lifetime' ? 'bg-purple-100 text-purple-800' :
                        person.membershipType === 'Premium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {person.membershipType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <span className="text-sm">{person.degreeProgram} • {person.graduationYear}</span>
                    </div>
                    
                    {person.currentPosition && (
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2" />
                        <span className="text-sm">{person.currentPosition}</span>
                      </div>
                    )}
                    
                    {person.currentLocation && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{person.currentLocation}</span>
                      </div>
                    )}
                  </div>

                  {person.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{person.bio}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <a 
                        href={`mailto:${person.email}`}
                        className="p-2 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      
                      {person.phone && (
                        <a 
                          href={`tel:${person.phone}`}
                          className="p-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                      
                      {person.socialLinks?.linkedin && (
                        <a 
                          href={person.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      
                      {person.socialLinks?.website && (
                        <a 
                          href={person.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedAlumni(person)}
                      className="px-3 py-1 bg-green-800 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedAlumni && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  {selectedAlumni.profilePicture ? (
                    <img 
                      src={selectedAlumni.profilePicture} 
                      alt={`${selectedAlumni.firstName} ${selectedAlumni.lastName}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-green-800" />
                    </div>
                  )}
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedAlumni.firstName} {selectedAlumni.lastName}
                    </h2>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                      selectedAlumni.membershipType === 'Lifetime' ? 'bg-purple-100 text-purple-800' :
                      selectedAlumni.membershipType === 'Premium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedAlumni.membershipType} Member
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAlumni(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Education</h3>
                    <p className="text-gray-600">{selectedAlumni.degreeProgram}</p>
                    <p className="text-gray-600">Class of {selectedAlumni.graduationYear}</p>
                  </div>
                  
                  {selectedAlumni.currentPosition && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Current Position</h3>
                      <p className="text-gray-600">{selectedAlumni.currentPosition}</p>
                    </div>
                  )}
                  
                  {selectedAlumni.currentLocation && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                      <p className="text-gray-600">{selectedAlumni.currentLocation}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
                    <p className="text-gray-600">{selectedAlumni.email}</p>
                    {selectedAlumni.phone && (
                      <p className="text-gray-600">{selectedAlumni.phone}</p>
                    )}
                  </div>
                </div>

                {selectedAlumni.bio && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                    <p className="text-gray-600">{selectedAlumni.bio}</p>
                  </div>
                )}

                {selectedAlumni.socialLinks && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Social Links</h3>
                    <div className="flex space-x-3">
                      {selectedAlumni.socialLinks.linkedin && (
                        <a 
                          href={selectedAlumni.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      )}
                      {selectedAlumni.socialLinks.website && (
                        <a 
                          href={selectedAlumni.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <a
                  href={`mailto:${selectedAlumni.email}`}
                  className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Send Message
                </a>
                <button
                  onClick={() => setSelectedAlumni(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniDirectory;