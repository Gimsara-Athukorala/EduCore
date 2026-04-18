import { ArrowRight, BookOpen, Layers3 } from 'lucide-react';

export function YearSelector({ selectedYear, onSelectYear }) {
  const years = [
    { value: 1, label: 'Foundation', description: 'Core concepts, programming basics, and computing fundamentals.' },
    { value: 2, label: 'Intermediate', description: 'Structured programming, web, and data-oriented modules.' },
    { value: 3, label: 'Advanced', description: 'Applied development modules with deeper technical focus.' },
    { value: 4, label: 'Final Year', description: 'Capstone-level content and senior subject collections.' },
  ];

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200/80 px-6 py-6 sm:px-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
          <Layers3 className="h-4 w-4" />
          Step 1 of 4
        </div>
        <h2 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
          <div className="rounded-2xl bg-primary-100 p-2.5">
            <BookOpen className="h-6 w-6 text-primary-800" />
          </div>
          Select Academic Year
        </h2>
        <p className="mt-2 text-slate-600">
          Choose the year that matches the study materials you want to browse.
        </p>
      </div>

      <div className="grid gap-5 px-6 py-6 md:grid-cols-2 xl:grid-cols-4 sm:px-8">
        {years.map((year) => (
          <button
            key={year.value}
            onClick={() => onSelectYear(year.value)}
            className={`group rounded-[24px] border p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
              selectedYear === year.value
                ? 'border-primary-400 bg-primary-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-primary-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 group-hover:bg-primary-100 group-hover:text-primary-800">
                Year {year.value}
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-700" />
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-slate-900">{year.label}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {year.description}
              </p>
              <p className="mt-5 inline-flex rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-800">
                Open year {year.value}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
