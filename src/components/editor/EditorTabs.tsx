import { Button } from '@/components/ui/button';
import { Eye, Code, Terminal, Save, Download, Upload } from 'lucide-react';

interface EditorTabsProps {
  mode: 'wysiwyg' | 'markdown' | 'advanced';
  onSwitchToWysiwyg: () => void;
  onSwitchToMarkdown: () => void;
  onSwitchToAdvanced: () => void;
  onSave: () => void;
  onDownload: () => void;
  onUpload: () => void;
}

export function EditorTabs({
  mode,
  onSwitchToWysiwyg,
  onSwitchToMarkdown,
  onSwitchToAdvanced,
  onSave,
  onDownload,
  onUpload
}: EditorTabsProps) {
  return (
    <div className="flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-2 pt-2 select-none">
       {/* File Tabs */}
       <div className="flex gap-1 overflow-x-auto">
          {/* Visual Tab */}
          <button
            onClick={onSwitchToWysiwyg}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              mode === 'wysiwyg'
                ? 'bg-zinc-800 text-zinc-100 border-t-2 border-primary' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Visual.html</span>
          </button>
          
          {/* Markdown Tab */}
          <button
            onClick={onSwitchToMarkdown}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              mode === 'markdown'
                ? 'bg-zinc-800 text-zinc-100 border-t-2 border-primary' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>Código.md</span>
          </button>

          {/* Advanced Tab */}
          <button
            onClick={onSwitchToAdvanced}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              mode === 'advanced'
                ? 'bg-zinc-800 text-zinc-100 border-t-2 border-primary' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Editor.tsx</span>
          </button>
       </div>

       {/* Top Actions */}
       <div className="flex items-center gap-2 px-2 pb-1">
          <Button variant="ghost" size="icon" onClick={onSave} className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
             <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDownload} className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
             <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onUpload} className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
             <Upload className="h-4 w-4" />
          </Button>
       </div>
    </div>
  );
}
