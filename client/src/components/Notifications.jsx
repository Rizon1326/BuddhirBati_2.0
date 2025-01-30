import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, BellOff, Bell, ArrowRight, Eye } from "lucide-react";
import axios from "../api/axios";

const AnimatedText = ({ text, className = "" }) => (
  <div className={`inline-block ${className}`}>
    {text.split('').map((char, index) => (
      <span
        key={index}
        className="inline-block animate-pulse bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent"
        style={{
          animationDelay: `${index * 0.1}s`,
          animationDuration: '1.5s'
        }}
      >
        {char}
      </span>
    ))}
  </div>
);

const NotificationCard = ({ notification, userId, onMarkSeen, onViewPost }) => {
  const isSeen = notification.recipients.some(
    (recipient) => recipient.userId === userId && recipient.isSeen
  );

  return (
    <div
      className={`relative overflow-hidden backdrop-blur-sm rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-102 ${
        isSeen 
          ? "bg-white/30 border-blue-100" 
          : "bg-white/50 border-blue-200"
      }`}
    >
      {/* Decorative gradient bar */}
      <div 
        className={`absolute top-0 left-0 w-1 h-full ${
          isSeen
            ? "bg-gradient-to-b from-gray-300 to-gray-400"
            : "bg-gradient-to-b from-blue-500 to-sky-500 animate-pulse"
        }`}
      />
      
      <div className="p-6 pl-8">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <p className="text-lg font-medium text-gray-800">
              {notification.message}
            </p>
            <p className="text-sm text-sky-600 mt-2 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              {notification.senderEmail || "Unknown"}
            </p>
          </div>
          
          {!isSeen && (
            <button
              onClick={() => onMarkSeen(notification._id, notification.expiresAt)}
              className="text-sky-500 hover:text-sky-600 transition-colors"
            >
              <CheckCircle className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="flex justify-end items-center mt-4 space-x-3">
          <button
            onClick={() => onMarkSeen(notification._id, notification.expiresAt)}
            disabled={isSeen}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              isSeen
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:from-blue-700 hover:to-sky-600"
            }`}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark as Seen
          </button>
          
          <button
            onClick={() => onViewPost(notification.postId)}
            className="flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-600 hover:to-blue-600 transition-all duration-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Post
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
    if (decodedToken) {
      setUserId(decodedToken.id);
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost/api/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentTime = new Date();
        const updatedNotifications = response.data.notifications.filter((notification) => {
          return (
            notification.expiresAt >= currentTime || 
            !notification.recipients.some(recipient => recipient.userId === userId && recipient.isSeen)
          );
        });

        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token, userId]);

  const markAsSeen = async (notificationId, expiresAt) => {
    try {
      await axios.put(
        `http://localhost/api/notifications/${notificationId}/markAsSeen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                recipients: notification.recipients.map((recipient) =>
                  recipient.userId === userId
                    ? { ...recipient, isSeen: true }
                    : recipient
                ),
              }
            : notification
        )
      );

      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) =>
            !(new Date(notification.expiresAt) < new Date() && 
              notification.recipients.every((recipient) => recipient.isSeen))
        )
      );
      
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    }
  };

  const viewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <AnimatedText 
            text="Notifications" 
            className="text-4xl font-bold mb-2"
          />
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-600 to-sky-400 rounded-full" />
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-12 text-center border border-blue-100">
            <div className="flex flex-col items-center text-gray-500">
              <div className="w-20 h-20 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <BellOff className="w-10 h-10" />
              </div>
              <p className="text-lg font-medium bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                No new notifications
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                userId={userId}
                onMarkSeen={markAsSeen}
                onViewPost={viewPost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;