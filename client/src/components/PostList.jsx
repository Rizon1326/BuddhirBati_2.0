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
  const navigate = useNavigate();

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

  const getRandomColor = () => {
    const colors = [
      'from-pink-500/20 to-purple-500/20',
      'from-blue-500/20 to-cyan-500/20',
      'from-green-500/20 to-emerald-500/20',
      'from-yellow-500/20 to-orange-500/20',
      'from-indigo-500/20 to-violet-500/20',
      'from-rose-500/20 to-pink-500/20'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-sky-600" />
          <p className="text-sky-600 font-medium">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              Posts Collection
            </h1>
            <p className="text-sky-600/70">Discover and share knowledge</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sky-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 shadow-sm border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            <button
              onClick={() => navigate('/create-post')}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              {/* <span className="hidden md:inline">New Post</span> */}
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="group relative rounded-xl transition-all duration-500 hover:scale-105"
            >
              {/* Animated border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-300 animate-gradient-xy"></div>
              
              {/* Card content */}
              <div className="relative rounded-xl bg-gradient-to-br from-white/60 to-white/95 backdrop-blur-sm">
                <div className="p-6 space-y-4">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getRandomColor()} rounded-xl opacity-40`}></div>
                  
                  {/* Content */}
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                        {post.title}
                      </h3>
                      {post.file_url && (
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="p-2 hover:bg-white/50 rounded-full transition-colors"
                        >
                          <FileText className="w-5 h-5 text-sky-500" />
                        </button>
                      )}
                    </div>
                    
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-sky-500" />
                        <span className="truncate max-w-[150px]">{post.author_email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-sky-500" />
                        <span>{formatDateTime(post.createdAt)}</span>
                      </div>
                      
                    </div>
                  </div>

                  {/* Code Content */}
                  {post.content && (
                    <div className="relative rounded-lg overflow-hidden max-h-48">
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
                      <SyntaxHighlighter
                        language="javascript"
                        style={coy}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          background: 'rgba(248, 250, 252, 0.8)',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                        }}
                      >
                        {post.content}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {selectedPost.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-sky-500" />
                        {formatDateTime(selectedPost.createdAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-sky-500" />
                        {selectedPost.author_email}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 hover:bg-sky-50 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedPost.content && (
                    <SyntaxHighlighter
                      language="javascript"
                      style={coy}
                      customStyle={{
                        margin: 0,
                        padding: '1.25rem',
                        background: 'rgba(248, 250, 252, 0.8)',
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                        lineHeight: 1.5
                      }}
                    >
                      {selectedPost.content}
                    </SyntaxHighlighter>
                  )}

                  {selectedPost.file_url && (
                    <iframe
                      src={selectedPost.file_url}
                      title="File Preview"
                      className="w-full h-96 rounded-lg border border-sky-200"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes gradient-xy {
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

        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default PostsList;