import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Plus, X, FileText, Clock, ChevronRight, Loader, Mail, Sparkles, Search } from 'lucide-react';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sparklePosition, setSparklePosition] = useState({ x: 0, y: 0 });
  const [showSparkle, setShowSparkle] = useState(false);
  const navigate = useNavigate();

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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.content?.toLowerCase().includes(query) ||
      post.author_email.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost/api/posts');
        const data = await response.json();
        setPosts(data.posts);
        setFilteredPosts(data.posts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (error.response?.status === 401) {
          navigate('/signin');
        }
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader className="w-12 h-12 animate-spin text-purple-500" />
            <div className="absolute inset-0 animate-pulse opacity-50">
              <Sparkles className="w-12 h-12 text-pink-400" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 relative">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              All Posts
            </h1>
            <p className="text-gray-600 mt-2">Share your ideas</p>
          </div>
          <button
            onClick={handleButtonClick(() => navigate('/create-post'))}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white px-6 py-3 rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {/* <span>Create Post</span> */}
          </button>

          {showSparkle && (
            <div 
              className="absolute pointer-events-none"
              style={{ 
                left: `${sparklePosition.x}px`, 
                top: `${sparklePosition.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Sparkles 
                className="w-6 h-6 text-sky-400 animate-spin"
                style={{
                  animation: 'sparkle 0.5s ease-out forwards'
                }}
              />
            </div>
          )}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search posts by title, content, or author..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-sky-100 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative animate-border"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-100/50 to-blue-100/50 animate-gradient rounded-2xl" />
              <div className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sky-600 transition-colors duration-200">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <span className="text-sm">{formatDateTime(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{post.author_email}</span>
                      </div>
                    </div>
                  </div>
                  {post.file_url && (
                    <button
                      onClick={handleButtonClick(() => setSelectedPost(post))}
                      className="flex items-center gap-2 text-sky-500 hover:text-sky-600 transition-all duration-200 transform hover:scale-105"
                    >
                      <FileText className="w-5 h-5" />
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {post.content && (
                  <div className="mt-4 transform transition-all duration-200 group-hover:scale-[1.01]">
                    <SyntaxHighlighter
                      language="javascript"
                      style={coy}
                      customStyle={{
                        backgroundColor: '#f8fafc',
                        padding: '1.25rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      {post.content}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                      {selectedPost.title}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <span className="text-sm">{formatDateTime(selectedPost.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{selectedPost.author_email}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleButtonClick(() => setSelectedPost(null))}
                    className="p-2 hover:bg-sky-50 rounded-full transition-all duration-200 transform hover:scale-105"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {selectedPost.content && (
                  <div className="relative">
                    <SyntaxHighlighter
                      language="javascript"
                      style={coy}
                      customStyle={{
                        backgroundColor: '#f8fafc',
                        padding: '1.5rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      {selectedPost.content}
                    </SyntaxHighlighter>
                  </div>
                )}

                {selectedPost.file_url && (
                  <div className="mt-6">
                    <iframe
                      src={selectedPost.file_url}
                      title="File Preview"
                      className="w-full h-96 rounded-xl border border-sky-100 shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

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

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default PostsList;