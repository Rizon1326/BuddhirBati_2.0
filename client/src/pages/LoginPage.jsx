import { useState, useEffect } from 'react';
import { User, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const AnimatedText = ({ text, className }) => {
  return (
    <div className={`inline-block ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block animate-pulse"
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1.5s',
            background: `linear-gradient(45deg, 
              ${index % 2 === 0 ? '#3B82F6' : '#0EA5E9'}, 
              ${index % 2 === 0 ? '#2563EB' : '#0284C7'})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`http://localhost/api/auth/signin`, { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/posts', { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Decorative waves */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-blue-100/40 to-sky-100/40 transform -skew-y-6"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-tl from-blue-100/40 to-sky-100/40 transform skew-y-6"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Enhanced Logo/Brand Section */}
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <img 
                  src="rizu.png" 
                  alt="Logo" 
                  className="w-24 h-24 object-contain rounded-full shadow-lg border-4 border-white/50" 
                />
                <div className="absolute -bottom-2 w-full flex justify-center">
                  <div className="bg-gradient-to-r from-blue-600 to-sky-400 h-1 w-16 rounded-full"></div>
                </div>
              </div>
              
              <AnimatedText 
                text="BuddhirBati" 
                className="text-4xl font-bold"
              />
              
              <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent animate-pulse">
              Code the Future, Build Tomorrow.
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl overflow-hidden border border-blue-100">
            {/* Header Section */}
            <div className="px-8 pt-8 pb-6 border-b border-blue-50">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome back</h2>
              <p className="mt-2 text-sm text-sky-600 text-center">
                Please sign in to access your account
              </p>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-sky-800">
                    Email address
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-sky-500" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-blue-100 rounded-xl bg-white/50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-colors duration-200"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-sky-800">
                    Password
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-sky-500" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-blue-100 rounded-xl bg-white/50 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-colors duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-sky-400 hover:text-sky-600 transition-colors duration-200" />
                      ) : (
                        <Eye className="h-5 w-5 text-sky-400 hover:text-sky-600 transition-colors duration-200" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-xl">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="font-medium text-blue-600 hover:text-sky-500 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-sky-700/70">
              By signing up, you acknowledge and agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;