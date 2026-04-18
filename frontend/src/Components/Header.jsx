import { BookOpenCheck, FolderKanban, GraduationCap, Home, Search, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Header({ onGoHome, onBrowseMaterials, isLandingPage = false }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate('/');
    }
  };

  const handleBrowseMaterials = () => {
    if (onBrowseMaterials) {
      onBrowseMaterials();
    } else {
      navigate('/resources');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#0f1e4a] bg-[#172554] text-white shadow-lg shadow-slate-900/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          onClick={handleGoHome}
          className="flex min-w-0 items-center gap-3 rounded-2xl text-left transition-colors hover:bg-white/5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              Learning Management System
            </p>
            <h1 className="truncate text-lg font-bold text-white sm:text-xl">
              Study Material Repository
            </h1>
          </div>
        </button>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85">
            <span className="inline-flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              Organized by year, semester, and module
            </span>
          </div>
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85">
            <span className="inline-flex items-center gap-2">
              <BookOpenCheck className="h-4 w-4" />
              Fast access to notes, papers, and videos
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isLandingPage && (
            <button
              onClick={handleBrowseMaterials}
              className="hidden items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/15 sm:inline-flex"
            >
              <Search className="h-4 w-4" />
              Browse
            </button>
          )}
          <button
            onClick={() => navigate('/resources')}
            className="hidden items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/15 sm:inline-flex"
          >
            <BookOpen className="h-4 w-4" />
            Resources
          </button>
          <button
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/15"
          >
            <Home className="h-4 w-4" />
            Home
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
