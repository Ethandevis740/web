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
  company?: string;
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

  // Sample alumni data
  const sampleAlumni: Alumni[] = [
    {
      _id: '1',
      firstName: 'Ahmed',
      lastName: 'Khan',
      email: 'ahmed.khan@techcorp.com',
      phone: '+92 300 1234567',
      graduationYear: 2018,
      degreeProgram: 'BS Computer Science',
      currentPosition: 'Senior Software Engineer',
      currentLocation: 'Lahore, Pakistan',
      company: 'TechCorp Solutions',
      membershipType: 'Premium',
      bio: 'Passionate software engineer with 6+ years of experience in full-stack development. Currently leading a team of developers at TechCorp Solutions.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/ahmed-khan',
        github: 'https://github.com/ahmedkhan'
      },
      profilePicture: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      _id: '2',
      firstName: 'Sarah',
      lastName: 'Ahmed',
      email: 'sarah.ahmed@digitalmarketing.com',
      phone: '+92 321 9876543',
      graduationYear: 2019,
      degreeProgram: 'BBA',
      currentPosition: 'Marketing Manager',
      currentLocation: 'Karachi, Pakistan',
      company: 'Digital Marketing Pro',
      membershipType: 'Basic',
      bio: 'Creative marketing professional specializing in digital campaigns and brand strategy. Helping businesses grow their online presence.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sarah-ahmed',
        website: 'https://sarahmarketing.com'
      },
      profilePicture: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      _id: '3',
      firstName: 'Ali',
      lastName: 'Hassan',
      email: 'ali.hassan@investcorp.com',
      phone: '+92 333 5555555',
      graduationYear: 2020,
      degreeProgram: 'BS Electrical Engineering',
      currentPosition: 'Financial Analyst',
      currentLocation: 'Islamabad, Pakistan',
      company: 'InvestCorp Bank',
      membershipType: 'Premium',
      bio: 'Financial analyst with expertise in investment research and portfolio management. Passionate about sustainable finance and technology.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/ali-hassan'
      },
      profilePicture: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      _id: '4',
      firstName: 'Fatima',
      lastName: 'Malik',
      email: 'fatima.malik@innovationlabs.com',
      phone: '+1 555 123 4567',
      graduationYear: 2017,
      degreeProgram: 'BS Computer Science',
      currentPosition: 'Product Manager',
      currentLocation: 'San Francisco, USA',
      company: 'Innovation Labs',
      membershipType: 'Lifetime',
      bio: 'Product manager with a passion for building user-centric technology solutions. Leading product development for cutting-edge AI applications.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/fatima-malik',
        website: 'https://fatimamalik.com'
      },
      profilePicture: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      _id: '5',
      firstName: 'Muhammad',
      lastName: 'Usman',
      email: 'usman@greentech.com',
      phone: '+92 345 7777777',
      graduationYear: 2016,
      degreeProgram: 'BS Mechanical Engineering',
      currentPosition: 'Engineering Manager',
      currentLocation: 'Dubai, UAE',
      company: 'GreenTech Solutions',
      membershipType: 'Premium',
      bio: 'Mechanical engineer turned engineering manager, focusing on renewable energy solutions and sustainable technology development.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/muhammad-usman'
      },
      profilePicture: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      _id: '6',
      firstName: 'Ayesha',
      lastName: 'Siddiqui',
      email: 'ayesha.siddiqui@healthtech.com',
      phone: '+44 20 1234 5678',
      graduationYear: 2019,
      degreeProgram: 'BBA',
      currentPosition: 'Business Development Manager',
      currentLocation: 'London, UK',
      company: 'HealthTech Innovations',
      membershipType: 'Basic',
      bio: 'Business development professional in the healthcare technology sector. Passionate about improving healthcare accessibility through technology.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/ayesha-siddiqui'
      },
      profilePicture: 'https://images.pexels.com/photos/3796207/pexels-photo-3796207.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      _id: '7',
      firstName: 'Hassan',
      lastName: 'Ali',
      email: 'hassan.ali@startup.com',
      phone: '+92 300 8888888',
      graduationYear: 2021,
      degreeProgram: 'BS Computer Science',
      currentPosition: 'Software Developer',
      currentLocation: 'Lahore, Pakistan',
      company: 'TechStartup Inc',
      membershipType: 'Basic',
      bio: 'Fresh graduate working as a software developer at a promising tech startup. Interested in mobile app development and machine learning.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/hassan-ali',
        github: 'https://github.com/hassanali'
      },
      profilePicture: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      _id: '8',
      firstName: 'Zara',
      lastName: 'Sheikh',
      email: 'zara.sheikh@consulting.com',
      phone: '+1 416 555 9999',
      graduationYear: 2018,
      degreeProgram: 'MBA',
      currentPosition: 'Management Consultant',
      currentLocation: 'Toronto, Canada',
      company: 'Global Consulting Group',
      membershipType: 'Premium',
      bio: 'Management consultant helping organizations optimize their operations and strategy. Specialized in digital transformation and change management.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/zara-sheikh',
        website: 'https://zarasheikh.consulting'
      },
      profilePicture: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      _id: '9',
      firstName: 'Omar',
      lastName: 'Farooq',
      email: 'omar.farooq@research.org',
      phone: '+61 2 9999 8888',
      graduationYear: 2015,
      degreeProgram: 'MS Computer Science',
      currentPosition: 'Research Scientist',
      currentLocation: 'Sydney, Australia',
      company: 'AI Research Institute',
      membershipType: 'Lifetime',
      bio: 'Research scientist working on artificial intelligence and machine learning applications. Published researcher with focus on computer vision and NLP.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/omar-farooq',
        website: 'https://omarfarooq.research.org'
      },
      profilePicture: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      _id: '10',
      firstName: 'Mariam',
      lastName: 'Qureshi',
      email: 'mariam.qureshi@ngo.org',
      phone: '+92 42 1111 2222',
      graduationYear: 2020,
      degreeProgram: 'BBA',
      currentPosition: 'Program Manager',
      currentLocation: 'Lahore, Pakistan',
      company: 'Education for All NGO',
      membershipType: 'Basic',
      bio: 'Program manager at a leading education NGO, working to improve educational access for underprivileged communities across Pakistan.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/mariam-qureshi'
      },
      profilePicture: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  useEffect(() => {
    // Use sample data instead of API call
    setAlumni(sampleAlumni);
    setLoading(false);
  }, []);

  useEffect(() => {
    filterAlumni();
  }, [alumni, searchTerm, filters]);

  const filterAlumni = () => {
    let filtered = alumni;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(person =>
        `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.currentPosition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.currentLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <div className="bg-green-800 text-white py-16">
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
                placeholder="Search by name, position, company, location, or program..."
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
                    
                    {person.company && (
                      <div className="flex items-center text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">{person.company}</span>
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
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      
                      {person.phone && (
                        <a 
                          href={`tel:${person.phone}`}
                          className="p-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                          title="Call"
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
                          title="LinkedIn Profile"
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
                          title="Website"
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
                  <X className="h-6 w-6" />
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
                      {selectedAlumni.company && (
                        <p className="text-gray-600 font-medium">{selectedAlumni.company}</p>
                      )}
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
                      {selectedAlumni.socialLinks.github && (
                        <a 
                          href={selectedAlumni.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          GitHub
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