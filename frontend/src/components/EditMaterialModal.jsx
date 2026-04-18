import { useState } from 'react';
import { X, Save, Loader } from 'lucide-react';

export function EditMaterialModal({ material, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: material.title,
    description: material.description,
    materialType: material.materialType
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/materials/${material._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Updated successfully!');
        onSuccess();
      } else {
        alert('Failed to update.');
      }
    } catch (error) {
      console.error('Error updating:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-white/70 bg-white shadow-2xl shadow-slate-900/20">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
              Update resource
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Edit Material Details</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Type</label>
            <select
              value={formData.materialType}
              onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="past_paper">Past Paper</option>
              <option value="short_note">Short Note</option>
              <option value="kuppi_video">Kuppi Video</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-semibold text-amber-800 hover:bg-amber-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
