import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  FolderKanban,
  GraduationCap,
  Layers3,
  Loader,
  Sparkles,
  Video,
} from 'lucide-react';
import { ALL_MODULES } from '../data/modules';

export function LandingDashboard({ onBrowseMaterials }) {
  const [materialStats, setMaterialStats] = useState({
    total: 0,
    pastPapers: 0,
    shortNotes: 0,
    kuppiVideos: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setStatsLoading(true);

      try {
        const response = await fetch('http://localhost:5000/api/materials');
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok && Array.isArray(data)) {
          setMaterialStats({
            total: data.length,
            pastPapers: data.filter((material) => material.materialType === 'past_paper').length,
            shortNotes: data.filter((material) => material.materialType === 'short_note').length,
            kuppiVideos: data.filter((material) => material.materialType === 'kuppi_video').length,
          });
        }
      } catch (error) {
        console.error('Landing stats error:', error);
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const overviewStats = useMemo(() => {
    const years = new Set(ALL_MODULES.map((module) => module.year));
    const semesterPairs = new Set(ALL_MODULES.map((module) => `${module.year}-${module.semester}`));

    return [
      {
        label: 'Academic years',
        value: years.size,
        helper: 'Structured by year',
        icon: GraduationCap,
        accent: 'bg-primary-100 text-primary-800',
      },
      {
        label: 'Module collections',
        value: ALL_MODULES.length,
        helper: 'Across all listed modules',
        icon: FolderKanban,
        accent: 'bg-emerald-100 text-emerald-700',
      },
      {
        label: 'Year-semester groups',
        value: semesterPairs.size,
        helper: 'Organized browsing paths',
        icon: Layers3,
        accent: 'bg-amber-100 text-amber-700',
      },
      {
        label: 'Uploaded materials',
        value: statsLoading ? '...' : materialStats.total,
        helper: statsLoading ? 'Checking repository' : 'Currently available resources',
        icon: BookOpen,
        accent: 'bg-violet-100 text-violet-700',
      },
    ];
  }, [materialStats.total, statsLoading]);

  const features = [
    {
      title: 'Past Papers',
      description: 'Find revision-ready papers quickly when preparing for exams and continuous assessments.',
      icon: FileText,
      accent: 'bg-primary-100 text-primary-800',
      value: statsLoading ? '...' : materialStats.pastPapers,
    },
    {
      title: 'Short Notes',
      description: 'Access concise study notes for module concepts, quick review, and last-minute preparation.',
      icon: BookOpen,
      accent: 'bg-emerald-100 text-emerald-700',
      value: statsLoading ? '...' : materialStats.shortNotes,
    },
    {
      title: 'Kuppi Videos',
      description: 'Open recorded explanations and external study links grouped by the correct module.',
      icon: Video,
      accent: 'bg-violet-100 text-violet-700',
      value: statsLoading ? '...' : materialStats.kuppiVideos,
    },
    {
      title: 'Module-Based Browsing',
      description: 'Move from year to semester to module so students can find materials without confusion.',
      icon: FolderKanban,
      accent: 'bg-amber-100 text-amber-700',
      value: ALL_MODULES.length,
    },
  ];

  const highlightedModules = ALL_MODULES.slice(0, 4);
  const steps = [
    'Start at the repository home page and choose Browse Materials.',
    'Select your academic year and then the semester you are studying.',
    'Open the module you need to view notes, papers, and video resources.',
    'Upload, edit, or manage resources once you reach the module dashboard.',
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-10 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-10">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-700">
              <Sparkles className="h-4 w-4" />
              Student learning portal
            </div>
            <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find the right study materials without digging through folders.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Browse past papers, short notes, and kuppi videos through a clean year-to-module flow built for students.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onBrowseMaterials}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-800 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary-900"
              >
                Browse Materials
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-2xl border border-primary-200 bg-primary-50 px-6 py-3.5 font-semibold text-primary-800 transition-colors hover:bg-primary-100"
              >
                How It Works
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {overviewStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{item.label}</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.helper}</p>
                      </div>
                      <div className={`rounded-2xl p-3 ${item.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] bg-[linear-gradient(135deg,_#172554_0%,_#1e3a8a_60%,_#2563eb_100%)] p-6 text-white shadow-xl shadow-primary-900/15">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Quick overview
            </p>
            <h3 className="mt-3 text-2xl font-bold">
              Everything stays organized around how students actually study.
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/80">
              The repository is designed to keep resources easy to discover, easy to revisit, and easy to contribute to later from each module dashboard.
            </p>

            <div className="mt-6 space-y-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`rounded-2xl p-2.5 ${feature.accent}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{feature.title}</p>
                          <p className="mt-1 text-sm leading-6 text-white/75">{feature.description}</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-white">
                        {feature.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
              <p className="text-sm font-semibold text-emerald-100">Contribution note</p>
              <p className="mt-1 text-sm leading-6 text-white/80">
                Uploading still happens from inside a module dashboard, so every new resource is stored in the correct place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Featured modules
          </p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            Start with commonly used module collections
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {highlightedModules.map((module) => (
              <div key={module.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-800">
                  {module.code}
                </p>
                <h4 className="mt-4 text-lg font-bold text-slate-900">{module.name}</h4>
                <p className="mt-2 text-sm text-slate-600">
                  Year {module.year}, Semester {module.semester}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          id="how-it-works"
          className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            How it works
          </p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            A simple four-step flow from home to materials
          </h3>
          <div className="mt-6 space-y-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-800 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-6 text-slate-600">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-4">
            <div className="flex items-center gap-3">
              {statsLoading && <Loader className="h-4 w-4 animate-spin text-primary-700" />}
              <p className="text-sm font-medium text-primary-800">
                {statsLoading
                  ? 'Loading repository snapshot...'
                  : `Repository snapshot: ${materialStats.total} total materials currently indexed.`}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
