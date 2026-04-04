import { useEffect, useState } from 'react';
import { BookOpen, ArrowLeft, Loader } from 'lucide-react';


const ALL_MODULES = [
  { id: 'm1', code: 'IT1010', name: 'Fundamentals of Programming', year: 1, semester: 1 },
  { id: 'm2', code: 'IT1020', name: 'Computer Systems', year: 1, semester: 1 },
  { id: 'm3', code: 'IT1030', name: 'Mathematics for Computing', year: 1, semester: 1 },
  { id: 'm4', code: 'IT1040', name: 'Software Engineering', year: 1, semester: 2 },
  { id: 'm5', code: 'IT1050', name: 'Database Management Systems', year: 1, semester: 2 },
  { id: 'm6', code: 'IT2010', name: 'Object Oriented Programming', year: 2, semester: 1 },
  { id: 'm7', code: 'IT2020', name: 'Data Structures and Algorithms', year: 2, semester: 1 },
  { id: 'm8', code: 'IT2030', name: 'Web Technologies', year: 2, semester: 2 },
  { id: 'm9', code: 'IT3010', name: 'Framework Based Web Dev', year: 3, semester: 1 },
  { id: 'm10', code: 'IT3020', name: 'Mobile App Development', year: 3, semester: 2 },
];

export function ModuleList({ year, semester, onSelectModule, onBack }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, [year, semester]);

  function loadModules() {
    setLoading(true);
    
    // Simulate a tiny network delay so the loading spinner shows nicely
    setTimeout(() => {
      // Filter modules based on selected year and semester
      const filtered = ALL_MODULES.filter(
        (m) => m.year === year && m.semester === semester
      );
      
      // Sort alphabetically by module code
      filtered.sort((a, b) => a.code.localeCompare(b.code));
      
      setModules(filtered);
      setLoading(false);
    }, 400);
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center min-h-[300px] border-t-4 border-primary-800">
        <Loader className="w-8 h-8 text-primary-800 animate-spin" />
      </div>
    );
  }

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
            <BookOpen className="w-6 h-6 text-primary-800" />
          </div>
          Year {year} - Semester {semester} Modules
        </h2>
      </div>

      {modules.length === 0 ? (
        <div className="text-center py-12 text-primary-500 font-medium">
          No modules found for this semester.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => onSelectModule(module)}
              className="p-6 rounded-xl border-2 border-primary-200 bg-white hover:border-primary-400 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="font-bold text-primary-800 text-lg mb-2 group-hover:text-primary-900">
                {module.code}
              </div>
              <div className="text-primary-700 font-medium">{module.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}