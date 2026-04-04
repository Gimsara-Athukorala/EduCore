import { useEffect, useState } from 'react';
import { ArrowLeft, FileText, BookOpen, Video, ExternalLink, Loader, Upload, Trash2, Pencil } from 'lucide-react';
// Import the Edit Modal we created
import { EditMaterialModal } from './EditMaterialModal'; 

export function ModuleDashboard({ module, onBack, onUpload, refreshTrigger }) {
  const [activeTab, setActiveTab] = useState('past_papers');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State to handle which material is being edited
  const [editingMaterial, setEditingMaterial] = useState(null);

  useEffect(() => {
    loadMaterials();
  }, [module.code, refreshTrigger]);

  // Function to load all materials from our Node.js Backend
  async function loadMaterials() {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/materials');
      const data = await response.json();

      if (response.ok) {
        // Filter materials that belong to this specific module code (e.g., IT1010)
        const currentModuleMaterials = data.filter(m => m.module === module.code);
        setMaterials(currentModuleMaterials);
      } else {
        console.error('Failed to fetch materials:', data.message);
      }
    } catch (error) {
      console.error('Backend connection error:', error);
    }
    setLoading(false);
  }

  // Delete Function (CRUD - Delete)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study material?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/materials/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Reload list after deleting
        loadMaterials();
      } else {
        alert("Failed to delete the material.");
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Logic to filter materials based on the selected tab
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

  // Helper function to resolve file path for local uploads or external links
  const getFileUrl = (url) => {
    if (url && url.startsWith('/uploads')) {
      return `http://localhost:5000${url}`;
    }
    return url;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-primary-800">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-700 text-white p-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-4xl font-bold">{module.code}</h1>
            <p className="text-primary-100 mt-2 font-medium">{module.name}</p>
          </div>
        </div>
        <button
          onClick={onUpload}
          className="bg-white text-primary-800 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Material
        </button>
      </div>

      {/* Tabs Section */}
      <div className="border-b-2 border-primary-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? `text-primary-800 border-b-4 border-primary-800 bg-primary-50`
                    : 'text-primary-600 hover:text-primary-800 hover:bg-primary-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Materials List Section */}
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-primary-800 animate-spin" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-primary-300 mb-4">
              {activeTab === 'past_papers' && <FileText className="w-16 h-16 mx-auto mb-4" />}
              {activeTab === 'short_notes' && <BookOpen className="w-16 h-16 mx-auto mb-4" />}
              {activeTab === 'kuppi_videos' && <Video className="w-16 h-16 mx-auto mb-4" />}
            </div>
            <p className="text-primary-600 font-medium">
              No {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map((material) => (
              <div key={material._id} className="relative group">
                <a
                  href={getFileUrl(material.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      {material.materialType === 'past_paper' && <FileText className="w-5 h-5 text-primary-800" />}
                      {material.materialType === 'short_note' && <BookOpen className="w-5 h-5 text-primary-700" />}
                      {material.materialType === 'kuppi_video' && <Video className="w-5 h-5 text-primary-700" />}
                    </div>
                    <ExternalLink className="w-4 h-4 text-primary-400 group-hover:text-primary-700" />
                  </div>
                  <h3 className="font-bold text-primary-900 mb-2 group-hover:text-primary-700 pr-12">
                    {material.title}
                  </h3>
                  <p className="text-sm text-primary-700 line-clamp-2">
                    {material.description}
                  </p>
                </a>
                
                {/* Action Buttons: Edit & Delete (Visible on hover) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Edit Button */}
                  <button 
                    onClick={() => setEditingMaterial(material)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Edit Details"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(material._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete Material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render the Edit Modal when a material is selected for editing */}
      {editingMaterial && (
        <EditMaterialModal 
          material={editingMaterial} 
          onClose={() => setEditingMaterial(null)} 
          onSuccess={() => {
            setEditingMaterial(null);
            loadMaterials(); // Refresh list to show updated details
          }}
        />
      )}
    </div>
  );
}