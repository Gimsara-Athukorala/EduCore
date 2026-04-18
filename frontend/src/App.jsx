import { useState } from 'react';
import { YearSelector } from './components/YearSelector';
import { SemesterSelector } from './components/SemesterSelector';
import { ModuleList } from './components/ModuleList';
import { ModuleDashboard } from './components/ModuleDashboard';
import { UploadMaterialForm } from './components/UploadMaterialForm';
import { LandingDashboard } from './components/LandingDashboard';
import Header from './components/Header';

function App() {
  const [viewState, setViewState] = useState({ type: 'landing' });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleGoHome() {
    setShowUploadForm(false);
    setCurrentModule(null);
    setViewState({ type: 'landing' });
  }

  function handleStartBrowsing() {
    setViewState({ type: 'year-selection' });
  }

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

  function handleBackToLanding() {
    setViewState({ type: 'landing' });
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

  function getStepState() {
    if (viewState.type === 'year-selection') {
      return {
        title: 'Choose your academic path',
        description: 'Start by selecting the academic year, then narrow down to the semester and module you need.',
        activeStep: 1,
      };
    }

    if (viewState.type === 'semester-selection') {
      return {
        title: `Year ${viewState.year} selected`,
        description: 'Pick the semester to see the relevant module collection for this year.',
        activeStep: 2,
      };
    }

    if (viewState.type === 'module-list') {
      return {
        title: `Year ${viewState.year}, Semester ${viewState.semester}`,
        description: 'Open a module to browse materials or upload new content for your team.',
        activeStep: 3,
      };
    }

    return {
      title: `${viewState.module.code} material dashboard`,
      description: 'Browse the available resources by type, then upload, edit, or remove materials as needed.',
      activeStep: 4,
    };
  }

  const steps = ['Year', 'Semester', 'Module', 'Materials'];
  const showProgressShell = viewState.type !== 'landing';
  const stepState = showProgressShell ? getStepState() : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(30,58,138,0.12),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_100%)]">
      <Header
        onGoHome={handleGoHome}
        onBrowseMaterials={handleStartBrowsing}
        isLandingPage={viewState.type === 'landing'}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {showProgressShell && (
          <section className="mb-8 overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.35fr_0.85fr] lg:px-8">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary-700">
                  Shared student workspace
                </div>
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {stepState.title}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  {stepState.description}
                </p>
              </div>

              <div className="rounded-3xl border border-primary-100 bg-slate-50/90 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Progress
                </p>
                <div className="mt-4 grid gap-3">
                  {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepState.activeStep === stepNumber;
                    const isComplete = stepState.activeStep > stepNumber;

                    return (
                      <div
                        key={step}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                          isActive
                            ? 'border-primary-200 bg-primary-50 text-primary-900'
                            : isComplete
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                              : 'border-slate-200 bg-white text-slate-500'
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                            isActive
                              ? 'bg-primary-800 text-white'
                              : isComplete
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {stepNumber}
                        </div>
                        <div>
                          <p className="font-semibold">{step}</p>
                          <p className="text-sm opacity-80">
                            {stepNumber === 1 && 'Select the year'}
                            {stepNumber === 2 && 'Choose the semester'}
                            {stepNumber === 3 && 'Open the module'}
                            {stepNumber === 4 && 'Manage resources'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {viewState.type === 'landing' && (
          <LandingDashboard onBrowseMaterials={handleStartBrowsing} />
        )}

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
            onBack={handleBackToLanding}
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

      <footer className="border-t border-[#0f1e4a] bg-[#172554] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-white/75 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="font-medium text-white">
            Learning Management System - Study Material Repository
          </p>
          <p>BSc (Hons) in Information Technology</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
