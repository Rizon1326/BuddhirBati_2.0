import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, X, Eye, ArrowLeft, RefreshCw } from "lucide-react";
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

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilePreview, setShowFilePreview] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost/api/posts/${postId}`);
        setPost(response.data.post);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 max-w-lg w-full border border-blue-100">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent mb-4">
              Error Loading Post
            </h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl hover:from-blue-700 hover:to-sky-600 transition-all duration-200 font-medium"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 max-w-3xl w-full border border-blue-100">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-blue-200/50 rounded-xl w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-blue-200/50 rounded-xl"></div>
              <div className="h-4 bg-blue-200/50 rounded-xl w-5/6"></div>
              <div className="h-4 bg-blue-200/50 rounded-xl w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 py-12 px-4">
      <article className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 max-w-3xl mx-auto border border-blue-100">
        {/* Title with gradient underline */}
        <div className="mb-8">
          <AnimatedText text={post.title} className="text-4xl font-bold" />
          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-sky-400 rounded-full mt-4"></div>
        </div>

        {/* Content */}
        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap border-t border-blue-100 pt-6">
          {post.content}
        </div>

        {/* File Attachment Section */}
        {post.file_url && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl border border-blue-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                    Attached File
                  </h3>
                </div>

                {showFilePreview ? (
                  <div className="space-y-4">
                    <iframe
                      src={post.file_url}
                      title="File Preview"
                      className="w-full h-96 rounded-xl border border-blue-200 bg-white"
                    />
                    <button
                      onClick={() => setShowFilePreview(false)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-xl hover:from-red-700 hover:to-pink-600 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Close Preview
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 truncate">{post.file_name || "Preview File"}</span>
                    <button
                      onClick={() => setShowFilePreview(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-xl hover:from-blue-700 hover:to-sky-600 transition-all duration-200 font-medium flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      See More
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded-xl hover:from-gray-700 hover:to-gray-600 transition-all duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </article>
    </div>
  );
};

export default PostDetails;