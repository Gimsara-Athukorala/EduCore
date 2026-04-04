import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { YearSelector } from './components/YearSelector';
import { SemesterSelector } from './components/SemesterSelector';
import { ModuleList } from './components/ModuleList';
import { ModuleDashboard } from './components/ModuleDashboard';
import { UploadMaterialForm } from './components/UploadMaterialForm';

function App() {
  const [viewState, setViewState] = useState({ type: 'year-selection' });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleSelectYear(year) {
    setViewState({ type: 'semester-selection', year });
  }

  function handleSelectSemester(semester) {
    if (viewState.type === 'semester-selection') {
      setViewState({ type: 'module-list', year: viewState.year, semester });
    }
  }

  function handleSelectModule(module) {
    setCurrentModule(module);
    setViewState({ type: 'module-dashboard', module });
  }

  function handleBackToYears() {
    setViewState({ type: 'year-selection' });
  }

  function handleBackToSemesters() {
    if (viewState.type === 'module-list') {
      setViewState({ type: 'semester-selection', year: viewState.year });
    }
  }

  function handleBackToModules() {
    if (viewState.type === 'module-dashboard') {
      const module = viewState.module;
      setViewState({ type: 'module-list', year: module.year, semester: module.semester });
    }
  }

  function handleOpenUpload() {
    setShowUploadForm(true);
  }

  function handleCloseUpload() {
    setShowUploadForm(false);
  }

  function handleUploadSuccess() {
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <header className="bg-white shadow-md border-b-4 border-primary-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary-800 p-3 rounded-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-900">Study Material Repository</h1>
              <p className="text-primary-600 text-sm mt-1 font-medium">
                Access Past Papers, Short Notes, and Kuppi Videos
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {viewState.type === 'year-selection' && (
          <YearSelector
            selectedYear={null}
            onSelectYear={handleSelectYear}
          />
        )}

        {viewState.type === 'semester-selection' && (
          <SemesterSelector
            year={viewState.year}
            selectedSemester={null}
            onSelectSemester={handleSelectSemester}
            onBack={handleBackToYears}
          />
        )}

        {viewState.type === 'module-list' && (
          <ModuleList
            year={viewState.year}
            semester={viewState.semester}
            onSelectModule={handleSelectModule}
            onBack={handleBackToSemesters}
          />
        )}

        {viewState.type === 'module-dashboard' && (
          <ModuleDashboard
            module={viewState.module}
            onBack={handleBackToModules}
            onUpload={handleOpenUpload}
            refreshTrigger={refreshTrigger}
          />
        )}
      </main>

      {showUploadForm && (
        <UploadMaterialForm
          module={currentModule}
          onClose={handleCloseUpload}
          onSuccess={handleUploadSuccess}
        />
      )}

      <footer className="mt-16 bg-primary-900 border-t-4 border-primary-800">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-primary-100 text-sm">
          <p className="font-medium">Learning Management System - Study Material Repository</p>
          <p className="mt-2">BSc (Hons) in Information Technology</p>
        </div>
      </footer>
    </div>
  );
}

export default App;