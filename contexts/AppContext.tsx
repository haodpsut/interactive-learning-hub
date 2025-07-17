
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Lesson } from '../types';

interface Settings {
  provider: 'gemini' | 'openrouter' | '';
  geminiApiKey: string;
  openRouterApiKey: string;
  openRouterModel: string;
}

interface AppContextType {
  settings: Settings;
  saveSettings: (newSettings: Partial<Settings>) => void;
  lessons: Lesson[];
  currentLesson: Lesson | null;
  setCurrentLesson: (lesson: Lesson | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultSettings: Settings = {
  provider: '',
  geminiApiKey: '',
  openRouterApiKey: '',
  openRouterModel: '',
};

export const AppContext = createContext<AppContextType>({
  settings: defaultSettings,
  saveSettings: () => {},
  lessons: [],
  currentLesson: null,
  setCurrentLesson: () => {},
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>('app-settings', defaultSettings);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessonFiles = ['js_loops.json', 'logic_gates.json', 'physics_gravity.json'];
        const lessonPromises = lessonFiles.map(file => fetch(`/data/${file}`).then(res => res.json()));
        const loadedLessons = await Promise.all(lessonPromises);
        setLessons(loadedLessons);
      } catch (error) {
        console.error("Failed to load lessons:", error);
      }
    };
    fetchLessons();
  }, []);

  const saveSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AppContext.Provider value={{ settings, saveSettings, lessons, currentLesson, setCurrentLesson, isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </AppContext.Provider>
  );
};
