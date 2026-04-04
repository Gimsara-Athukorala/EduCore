import { Calendar, ArrowLeft } from 'lucide-react';

export function SemesterSelector({
  year,
  selectedSemester,
  onSelectSemester,
  onBack,
}) {
  const semesters = [1, 2];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary-800">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-primary-700" />
        </button>
        <h2 className="text-3xl font-bold text-primary-900 flex items-center gap-3">
          <div className="bg-primary-100 p-2 rounded-lg">
            <Calendar className="w-6 h-6 text-primary-800" />
          </div>
          Year {year} - Select Semester
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {semesters.map((semester) => (
          <button
            key={semester}
            onClick={() => onSelectSemester(semester)}
            className={`p-8 rounded-xl border-2 transition-all duration-300 hover:scale-105 font-semibold ${
              selectedSemester === semester
                ? 'border-primary-800 bg-primary-50 shadow-xl text-primary-900'
                : 'border-primary-200 bg-white hover:border-primary-400 text-primary-700 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl font-bold mb-3">
                Semester {semester}
              </div>
              <div className="text-sm font-medium text-primary-600">
                {semester === 1 ? 'January - June' : 'July - December'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}