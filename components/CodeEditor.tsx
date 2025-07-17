
import React, { useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Play } from 'lucide-react';

interface CodeEditorProps {
  initialCode: string;
  language: 'javascript' | 'html';
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, language }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<React.ReactNode>('');

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editor.focus();
  };
  
  const executeCode = () => {
    setOutput('');
    if (language === 'javascript') {
      try {
        const originalLog = console.log;
        let logs: any[] = [];
        console.log = (...args) => {
          logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
        };
        new Function(code)();
        console.log = originalLog;
        setOutput(logs.map((log, i) => <div key={i}>{log}</div>));
      } catch (e: any) {
        setOutput(<div className="text-red-500">{e.toString()}</div>);
      }
    } else if (language === 'html') {
      setOutput(<iframe srcDoc={code} title="html output" className="w-full h-full border-none" sandbox="allow-scripts"/>);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-900 dark:border-gray-700">
      <div className="h-80">
        <Editor
          height="100%"
          language={language}
          value={code}
          onMount={handleEditorDidMount}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      <div className="p-2 bg-gray-800 flex items-center justify-end">
        <button
          onClick={executeCode}
          className="px-4 py-2 bg-primary-600 text-white rounded-md font-semibold hover:bg-primary-700 flex items-center"
        >
          <Play size={16} className="mr-2" />
          Run
        </button>
      </div>
      <div className="p-4 bg-black text-white font-mono text-sm min-h-[80px]">
        <h4 className="font-bold text-gray-400 mb-2">Output:</h4>
        <div className={language === 'html' ? 'h-48' : ''}>{output}</div>
      </div>
    </div>
  );
};

export default CodeEditor;
