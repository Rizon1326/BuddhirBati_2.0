import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Loader2, 
  AlertCircle,
  Check,
  X,
  Sparkles
} from 'lucide-react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [fileFormat, setFileFormat] = useState('.txt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const navigate = useNavigate();

  const fileFormats = [
    { value: '.txt', label: 'Text File (.txt)' },
    { value: '.cpp', label: 'C++ File (.cpp)' },
    { value: '.js', label: 'JavaScript File (.js)' },
    { value: '.java', label: 'Java File (.java)' },
    { value: '.c', label: 'C File (.c)' },
    { value: '.py', label: 'Python File (.py)' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (uploadedFile) => {
    setFile(uploadedFile);
    
    // Preview file content if it's a text file
    if (uploadedFile && uploadedFile.type.includes('text')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewContent(e.target.result);
      reader.readAsText(uploadedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title.trim()) {
      setError("Title is required.");
      setLoading(false);
      return;
    }

    if (!content.trim() && !file) {
      setError("Please provide either post content or upload a file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
      formData.append('fileFormat', fileFormat);
    }

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      };

      await axios.post('http://localhost/api/posts', formData, { headers });
      navigate('/posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="space-y-2 text-center">
            <img src="./rizu.png" alt="Logo" className="w-16 h-16 mb-4"/>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              It's time to share! Let's write a post.
            </h1>
            <p className="text-sky-600/70 flex items-center gap-2 justify-center">
              <Sparkles className="w-4 h-4" />
              Write what you think..
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="relative">
          {/* Animated border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl blur opacity-30"></div>
          
          {/* Card content */}
          <div className="relative rounded-xl bg-white/80 backdrop-blur-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="Enter a descriptive title"
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Post Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="5"
                  className="w-full px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="Share your thoughts..."
                />
              </div>

              {/* File Format Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  File Format
                </label>
                <select
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value)}
                  className="w-full px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-sky-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                >
                  {fileFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload Area */}
              <div
                className={`relative group rounded-lg transition-all duration-300 ${dragActive ? 'scale-[1.02]' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className={`relative rounded-lg p-8 transition-colors backdrop-blur-sm
                  ${file ? 'bg-white/80' : 'bg-white/60'}
                  ${dragActive ? 'bg-sky-50/80' : ''}`}
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {file ? (
                      <>
                        <Check className="h-8 w-8 text-sky-500" />
                        <div className="text-sm text-center">
                          <p className="font-medium text-sky-600">{file.name}</p>
                          <p className="text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Remove file
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-sky-400" />
                        <div className="text-sm text-center text-slate-600">
                          <p className="font-medium">Drag and drop your file here</p>
                          <p>or</p>
                          <label className="cursor-pointer text-sky-500 hover:text-sky-700 transition-colors">
                            browse files
                            <input
                              type="file"
                              onChange={(e) => handleFileChange(e.target.files[0])}
                              className="hidden"
                              accept={fileFormat}
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* File Preview */}
              {previewContent && (
                <div className="relative rounded-lg overflow-hidden">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg blur opacity-20"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="text-sm font-medium text-slate-700 mb-2">File Preview:</h3>
                    <pre className="text-sm text-slate-600 overflow-x-auto">
                      {previewContent.slice(0, 500)}
                      {previewContent.length > 500 && '...'}
                    </pre>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                  <button 
                    type="button"
                    onClick={() => setError('')}
                    className="ml-auto"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className={`relative flex items-center px-6 py-2 rounded-lg text-white font-medium
                    ${loading ? 'bg-sky-400' : 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600'}
                    transition-colors disabled:opacity-50`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Creating Post...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-5 w-5" />
                        Create Post
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
