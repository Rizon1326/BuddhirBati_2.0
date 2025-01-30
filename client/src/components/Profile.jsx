import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User, Mail, AlertCircle, Shield } from 'lucide-react';
import { Crown } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }

      const decoded = jwtDecode(token);
      const email = decoded.email;
      const username = email.split('@')[0];
      setUser({ email, username });
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Failed to decode user information.');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-sky-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-red-100">
            <div className="p-8">
              <div className="flex items-center justify-center text-red-600 mb-6">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h2 className="text-center text-xl font-medium text-gray-900 mb-3">
                Error Loading Profile
              </h2>
              <p className="text-center text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
          {/* Decorative diagonal stripes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-100 to-blue-100 transform rotate-45 translate-x-16 -translate-y-16"></div>
          
          <div className="relative px-8 pt-8 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-sky-100 to-blue-200 p-4 rounded-2xl shadow-inner">
                  <User className="w-16 h-16 text-blue-600" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-semibold text-gray-900">
                  {user.username || 'Loading...'}
                </h2>
                <p className="text-sky-600 font-medium mt-1">Profile Dashboard</p>
              </div>
            </div>
          </div>

          {user.email ? (
            <div className="px-8 py-6 space-y-6">
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-6 shadow-inner">
                <h3 className="text-sm font-medium text-sky-800 mb-4">Contact Information</h3>
                <div className="flex items-center bg-white rounded-lg p-4 shadow-sm">
                  <Mail className="w-5 h-5 text-sky-500" />
                  <div className="ml-4">
                    <p className="text-sm text-sky-600">Email Address</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 shadow-inner">
               <h3 className="text-sm font-medium text-amber-800 mb-4">Membership Level</h3>
                <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                 <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-400 ring-4 ring-amber-100"></div>
                   <p className="ml-3 text-sm font-medium text-amber-700">Premium</p>
                  </div>
                  <Crown className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </div>
          ) : (
            <div className="px-8 py-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-sky-100 rounded-full w-1/4"></div>
                <div className="h-10 bg-sky-100 rounded-full"></div>
                <div className="h-4 bg-sky-100 rounded-full w-1/2"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;