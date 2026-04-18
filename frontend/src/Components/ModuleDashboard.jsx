import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  FileText,
  BookOpen,
  Video,
  ExternalLink,
  Loader,
  Upload,
  Trash2,
  Pencil,
  Library,
} from 'lucide-react';
import { EditMaterialModal } from './EditMaterialModal';

export function ModuleDashboard({ module, onBack, onUpload, refreshTrigger }) {
  const [activeTab, setActiveTab] = useState('past_papers');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMaterial, setEditingMaterial] = useState(null);

  useEffect(() => {
    loadMaterials();
  }, [module.code, refreshTrigger]);

  async function loadMaterials() {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/materials');
      const data = await response.json();

      if (response.ok) {
        const currentModuleMaterials = data.filter((material) => material.module === module.code);
        setMaterials(currentModuleMaterials);
      } else {
        console.error('Failed to fetch materials:', data.message);
      }
    } catch (error) {
      console.error('Backend connection error:', error);
    }
    setLoading(false);
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study material?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/materials/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadMaterials();
      } else {
        alert('Failed to delete the material.');
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredMaterials = materials.filter((material) => {
    if (activeTab === 'past_papers') return material.materialType === 'past_paper';
    if (activeTab === 'short_notes') return material.materialType === 'short_note';
    if (activeTab === 'kuppi_videos') return material.materialType === 'kuppi_video';
    return false;
  });

  const tabs = [
    { id: 'past_papers', label: 'Past Papers', icon: FileText },
    { id: 'short_notes', label: 'Short Notes', icon: BookOpen },
    { id: 'kuppi_videos', label: 'Kuppi Videos', icon: Video },
  ];

  const materialTypeLabelMap = {
    past_paper: 'Past Papers',
    short_note: 'Short Notes',
    kuppi_video: 'Kuppi Videos',
  };

  const getFileUrl = (url) => {
    if (url && url.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  const materialCounts = {
    total: materials.length,
    past_papers: materials.filter((material) => material.materialType === 'past_paper').length,
    short_notes: materials.filter((material) => material.materialType === 'short_note').length,
    kuppi_videos: materials.filter((material) => material.materialType === 'kuppi_video').length,
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200/20 bg-[linear-gradient(135deg,_#172554_0%,_#1e3a8a_55%,_#2563eb_100%)] px-6 py-8 text-white sm:px-8">
        <div className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white/90">
          Step 4 of 4
        </div>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={onBack}
              className="rounded-xl border border-amber-200/50 bg-amber-400/15 p-3 text-amber-50 transition-colors hover:bg-amber-400/25"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                Module dashboard
              </p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{module.code}</h2>
              <p className="mt-2 max-w-2xl text-base text-white/85">{module.name}</p>
              <p className="mt-4 text-sm text-white/70">
                View, edit, and upload study materials grouped by resource type.
              </p>
            </div>
          </div>
          <button
            onClick={onUpload}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 font-semibold text-emerald-950 transition-colors hover:bg-emerald-300"
          >
            <Upload className="h-4 w-4" />
            Upload Material
          </button>
        </div>
      </div>

      <div className="grid gap-4 border-b border-slate-200 bg-slate-50/70 px-6 py-5 sm:grid-cols-2 xl:grid-cols-4 sm:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Total materials</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{materialCounts.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Past papers</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{materialCounts.past_papers}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Short notes</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{materialCounts.short_notes}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Kuppi videos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{materialCounts.kuppi_videos}</p>
        </div>
      </div>

      <div className="border-b border-slate-200 px-4 py-4 sm:px-8">
        <div className="grid gap-3 md:grid-cols-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-800 text-white shadow-lg shadow-primary-900/15'
                    : 'bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-8 sm:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="h-8 w-8 animate-spin text-primary-800" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <div className="mb-4 text-primary-300">
              {activeTab === 'past_papers' && <FileText className="mx-auto mb-4 h-16 w-16" />}
              {activeTab === 'short_notes' && <BookOpen className="mx-auto mb-4 h-16 w-16" />}
              {activeTab === 'kuppi_videos' && <Video className="mx-auto mb-4 h-16 w-16" />}
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No resources in this section yet
            </h3>
            <p className="mt-2 font-medium text-slate-600">
              No {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()} available yet.
            </p>
            <button
              onClick={onUpload}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              <Upload className="h-4 w-4" />
              Add the first resource
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredMaterials.map((material) => (
              <div
                key={material._id}
                className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-primary-100 p-3">
                      {material.materialType === 'past_paper' && <FileText className="h-5 w-5 text-primary-800" />}
                      {material.materialType === 'short_note' && <BookOpen className="h-5 w-5 text-primary-700" />}
                      {material.materialType === 'kuppi_video' && <Video className="h-5 w-5 text-primary-700" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {material.uploadMethod === 'file' ? 'Uploaded file' : 'External link'}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {material.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingMaterial(material)}
                      className="rounded-xl bg-sky-100 p-2.5 text-sky-700 transition-colors hover:bg-sky-200"
                      title="Edit Details"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(material._id)}
                      className="rounded-xl bg-red-50 p-2.5 text-red-600 transition-colors hover:bg-red-100"
                      title="Delete Material"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {material.description}
                </p>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                    <Library className="h-4 w-4" />
                    {materialTypeLabelMap[material.materialType] || 'Study Material'}
                  </div>

                  <a
                    href={getFileUrl(material.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-800 transition-colors hover:bg-violet-200"
                  >
                    Open
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingMaterial && (
        <EditMaterialModal
          material={editingMaterial}
          onClose={() => setEditingMaterial(null)}
          onSuccess={() => {
            setEditingMaterial(null);
            loadMaterials();
          }}
        />
      )}
    </div>
  );
}
