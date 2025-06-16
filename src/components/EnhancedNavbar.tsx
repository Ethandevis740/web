import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, GraduationCap, User, LogOut, Bell, Search } from 'lucide-react';
import { useAuth } from './AuthContext';
import { EnhancedLoginModal } from './EnhancedLoginModal';

interface EnhancedNavbarProps {
  onRegister: () => void;
}

const EnhancedNavbar: React.FC<EnhancedNavbarProps> = ({ onRegister }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const notifications = [
    { id: 1, message: "New event: Annual Alumni Reunion", time: "2 hours ago", unread: true },
    { id: 2, message: "Job posting: Software Engineer at TechCorp", time: "1 day ago", unread: true },
    { id: 3, message: "Your event idea has been approved", time: "3 days ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <nav className="bg-green-800 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <GraduationCap className="h-8 w-8 text-yellow-400" />
                <span className="ml-2 text-xl font-bold">NEXUS</span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-3 py-2 hover:text-yellow-400 transition-colors rounded-md hover:bg-green-700">
                Home
              </Link>
              <Link to="/about" className="px-3 py-2 hover:text-yellow-400 transition-colors rounded-md hover:bg-green-700">
                About
              </Link>
              <Link to="/events" className="px-3 py-2 hover:text-yellow-400 transition-colors rounded-md hover:bg-green-700">
                Events
              </Link>
              <Link to="/success-stories" className="px-3 py-2 hover:text-yellow-400 transition-colors rounded-md hover:bg-green-700">
                Success Stories
              </Link>
              <Link to="/jobs" className="px-3 py-2 hover:text-yellow-400 transition-colors rounded-md hover:bg-green-700">
                Jobs
              </Link>
              <Link to="/alumni-directory" className="px-3 py-2 hover:text-yellow-400 transition-colors rounded-md hover:bg-green-700">
                Directory
              </Link>
              <Link to="/membership" className="px-3 py-2 hover:text-yellow-400 transition-colors rounded-md hover:bg-green-700">
                Membership
              </Link>
              <Link to="/contact" className="px-3 py-2 hover:text-yellow-400 transition-colors rounded-md hover:bg-green-700">
                Contact
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-3 ml-4">
                  {/* Search */}
                  <button className="p-2 hover:bg-green-700 rounded-md transition-colors">
                    <Search className="h-5 w-5" />
                  </button>
                  
                  {/* Notifications */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 hover:bg-green-700 rounded-md transition-colors relative"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        </div>
                        {notifications.map(notification => (
                          <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                        <div className="px-4 py-2 border-t border-gray-200">
                          <button className="text-sm text-green-800 hover:text-green-700">View all notifications</button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* User Menu */}
                  <div className="flex items-center space-x-2 bg-green-700 rounded-md px-3 py-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-800" />
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-green-200">{user.membershipType} Member</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 hover:bg-green-700 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-green-900 font-bold rounded-md transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={onRegister}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-md transition-colors"
                  >
                    Join Now
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-white focus:outline-none">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-green-800 border-t border-green-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-400 transition-colors rounded-md" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/about" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-400 transition-colors rounded-md" onClick={toggleMenu}>
                About
              </Link>
              <Link to="/events" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-400 transition-colors rounded-md" onClick={toggleMenu}>
                Events
              </Link>
              <Link to="/success-stories" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-400 transition-colors rounded-md" onClick={toggleMenu}>
                Success Stories
              </Link>
              <Link to="/jobs" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-400 transition-colors rounded-md" onClick={toggleMenu}>
                Jobs
              </Link>
              <Link to="/alumni-directory" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-400 transition-colors rounded-md" onClick={toggleMenu}>
                Directory
              </Link>
              <Link to="/membership" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-400 transition-colors rounded-md" onClick={toggleMenu}>
                Membership
              </Link>
              <Link to="/contact" className="block px-3 py-2 hover:bg-green-700 hover:text-yellow-400 transition-colors rounded-md" onClick={toggleMenu}>
                Contact
              </Link>
              
              {user ? (
                <div className="px-3 py-2 border-t border-green-700 mt-2">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-green-800" />
                    </div>
                    <div className="ml-3">
                      <p className="text-yellow-400 font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-green-200 text-sm">{user.membershipType} Member</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center space-x-2 text-white hover:text-yellow-400 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 border-t border-green-700 mt-2 space-y-2">
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      toggleMenu();
                    }}
                    className="block w-full px-3 py-2 bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-green-900 font-bold rounded-md transition-colors text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onRegister();
                      toggleMenu();
                    }}
                    className="block w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold rounded-md transition-colors text-center"
                  >
                    Join Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <EnhancedLoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          onRegister();
        }}
      />
    </>
  );
};

export default EnhancedNavbar;