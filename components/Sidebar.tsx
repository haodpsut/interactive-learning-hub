
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Lesson } from '../types';
import { Book, Code, Cpu, Atom, ChevronLeft } from 'lucide-react';

const ICONS: { [key: string]: React.ElementType } = {
  js: Code,
  logic: Cpu,
  physics: Atom,
  default: Book,
};

const Sidebar: React.FC = () => {
  const { lessons, currentLesson, setCurrentLesson, isSidebarOpen, setIsSidebarOpen } = useContext(AppContext);

  const getIcon = (iconName: string) => {
    const IconComponent = ICONS[iconName] || ICONS.default;
    return <IconComponent className="mr-3 h-5 w-5" />;
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Lessons</h2>
        <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <ChevronLeft />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul>
          {lessons.map(lesson => (
            <li key={lesson.id} className="my-1">
              <button
                onClick={() => setCurrentLesson(lesson)}
                className={`w-full text-left flex items-center p-3 rounded-md transition-colors ${
                  currentLesson?.id === lesson.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700'
                }`}
              >
                {getIcon(lesson.icon)}
                <span className="flex-1 font-medium">{lesson.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
       <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Interactive Learning Hub</p>
      </div>
    </aside>
  );
};

export default Sidebar;
