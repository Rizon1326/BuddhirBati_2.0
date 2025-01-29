import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User, Mail, FileText, AlertCircle } from 'lucide-react';

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

      // Removed post count fetching code
    } catch (err) {
      console.error('Error decoding token:', err);
      setError('Failed to decode user information.');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center text-red-500 mb-4">
                <AlertCircle className="w-12 h-12" />
              </div>
              <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
                Error Loading Profile
              </h2>
              <p className="text-center text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-full shadow-lg">
                <User className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold text-white">
              {user.username || 'Loading...'}
            </h2>
          </div>

          {/* Profile Content */}
          {user.email ? (
            <div className="p-6">
              {/* Email Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-lg font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Posts Count Section */}
              

              {/* Stats Grid */}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="space-y-3 mt-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;