import { useState } from 'react';
import { X, Upload, Sparkles, Loader, File as FileIcon, Link2 } from 'lucide-react';

export function UploadMaterialForm({ module, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    fileUrl: '',
    description: '',
    uploadMethod: 'file',
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  function populateDummyData() {
    const dummyData = {
      title: 'Neural Networks and Deep Learning - Comprehensive Guide',
      type: 'short_note',
      fileUrl: 'https://example.com/materials/neural-networks-guide.pdf',
      description: 'A comprehensive guide covering neural network architectures, backpropagation, and deep learning fundamentals with practical examples.',
      uploadMethod: 'url',
      file: null,
    };
    setFormData(dummyData);
    setErrors({});
  }

  function getValidFileExtensions(type) {
    switch (type) {
      case 'past_paper':
      case 'short_note':
        return ['pdf'];
      case 'kuppi_video':
        return ['mp4', 'webm', 'mov', 'avi', 'mkv'];
      default:
        return [];
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!formData.type) {
      newErrors.type = 'Please select a material type';
    }

    if (formData.uploadMethod === 'file') {
      if (!formData.file) {
        newErrors.file = 'Please select a file to upload';
      } else {
        const validExtensions = getValidFileExtensions(formData.type);
        const fileExtension = formData.file.name.split('.').pop()?.toLowerCase();

        if (!fileExtension || !validExtensions.includes(fileExtension)) {
          newErrors.file = `Only ${validExtensions.join(', ')} files are allowed`;
        }

        const maxSize = formData.type === 'kuppi_video' ? 500 * 1024 * 1024 : 50 * 1024 * 1024;
        if (formData.file.size > maxSize) {
          const maxSizeMB = maxSize / (1024 * 1024);
          newErrors.file = `File size must be less than ${maxSizeMB}MB`;
        }
      }
    } else {
      if (!formData.fileUrl.trim()) {
        newErrors.fileUrl = 'URL is required';
      } else if (!isValidUrl(formData.fileUrl)) {
        newErrors.fileUrl = 'Please enter a valid URL';
      } else if (formData.type === 'kuppi_video' && !isVideoUrl(formData.fileUrl)) {
        newErrors.fileUrl = 'Please enter a valid video URL (YouTube, Vimeo, etc.)';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!module) {
      alert('Please select a module first');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function isVideoUrl(url) {
    const videoPatterns = [
      /youtube\.com\/watch\?v=/,
      /youtu\.be\//,
      /vimeo\.com\//,
      /dailymotion\.com\//,
    ];
    return videoPatterns.some((pattern) => pattern.test(url));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData to send files and text data together
      const formDataToSend = new FormData();
      formDataToSend.append('module', module.code); // Save module code
      formDataToSend.append('title', formData.title);
      formDataToSend.append('materialType', formData.type);
      formDataToSend.append('uploadMethod', formData.uploadMethod);
      formDataToSend.append('description', formData.description);

      if (formData.uploadMethod === 'file' && formData.file) {
        formDataToSend.append('file', formData.file);
      } else {
        formDataToSend.append('url', formData.fileUrl);
      }

      // Send to our Node.js Backend
      const response = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
        // Note: Do NOT set 'Content-Type' manually when using FormData, 
        // the browser will automatically set it with the correct boundary
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        alert('Material uploaded successfully!');
        setFormData({
          title: '',
          type: '',
          fileUrl: '',
          description: '',
          uploadMethod: 'file',
          file: null,
        });
        setFileInputKey((prev) => prev + 1);
        onSuccess();
        onClose();
      } else {
        alert(data.message || 'Failed to save material.');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected server error occurred. Is your backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-t-4 border-primary-800">
        <div className="sticky top-0 bg-gradient-to-r from-primary-800 to-primary-700 text-white border-b-2 border-primary-600 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Upload className="w-6 h-6" />
            </div>
            Upload Study Material
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-primary-800 mb-2 font-medium">
                Save time during your presentation! Click the button below to instantly fill the form with realistic dummy data.
              </p>
              <button
                type="button"
                onClick={populateDummyData}
                className="bg-primary-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-900 transition-colors text-sm"
              >
                Populate Dummy Data
              </button>
            </div>
          </div>

          <div className="border-b border-primary-200 pb-4">
            <label className="block text-sm font-medium text-primary-900 mb-3 font-semibold">
              Upload Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, uploadMethod: 'file' });
                  setErrors({ ...errors, file: undefined, fileUrl: undefined });
                }}
                className={`p-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 font-medium ${
                  formData.uploadMethod === 'file'
                    ? 'border-primary-800 bg-primary-50 text-primary-800'
                    : 'border-primary-200 text-primary-600 hover:border-primary-400'
                }`}
              >
                <FileIcon className="w-5 h-5" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, uploadMethod: 'url' });
                  setErrors({ ...errors, file: undefined, fileUrl: undefined });
                }}
                className={`p-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 font-medium ${
                  formData.uploadMethod === 'url'
                    ? 'border-primary-800 bg-primary-50 text-primary-800'
                    : 'border-primary-200 text-primary-600 hover:border-primary-400'
                }`}
              >
                <Link2 className="w-5 h-5" />
                Paste URL
              </button>
            </div>
          </div>

          {module && (
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2 font-semibold">
                Module
              </label>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-800 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {module.code.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-primary-900">{module.code} - {module.name}</p>
                  <p className="text-sm text-primary-700">Year {module.year}, Semester {module.semester}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2 font-semibold">
              Material Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-primary-200'
              }`}
              placeholder="E.g., Past Paper 2023 - Final Exam"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2 font-semibold">
              Material Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.type ? 'border-red-500' : 'border-primary-200'
              }`}
            >
              <option value="">-- Select Type --</option>
              <option value="past_paper">Past Paper</option>
              <option value="short_note">Short Note</option>
              <option value="kuppi_video">Kuppi Video</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          </div>

          {formData.uploadMethod === 'file' ? (
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2 font-semibold">
                Select File <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    key={fileInputKey}
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, file });
                      if (file) {
                        setErrors({ ...errors, file: undefined });
                      }
                    }}
                    accept={
                      formData.type === 'kuppi_video'
                        ? 'video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska'
                        : 'application/pdf'
                    }
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-lg focus:outline-none transition-colors cursor-pointer ${
                      errors.file ? 'border-red-500 bg-red-50' : 'border-primary-300 hover:border-primary-500'
                    }`}
                  />
                </div>
                {formData.file && (
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 flex items-start gap-3">
                    <FileIcon className="w-5 h-5 text-primary-700 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-primary-900">{formData.file.name}</p>
                      <p className="text-primary-700">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
                {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                <p className="text-xs text-primary-600">
                  {formData.type === 'kuppi_video'
                    ? 'Supported formats: MP4, WebM, MOV, AVI, MKV (Max 500MB)'
                    : 'Supported format: PDF (Max 50MB)'}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2 font-semibold">
                File URL / Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.fileUrl ? 'border-red-500' : 'border-primary-200'
                }`}
                placeholder={
                  formData.type === 'kuppi_video'
                    ? '...'
                    : 'https://example.com/file.pdf'
                }
              />
              {errors.fileUrl && <p className="text-red-500 text-sm mt-1">{errors.fileUrl}</p>}
              <p className="text-xs text-primary-600 mt-1">
                {formData.type === 'kuppi_video'
                  ? 'Enter a valid video URL (YouTube, Vimeo, etc.)'
                  : 'Enter a direct link to the file'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2 font-semibold">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Provide a brief description of the material..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10 characters
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-800 text-white py-3 rounded-lg font-medium hover:bg-primary-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  {formData.uploadMethod === 'file' ? 'Uploading File...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Material
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-primary-300 text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}