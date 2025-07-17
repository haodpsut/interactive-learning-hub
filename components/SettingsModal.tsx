
import React, { useState, useContext, useEffect, ReactNode } from 'react';
import { AppContext } from '../contexts/AppContext';
import { OPENROUTER_FREE_MODELS } from '../constants';
import { KeyRound, X } from 'lucide-react';

interface SettingsModalProps {
  triggerButton?: ReactNode;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ triggerButton }) => {
  const { settings, saveSettings } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(!triggerButton); // Open by default if no trigger is provided

  const [provider, setProvider] = useState(settings.provider || 'gemini');
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || '');
  const [openRouterKey, setOpenRouterKey] = useState(settings.openRouterApiKey || '');
  const [openRouterModel, setOpenRouterModel] = useState(settings.openRouterModel || '');

  useEffect(() => {
    if (settings.provider) {
        setProvider(settings.provider);
        setGeminiKey(settings.geminiApiKey);
        setOpenRouterKey(settings.openRouterApiKey);
        setOpenRouterModel(settings.openRouterModel);
    }
  }, [settings]);

  const handleSave = () => {
    saveSettings({
      provider: provider as 'gemini' | 'openrouter',
      geminiApiKey: geminiKey,
      openRouterApiKey: openRouterKey,
      openRouterModel: openRouterModel,
    });
    setIsOpen(false);
  };
  
  const isSaveDisabled = provider === 'gemini' ? !geminiKey : (!openRouterKey || !openRouterModel);


  return (
    <>
      {triggerButton && React.cloneElement(triggerButton as React.ReactElement, { onClick: () => setIsOpen(true) })}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md m-4 relative">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">API Settings</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Configure your AI provider to enable interactive features.</p>
            
            {triggerButton && (
                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                </button>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-primary-500"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openrouter">OpenRouter</option>
              </select>
            </div>

            {provider === 'gemini' && (
              <div className="animate__animated animate__fadeIn">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gemini API Key</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="Enter your Gemini API Key"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            {provider === 'openrouter' && (
              <div className="space-y-4 animate__animated animate__fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">OpenRouter API Key</label>
                  <input
                    type="password"
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                    placeholder="Enter your OpenRouter API Key"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select a Free Model</label>
                  <select
                    value={openRouterModel}
                    onChange={(e) => setOpenRouterModel(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="" disabled>-- Select a model --</option>
                    {OPENROUTER_FREE_MODELS.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-md font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <KeyRound size={16} className="mr-2"/>
                    Save and Continue
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;
