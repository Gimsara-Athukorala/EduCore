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
      const formDataToSend = new FormData();
      formDataToSend.append('module', module.code);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('materialType', formData.type);
      formDataToSend.append('uploadMethod', formData.uploadMethod);
      formDataToSend.append('description', formData.description);

      if (formData.uploadMethod === 'file' && formData.file) {
        formDataToSend.append('file', formData.file);
      } else {
        formDataToSend.append('url', formData.fileUrl);
      }

      const response = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/70 bg-white shadow-2xl shadow-slate-900/20">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary-700 bg-[linear-gradient(135deg,_#172554_0%,_#1e3a8a_100%)] p-6 text-white">
          <h2 className="flex items-center gap-3 text-2xl font-bold">
            <div className="rounded-2xl bg-white/15 p-2">
              <Upload className="h-6 w-6" />
            </div>
            Upload Study Material
          </h2>
          <button
            onClick={onClose}
            className="rounded-xl p-2 transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          <div className="flex items-start gap-3 rounded-2xl border border-primary-200 bg-primary-50 p-4">
            <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-700" />
            <div className="flex-1">
              <p className="mb-2 text-sm font-medium text-primary-800">
                Save time during your presentation! Click the button below to instantly fill the form with realistic dummy data.
              </p>
              <button
                type="button"
                onClick={populateDummyData}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
              >
                Populate Dummy Data
              </button>
            </div>
          </div>

          <div className="grid gap-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Upload options
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Add a new resource to this module
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose whether you want to upload a local file or share an external resource link.
              </p>
            </div>

            {module && (
              <div className="rounded-[20px] border border-primary-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
                  Selected module
                </p>
                <p className="mt-3 text-lg font-bold text-slate-900">{module.code}</p>
                <p className="mt-1 text-sm font-medium text-slate-600">{module.name}</p>
                <p className="mt-3 text-sm text-slate-500">
                  Year {module.year}, Semester {module.semester}
                </p>
              </div>
            )}
          </div>

          <div className="border-b border-primary-200 pb-4">
            <label className="mb-3 block text-sm font-semibold text-primary-900">
              Upload Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, uploadMethod: 'file' });
                  setErrors({ ...errors, file: undefined, fileUrl: undefined });
                }}
                className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-4 font-medium transition-colors ${
                  formData.uploadMethod === 'file'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-primary-200 bg-white text-primary-600 hover:border-emerald-300 hover:bg-emerald-50/40'
                }`}
              >
                <FileIcon className="h-5 w-5" />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, uploadMethod: 'url' });
                  setErrors({ ...errors, file: undefined, fileUrl: undefined });
                }}
                className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-4 font-medium transition-colors ${
                  formData.uploadMethod === 'url'
                    ? 'border-violet-500 bg-violet-50 text-violet-800'
                    : 'border-primary-200 bg-white text-primary-600 hover:border-violet-300 hover:bg-violet-50/40'
                }`}
              >
                <Link2 className="h-5 w-5" />
                Paste URL
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-primary-900">
              Material Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full rounded-2xl border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500 ${
                errors.title ? 'border-red-500' : 'border-primary-200'
              }`}
              placeholder="E.g., Past Paper 2023 - Final Exam"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-primary-900">
              Material Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className={`w-full rounded-2xl border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500 ${
                errors.type ? 'border-red-500' : 'border-primary-200'
              }`}
            >
              <option value="">-- Select Type --</option>
              <option value="past_paper">Past Paper</option>
              <option value="short_note">Short Note</option>
              <option value="kuppi_video">Kuppi Video</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
          </div>

          {formData.uploadMethod === 'file' ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-primary-900">
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
                    className={`w-full cursor-pointer rounded-2xl border-2 border-dashed px-4 py-4 transition-colors focus:outline-none ${
                      errors.file ? 'border-red-500 bg-red-50' : 'border-primary-300 hover:border-primary-500'
                    }`}
                  />
                </div>
                {formData.file && (
                  <div className="flex items-start gap-3 rounded-2xl border border-primary-200 bg-primary-50 p-3">
                    <FileIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-700" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-primary-900">{formData.file.name}</p>
                      <p className="text-primary-700">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
                {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
                <p className="text-xs text-primary-600">
                  {formData.type === 'kuppi_video'
                    ? 'Supported formats: MP4, WebM, MOV, AVI, MKV (Max 500MB)'
                    : 'Supported format: PDF (Max 50MB)'}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-semibold text-primary-900">
                File URL / Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                className={`w-full rounded-2xl border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500 ${
                  errors.fileUrl ? 'border-red-500' : 'border-primary-200'
                }`}
                placeholder={
                  formData.type === 'kuppi_video'
                    ? 'https://youtube.com/watch?v=...'
                    : 'https://example.com/file.pdf'
                }
              />
              {errors.fileUrl && <p className="mt-1 text-sm text-red-500">{errors.fileUrl}</p>}
              <p className="mt-1 text-xs text-primary-600">
                {formData.type === 'kuppi_video'
                  ? 'Enter a valid video URL (YouTube, Vimeo, etc.)'
                  : 'Enter a direct link to the file'}
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-primary-900">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full rounded-2xl border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500 ${
                errors.description ? 'border-red-500' : 'border-primary-200'
              }`}
              placeholder="Provide a brief description of the material..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            <p className="mt-1 text-xs text-slate-500">
              Minimum 10 characters
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  {formData.uploadMethod === 'file' ? 'Uploading File...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Upload Material
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-amber-300 bg-amber-50 px-6 py-3 font-medium text-amber-800 transition-colors hover:bg-amber-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
