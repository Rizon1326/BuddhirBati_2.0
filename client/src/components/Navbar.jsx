import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Home, User, Sparkles } from "lucide-react";
import axios from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sparklePosition, setSparklePosition] = useState({ x: 0, y: 0 });
  const [showSparkle, setShowSparkle] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await axios.get(`http://localhost/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const unread = response.data.notifications.filter(
        (n) => !n.recipients.some((recipient) => recipient.userId === response.data.userId && recipient.isSeen) && new Date(n.expiresAt) > new Date()
      );
      setUnreadCount(unread.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    }
  };

  const createSparkleEffect = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSparklePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 500);
  };

  const handleButtonClick = (action) => (e) => {
    createSparkleEffect(e);
    setTimeout(() => action(), 200);
  };

  useEffect(() => {
    fetchNotifications();
    window.updateUnreadCount = fetchNotifications;
    return () => {
      delete window.updateUnreadCount;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-200 via-cyan-300 to-lightBlue-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative z-10">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <img
              src="/rizu.png"
              alt="BuddhirBati Logo"
              onClick={handleButtonClick(() => navigate("/posts"))}
              className="cursor-pointer rounded-lg shadow-sm transform hover:scale-105 transition-all duration-200"
              style={{ width: '90px', height: '80px' }}
            />
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {/* Home Button */}
            <button
              onClick={handleButtonClick(() => navigate("/posts"))}
              className="flex items-center gap-2 text-gray-700 hover:text-white hover:bg-blue-500 hover:rounded-lg px-4 py-2 transition-all duration-200 transform hover:scale-110"
            >
              <Home className="w-6 h-6 text-gray-700 hover:text-white" />
              <span className="hidden sm:inline">Home</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => navigate("/notifications")}
              className="relative text-gray-700 hover:text-white p-2 rounded-full hover:bg-blue-500 transition-all duration-200"
            >
              <Bell className="h-6 w-6 text-gray-700 hover:text-white" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-white animate-pulse">
                  {unreadCount}
                </div>
              )}
            </button>

            {/* Profile Button */}
            <button
              onClick={handleButtonClick(() => navigate("/profile"))}
              className="flex items-center gap-2 text-gray-700 hover:text-white hover:bg-blue-500 hover:rounded-lg px-4 py-2 transition-all duration-200 transform hover:scale-110"
            >
              <User className="w-6 h-6 text-gray-700 hover:text-white" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Cuter Logout Button */}
            <button
              onClick={handleButtonClick(handleLogout)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-110 shadow-md hover:shadow-lg"
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wave Effect */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-blue-400 transform rotate-180 rounded-t-full"></div>
      </div>

      {/* Sparkle Effect */}
      {showSparkle && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${sparklePosition.x}px`,
            top: `${sparklePosition.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Sparkles
            className="w-6 h-6 text-yellow-400 animate-spin"
            style={{
              animation: "sparkle 0.5s ease-out forwards",
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes sparkle {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
