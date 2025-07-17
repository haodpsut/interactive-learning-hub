
import React, { useContext } from 'react';
import Sidebar from './components/Sidebar';
import LessonContent from './components/LessonContent';
import SettingsModal from './components/SettingsModal';
import { AppContext } from './contexts/AppContext';
import { BookOpen, ChevronsRight, Settings } from 'lucide-react';

const App: React.FC = () => {
  const { settings, lessons, currentLesson, isSidebarOpen, setIsSidebarOpen } = useContext(AppContext);

  const isConfigured = (settings.geminiApiKey || settings.openRouterApiKey) && settings.provider;

  if (!isConfigured) {
    return <SettingsModal />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Sidebar />
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 mr-4 text-gray-600 dark:text-gray-300"
            >
              <ChevronsRight className={`transform transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            <h1 className="text-xl font-semibold">{currentLesson ? currentLesson.title : 'Welcome'}</h1>
          </div>
          <SettingsModal triggerButton={<button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"><Settings /></button>} />
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          {currentLesson ? (
            <LessonContent lesson={currentLesson} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
              <BookOpen size={64} className="mb-4" />
              <h2 className="text-2xl font-bold">Select a Lesson</h2>
              <p>Choose a lesson from the sidebar to begin your learning journey.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
