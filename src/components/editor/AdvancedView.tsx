import Editor from '@monaco-editor/react';

interface AdvancedViewProps {
  language: 'markdown' | 'html';
  content: string;
  onChange: (value: string | undefined) => void;
  onLanguageChange: (lang: 'markdown' | 'html') => void;
}

export function AdvancedView({ language, content, onChange, onLanguageChange }: AdvancedViewProps) {
  return (
    <div className="flex flex-col h-full">
       <div className="flex items-center justify-between p-2 bg-zinc-800/50 border-b border-zinc-800">
          <span className="text-xs font-mono text-zinc-400">
             {language === 'markdown' ? 'content.md' : 'content.html'}
          </span>
          <div className="flex gap-2">
             <button 
               onClick={() => onLanguageChange('markdown')}
               className={`text-xs px-2 py-1 rounded ${language === 'markdown' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}
             >
               Markdown
             </button>
             <button 
               onClick={() => onLanguageChange('html')}
               className={`text-xs px-2 py-1 rounded ${language === 'html' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-white'}`}
             >
               HTML
             </button>
          </div>
       </div>
       <div className="flex-1">
         <Editor
           height="100%"
           language={language}
           theme="vs-dark"
           value={content}
           onChange={onChange}
           options={{
               minimap: { enabled: true },
               fontSize: 14,
               wordWrap: 'on',
               scrollBeyondLastLine: false,
               automaticLayout: true,
               fontFamily: "'Google Sans Code', 'Fira Code', monospace",
           }}
         />
       </div>
    </div>
  );
}
