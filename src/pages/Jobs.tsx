import React, { useState, useEffect } from 'react';
import { Briefcase, Building2, MapPin, Clock, Search, Filter, MessageSquare, Send, Plus, Eye, Calendar, DollarSign, Upload, X } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { JobPostModal } from '../components/JobPostModal';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  category: string;
  experienceLevel: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  applicationDeadline: string;
  applicationMethod: string;
  applicationEmail?: string;
  applicationUrl?: string;
  postedBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
  views: number;
  applicationCount: number;
  createdAt: string;
}

interface JobApplication {
  name: string;
  qualification: string;
  cv: File | null;
}

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobPostModal, setShowJobPostModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [applicationData, setApplicationData] = useState<JobApplication>({
    name: '',
    qualification: '',
    cv: null
  });

  // Sample job data
  const sampleJobs: Job[] = [
    {
      _id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Solutions',
      location: 'Lahore, Pakistan',
      jobType: 'Full-time',
      category: 'Technology',
      experienceLevel: 'Senior Level',
      description: 'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for developing scalable web applications, mentoring junior developers, and contributing to architectural decisions.',
      requirements: [
        '5+ years of experience in software development',
        'Proficiency in React, Node.js, and TypeScript',
        'Experience with cloud platforms (AWS/Azure)',
        'Strong problem-solving skills',
        'Bachelor\'s degree in Computer Science or related field'
      ],
      responsibilities: [
        'Design and develop high-quality software solutions',
        'Collaborate with cross-functional teams',
        'Mentor junior developers',
        'Participate in code reviews and technical discussions',
        'Contribute to system architecture and design decisions'
      ],
      salaryRange: {
        min: 150000,
        max: 250000,
        currency: 'PKR'
      },
      applicationDeadline: '2025-03-15',
      applicationMethod: 'email',
      applicationEmail: 'careers@techcorp.com',
      postedBy: {
        firstName: 'Ahmed',
        lastName: 'Khan',
        email: 'ahmed.khan@techcorp.com'
      },
      views: 245,
      applicationCount: 23,
      createdAt: '2025-01-15'
    },
    {
      _id: '2',
      title: 'Marketing Manager',
      company: 'Digital Marketing Pro',
      location: 'Karachi, Pakistan',
      jobType: 'Full-time',
      category: 'Marketing',
      experienceLevel: 'Mid Level',
      description: 'Join our marketing team as a Marketing Manager to lead digital marketing campaigns, manage social media presence, and drive brand awareness for our clients.',
      requirements: [
        '3+ years of marketing experience',
        'Experience with digital marketing tools',
        'Strong analytical and communication skills',
        'Knowledge of SEO and social media marketing',
        'MBA in Marketing preferred'
      ],
      responsibilities: [
        'Develop and execute marketing strategies',
        'Manage social media accounts and campaigns',
        'Analyze marketing metrics and ROI',
        'Coordinate with design and content teams',
        'Present campaign results to clients'
      ],
      salaryRange: {
        min: 80000,
        max: 120000,
        currency: 'PKR'
      },
      applicationDeadline: '2025-02-28',
      applicationMethod: 'email',
      applicationEmail: 'hr@digitalmarketingpro.com',
      postedBy: {
        firstName: 'Sarah',
        lastName: 'Ahmed',
        email: 'sarah.ahmed@digitalmarketingpro.com'
      },
      views: 189,
      applicationCount: 31,
      createdAt: '2025-01-10'
    },
    {
      _id: '3',
      title: 'Financial Analyst',
      company: 'InvestCorp Bank',
      location: 'Islamabad, Pakistan',
      jobType: 'Full-time',
      category: 'Finance',
      experienceLevel: 'Entry Level',
      description: 'We are seeking a detail-oriented Financial Analyst to join our investment team. You will analyze financial data, prepare reports, and support investment decision-making processes.',
      requirements: [
        'Bachelor\'s degree in Finance, Economics, or related field',
        'Strong analytical and mathematical skills',
        'Proficiency in Excel and financial modeling',
        'Knowledge of financial markets and instruments',
        'CFA Level 1 preferred but not required'
      ],
      responsibilities: [
        'Analyze financial statements and market data',
        'Prepare investment research reports',
        'Support portfolio management activities',
        'Monitor market trends and economic indicators',
        'Assist in client presentations and meetings'
      ],
      salaryRange: {
        min: 60000,
        max: 90000,
        currency: 'PKR'
      },
      applicationDeadline: '2025-02-20',
      applicationMethod: 'email',
      applicationEmail: 'careers@investcorp.com',
      postedBy: {
        firstName: 'Ali',
        lastName: 'Hassan',
        email: 'ali.hassan@investcorp.com'
      },
      views: 156,
      applicationCount: 18,
      createdAt: '2025-01-08'
    },
    {
      _id: '4',
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'Remote',
      jobType: 'Remote',
      category: 'Technology',
      experienceLevel: 'Senior Level',
      description: 'Lead product development initiatives for our cutting-edge technology solutions. Work with engineering, design, and business teams to deliver exceptional products.',
      requirements: [
        '4+ years of product management experience',
        'Experience with agile development methodologies',
        'Strong leadership and communication skills',
        'Technical background preferred',
        'Experience with product analytics tools'
      ],
      responsibilities: [
        'Define product roadmap and strategy',
        'Work closely with engineering and design teams',
        'Conduct market research and competitive analysis',
        'Manage product launches and go-to-market strategies',
        'Analyze product metrics and user feedback'
      ],
      salaryRange: {
        min: 200000,
        max: 300000,
        currency: 'PKR'
      },
      applicationDeadline: '2025-03-01',
      applicationMethod: 'website',
      applicationUrl: 'https://innovationlabs.com/careers',
      postedBy: {
        firstName: 'Fatima',
        lastName: 'Malik',
        email: 'fatima.malik@innovationlabs.com'
      },
      views: 298,
      applicationCount: 42,
      createdAt: '2025-01-05'
    }
  ];

  useEffect(() => {
    // Use sample data instead of API call
    setJobs(sampleJobs);
    setLoading(false);
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, filter, searchTerm]);

  const filterJobs = () => {
    let filtered = jobs;

    // Filter by category
    if (filter !== 'all') {
      filtered = filtered.filter(job => job.category.toLowerCase() === filter.toLowerCase());
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApplyJob = (job: Job) => {
    if (!user) {
      alert('Please login to apply for jobs');
      return;
    }
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleContactRecruiter = (job: Job) => {
    setSelectedJob(job);
    setShowContactModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      setApplicationData({ ...applicationData, cv: file });
    }
  };

  const submitApplication = () => {
    if (!applicationData.name || !applicationData.qualification || !applicationData.cv) {
      alert('Please fill in all required fields and upload your CV');
      return;
    }
    
    // In a real implementation, this would upload the file and submit the application
    alert('Application submitted successfully! The recruiter will contact you soon.');
    setShowApplicationModal(false);
    setApplicationData({ name: '', qualification: '', cv: null });
  };

  const sendContactMessage = () => {
    if (!contactMessage.trim()) return;

    // In a real implementation, this would send an email or message
    alert('Message sent to recruiter!');
    setShowContactModal(false);
    setContactMessage('');
  };

  const formatSalary = (salaryRange: any) => {
    if (!salaryRange || (!salaryRange.min && !salaryRange.max)) return 'Salary not specified';
    
    const { min, max, currency } = salaryRange;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Salary not specified';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-800"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-green-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Career Opportunities</h1>
            <p className="text-xl mb-8">Discover job opportunities posted by fellow alumni and partner companies.</p>
            {user && (
              <button
                onClick={() => setShowJobPostModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-md transition-colors"
              >
                <Plus className="h-5 w-5" />
                Post a Job
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Job Statistics */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center mb-2">
                <Briefcase className="h-8 w-8 text-green-800" />
              </div>
              <p className="text-3xl font-bold text-green-800">{jobs.length}</p>
              <p className="text-gray-600">Active Jobs</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-2">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{new Set(jobs.map(job => job.company)).size}</p>
              <p className="text-gray-600">Companies</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{jobs.reduce((sum, job) => sum + job.views, 0)}</p>
              <p className="text-gray-600">Total Views</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-2">
                <Send className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{jobs.reduce((sum, job) => sum + job.applicationCount, 0)}</p>
              <p className="text-gray-600">Applications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs by title, company, or location"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center flex-wrap gap-2">
              <Filter className="h-5 w-5 text-green-800" />
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'all' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Jobs ({jobs.length})
              </button>
              <button 
                onClick={() => setFilter('technology')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'technology' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Technology
              </button>
              <button 
                onClick={() => setFilter('marketing')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'marketing' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Marketing
              </button>
              <button 
                onClick={() => setFilter('finance')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'finance' 
                    ? 'bg-green-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Finance
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredJobs.map(job => (
                <div key={job._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-green-800 mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 mr-2" />
                          <span className="font-medium text-lg">{job.company}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-5 w-5 mr-2" />
                          <span>{job.views} views</span>
                        </div>
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center text-green-700 mb-3">
                          <DollarSign className="h-5 w-5 mr-2" />
                          <span className="font-semibold text-lg">{formatSalary(job.salaryRange)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.jobType === 'Full-time' ? 'bg-green-100 text-green-800' :
                          job.jobType === 'Part-time' ? 'bg-blue-100 text-blue-800' :
                          job.jobType === 'Contract' ? 'bg-purple-100 text-purple-800' :
                          job.jobType === 'Remote' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.jobType}
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          {job.category}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {job.experienceLevel}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Posted by {job.postedBy.firstName} {job.postedBy.lastName}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(job.createdAt)}</span>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleJobClick(job)}
                        className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        View Details
                      </button>
                      {!isDeadlinePassed(job.applicationDeadline) && (
                        <>
                          <button 
                            onClick={() => handleApplyJob(job)}
                            className="px-6 py-2 bg-yellow-500 text-green-900 rounded-md hover:bg-yellow-600 transition-colors font-semibold"
                          >
                            Apply Now
                          </button>
                          <button 
                            onClick={() => handleContactRecruiter(job)}
                            className="px-4 py-2 border border-green-800 text-green-800 rounded-md hover:bg-green-50 transition-colors flex items-center"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact
                          </button>
                        </>
                      )}
                      {isDeadlinePassed(job.applicationDeadline) && (
                        <span className="px-4 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium">
                          Deadline Passed
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

      {/* Job Details Modal */}
      {selectedJob && !showContactModal && !showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-green-800 mb-2">{selectedJob.title}</h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      <span className="text-lg font-medium">{selectedJob.company}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{selectedJob.location}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">Job Description</h3>
                      <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
                    </div>

                    {selectedJob.responsibilities.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Responsibilities</h3>
                        <ul className="space-y-2">
                          {selectedJob.responsibilities.map((responsibility, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-xs font-bold mt-0.5">•</div>
                              <span className="ml-3 text-gray-600">{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedJob.requirements.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Requirements</h3>
                        <ul className="space-y-2">
                          {selectedJob.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 text-xs font-bold mt-0.5">✓</div>
                              <span className="ml-3 text-gray-600">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4 sticky top-4">
                    <h3 className="text-lg font-semibold text-gray-800">Job Details</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Job Type</span>
                        <p className="text-gray-800">{selectedJob.jobType}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Experience Level</span>
                        <p className="text-gray-800">{selectedJob.experienceLevel}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Category</span>
                        <p className="text-gray-800">{selectedJob.category}</p>
                      </div>
                      
                      {selectedJob.salaryRange && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Salary Range</span>
                          <p className="text-gray-800 font-semibold">{formatSalary(selectedJob.salaryRange)}</p>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Application Deadline</span>
                        <p className={`font-medium ${isDeadlinePassed(selectedJob.applicationDeadline) ? 'text-red-600' : 'text-gray-800'}`}>
                          {formatDate(selectedJob.applicationDeadline)}
                          {isDeadlinePassed(selectedJob.applicationDeadline) && ' (Expired)'}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Posted By</span>
                        <p className="text-gray-800">{selectedJob.postedBy.firstName} {selectedJob.postedBy.lastName}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Views</span>
                        <p className="text-gray-800">{selectedJob.views}</p>
                      </div>
                    </div>

                    {!isDeadlinePassed(selectedJob.applicationDeadline) && (
                      <div className="pt-4 space-y-3">
                        <button 
                          onClick={() => handleApplyJob(selectedJob)}
                          className="w-full px-4 py-3 bg-green-800 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
                        >
                          Apply for this Job
                        </button>
                        <button 
                          onClick={() => handleContactRecruiter(selectedJob)}
                          className="w-full px-4 py-3 border border-green-800 text-green-800 rounded-md hover:bg-green-50 transition-colors flex items-center justify-center"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Recruiter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-800">Apply for Job</h3>
              <button 
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Applying for:</p>
              <p className="font-semibold text-gray-800">{selectedJob.title} at {selectedJob.company}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={applicationData.name}
                  onChange={(e) => setApplicationData({ ...applicationData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
                <textarea
                  value={applicationData.qualification}
                  onChange={(e) => setApplicationData({ ...applicationData, qualification: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Describe your qualifications and relevant experience"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload CV (PDF or Word)</p>
                    <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
                  </label>
                  {applicationData.cv && (
                    <div className="mt-2 text-green-600">
                      <p className="text-sm">✓ {applicationData.cv.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                className="px-6 py-2 bg-green-800 text-white rounded-md hover:bg-green-700 font-semibold"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-800">Contact Recruiter</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Sending message about:</p>
              <p className="font-semibold text-gray-800">{selectedJob.title} at {selectedJob.company}</p>
            </div>
            
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
              placeholder="Write your message to the recruiter..."
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendContactMessage}
                className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Post Modal */}
      <JobPostModal 
        isOpen={showJobPostModal}
        onClose={() => setShowJobPostModal(false)}
        onJobPosted={() => {
          setShowJobPostModal(false);
        }}
      />
    </div>
  );
};

export default Jobs;