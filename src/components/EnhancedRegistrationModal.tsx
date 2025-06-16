import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Phone, GraduationCap, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from './AuthContext';

interface EnhancedRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedRegistrationModal: React.FC<EnhancedRegistrationModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    graduationYear: '',
    degreeProgram: '',
    currentPosition: '',
    currentLocation: '',
    membershipType: '',
    agreeToTerms: false,
    agreeToNewsletter: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && 
               formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword;
      case 2:
        return formData.graduationYear && formData.degreeProgram;
      case 3:
        return formData.membershipType && formData.agreeToTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setError(null);
    } else {
      if (currentStep === 1 && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
      } else {
        setError('Please fill in all required fields');
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) {
      setError('Please complete all required fields and agree to terms');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        ...formData,
        graduationYear: parseInt(formData.graduationYear),
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setCurrentStep(1);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          graduationYear: '',
          degreeProgram: '',
          currentPosition: '',
          currentLocation: '',
          membershipType: '',
          agreeToTerms: false,
          agreeToNewsletter: false,
        });
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="First name"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Last name"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="+92 300 1234567"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year *</label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              required
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Year</option>
              {Array.from({ length: 16 }, (_, i) => 2010 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Degree Program *</label>
          <select
            required
            value={formData.degreeProgram}
            onChange={(e) => setFormData({ ...formData, degreeProgram: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Program</option>
            <option value="BS Computer Science">BS Computer Science</option>
            <option value="BS Electrical Engineering">BS Electrical Engineering</option>
            <option value="BS Mechanical Engineering">BS Mechanical Engineering</option>
            <option value="BBA">BBA</option>
            <option value="MBA">MBA</option>
            <option value="MS Computer Science">MS Computer Science</option>
            <option value="MS Electrical Engineering">MS Electrical Engineering</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={formData.currentPosition}
            onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Software Engineer at Google"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={formData.currentLocation}
            onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="City, Country"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Membership & Terms</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Choose Membership Type *</label>
        <div className="space-y-3">
          <label className="flex items-start p-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="membershipType"
              value="Basic"
              checked={formData.membershipType === 'Basic'}
              onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
              className="mt-1 h-4 w-4 text-green-800 focus:ring-green-500"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">Basic Membership</div>
              <div className="text-sm text-gray-600">Free • Alumni directory access, newsletter, basic events</div>
            </div>
          </label>
          
          <label className="flex items-start p-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="membershipType"
              value="Premium"
              checked={formData.membershipType === 'Premium'}
              onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
              className="mt-1 h-4 w-4 text-green-800 focus:ring-green-500"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">Premium Membership</div>
              <div className="text-sm text-gray-600">PKR 5,000/year • All basic features + mentorship, exclusive events</div>
            </div>
          </label>
          
          <label className="flex items-start p-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="membershipType"
              value="Lifetime"
              checked={formData.membershipType === 'Lifetime'}
              onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
              className="mt-1 h-4 w-4 text-green-800 focus:ring-green-500"
            />
            <div className="ml-3">
              <div className="font-medium text-gray-900">Lifetime Membership</div>
              <div className="text-sm text-gray-600">PKR 25,000 one-time • All premium features + VIP access</div>
            </div>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-start">
          <input
            type="checkbox"
            required
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
            className="mt-1 h-4 w-4 text-green-800 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">
            I agree to the{' '}
            <a href="#" className="text-green-800 hover:text-green-700 underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-green-800 hover:text-green-700 underline">Privacy Policy</a> *
          </span>
        </label>

        <label className="flex items-start">
          <input
            type="checkbox"
            checked={formData.agreeToNewsletter}
            onChange={(e) => setFormData({ ...formData, agreeToNewsletter: e.target.checked })}
            className="mt-1 h-4 w-4 text-green-800 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">
            I would like to receive updates about alumni events and opportunities
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-green-800">Join Alumni Network</h2>
              <p className="text-gray-600 mt-1">Step {currentStep} of 3</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step <= currentStep ? 'bg-green-800 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-green-800' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
              Registration successful! Welcome to the Namal Alumni Network.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-green-800 hover:bg-green-700 text-white font-bold rounded-md transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-900 mr-2"></div>
                        Registering...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};