import { useEffect, useState } from 'react';
import { BookOpen, ArrowLeft, ArrowRight, Loader, Search } from 'lucide-react';
import { ALL_MODULES } from '../data/modules';

export function ModuleList({ year, semester, onSelectModule, onBack }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadModules();
  }, [year, semester]);

  function loadModules() {
    setLoading(true);

    setTimeout(() => {
      const filtered = ALL_MODULES.filter(
        (module) => module.year === year && module.semester === semester
      );

      filtered.sort((a, b) => a.code.localeCompare(b.code));

      setModules(filtered);
      setLoading(false);
    }, 400);
  }

  const filteredModules = modules.filter((module) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return (
      module.code.toLowerCase().includes(query) ||
      module.name.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <Loader className="h-8 w-8 animate-spin text-primary-800" />
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200/80 px-6 py-6 sm:px-8">
        <div className="mb-4 inline-flex rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
          Step 3 of 4
        </div>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={onBack}
              className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
                <div className="rounded-2xl bg-primary-100 p-2.5">
                  <BookOpen className="h-6 w-6 text-primary-800" />
                </div>
                Year {year} - Semester {semester} Modules
              </h2>
              <p className="mt-2 text-slate-600">
                Open a module to browse resources or upload new material for your classmates.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 lg:min-w-[320px]">
            <Search className="h-4 w-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search modules by code or name"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-500">
            {filteredModules.length} module{filteredModules.length === 1 ? '' : 's'} found
          </p>
        </div>

        {filteredModules.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
            No modules match your search for this semester.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredModules.map((module) => (
              <button
                key={module.id}
                onClick={() => onSelectModule(module)}
                className="group rounded-[24px] border border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-800">
                    {module.code}
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-700" />
                </div>
                <div className="mt-5">
                  <h3 className="text-xl font-bold text-slate-900">{module.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    View study materials, organize uploads, and manage shared resources for this module.
                  </p>
                  <p className="mt-5 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                    Open module
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
