import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

export function SemesterSelector({
  year,
  selectedSemester,
  onSelectSemester,
  onBack,
}) {
  const semesters = [1, 2];

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200/80 px-6 py-6 sm:px-8">
        <div className="mb-4 inline-flex rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
          Step 2 of 4
        </div>
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="rounded-xl border border-slate-200 p-3 text-slate-700 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
              <div className="rounded-2xl bg-primary-100 p-2.5">
                <Calendar className="h-6 w-6 text-primary-800" />
              </div>
              Year {year} - Select Semester
            </h2>
            <p className="mt-2 text-slate-600">
              Choose the semester to view the modules and materials available in this year.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 px-6 py-6 md:grid-cols-2 sm:px-8">
        {semesters.map((semester) => (
          <button
            key={semester}
            onClick={() => onSelectSemester(semester)}
            className={`group rounded-[24px] border p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
              selectedSemester === semester
                ? 'border-primary-400 bg-primary-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-primary-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 group-hover:bg-primary-100 group-hover:text-primary-800">
                Semester {semester}
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-700" />
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-slate-900">
                {semester === 1 ? 'January to June' : 'July to December'}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {semester === 1
                  ? 'Browse first-semester modules, notes, past papers, and revision resources.'
                  : 'Open second-semester content and manage uploaded study materials.'}
              </p>
              <p className="mt-5 inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-800">
                Open semester {semester}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
