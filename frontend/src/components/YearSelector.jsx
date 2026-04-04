import { BookOpen } from 'lucide-react';

export function YearSelector({ selectedYear, onSelectYear }) {
  const years = [1, 2, 3, 4];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary-800">
      <h2 className="text-3xl font-bold text-primary-900 mb-8 flex items-center gap-3">
        <div className="bg-primary-100 p-2 rounded-lg">
          <BookOpen className="w-6 h-6 text-primary-800" />
        </div>
        Select Academic Year
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            className={`p-8 rounded-xl border-2 transition-all duration-300 hover:scale-105 font-semibold ${
              selectedYear === year
                ? 'border-primary-800 bg-primary-50 shadow-xl text-primary-900'
                : 'border-primary-200 bg-white hover:border-primary-400 text-primary-700 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl font-bold mb-3">
                Year {year}
              </div>
              <div className="text-sm font-medium">
                {year === 1 && 'Foundation'}
                {year === 2 && 'Intermediate'}
                {year === 3 && 'Advanced'}
                {year === 4 && 'Final Year'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}