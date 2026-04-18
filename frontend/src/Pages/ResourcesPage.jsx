import React, { useState, useEffect } from 'react';
import { BookOpen, Download, FileText, Video, FileAudio } from 'lucide-react';
import axios from '../lib/axios';
import Spinner from '../Components/Spinner';
import EmptyState from '../Components/EmptyState';

const API_ORIGIN =
  (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api\/v1\/?$|\/api\/?$/, '');

function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, typeFilter]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/materials');
      setResources(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resources');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(
        (resource) =>
          resource.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((resource) => resource.materialType === typeFilter);
    }

    setFilteredResources(filtered);
  };

  const getResourceUrl = (resource) => {
    if (!resource?.fileUrl) {
      return '';
    }

    if (/^https?:\/\//i.test(resource.fileUrl)) {
      return resource.fileUrl;
    }

    return `${API_ORIGIN}${resource.fileUrl.startsWith('/') ? '' : '/'}${resource.fileUrl}`;
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'kuppi_video':
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'audio':
        return <FileAudio className="h-5 w-5 text-purple-500" />;
      case 'past_paper':
      case 'short_note':
      case 'pdf':
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDownload = (resource) => {
    const resourceUrl = getResourceUrl(resource);
    if (!resourceUrl) {
      return;
    }

    if (resource.uploadMethod === 'url') {
      window.open(resourceUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const link = document.createElement('a');
    link.href = resourceUrl;
    link.download = resource.title || 'resource';
    link.click();
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'past_paper':
        return 'PAST PAPER';
      case 'short_note':
        return 'SHORT NOTE';
      case 'kuppi_video':
        return 'KUPPI VIDEO';
      default:
        return (type || 'RESOURCE').replace('_', ' ').toUpperCase();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100">
              <BookOpen className="h-6 w-6 text-primary-800" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Study Materials</h1>
              <p className="mt-2 text-slate-600">Browse all available resources across modules</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-primary-500 focus:outline-none"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-900 focus:border-primary-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="past_paper">Past Paper</option>
            <option value="short_note">Short Note</option>
            <option value="kuppi_video">Kuppi Video</option>
          </select>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <div
                key={resource._id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(resource.materialType)}
                      <h3 className="font-semibold text-slate-900">{resource.title}</h3>
                    </div>
                  </div>

                  {resource.description && (
                    <p className="mb-4 text-sm text-slate-600">{resource.description}</p>
                  )}

                  {resource.module && (
                    <div className="mb-4">
                      <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800">
                        {resource.module}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {getTypeLabel(resource.materialType)}
                    </span>
                    <button
                      onClick={() => handleDownload(resource)}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-1 text-sm font-medium text-primary-800 transition-colors hover:bg-primary-100"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No resources found"
            description={searchTerm ? 'Try adjusting your search filters' : 'No study materials available yet'}
          />
        )}
      </div>
    </div>
  );
}

export default ResourcesPage;
