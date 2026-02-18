import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  initialValue?: string;
  language?: string;
  theme?: 'light' | 'dark';
  height?: string;
  onChange?: (value: string | undefined) => void;
}

export default function MonacoEditor({
  initialValue = '// Start coding here',
  language = 'javascript',
  theme = 'vs-dark', // default to dark theme as it looks cooler
  height = '500px',
  onChange,
}: MonacoEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={initialValue}
        theme={theme}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
