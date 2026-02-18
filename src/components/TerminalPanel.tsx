import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalPanelProps {
  wordCount: number;
  charCount: number;
  className?: string;
}

export function TerminalPanel({ wordCount, charCount, className }: TerminalPanelProps) {
  return (
    <div className={cn("h-8 bg-blue-600 flex items-center px-4 text-xs font-medium text-white select-none gap-4", className)}>
       <div className="flex items-center gap-2">
          <Terminal className="h-3 w-3" />
          <span>TERMINAL</span>
       </div>
       <div className="flex items-center gap-2 opacity-70 hover:opacity-100 cursor-pointer">
          <span>OUTPUT</span>
       </div>
       <div className="flex items-center gap-2 opacity-70 hover:opacity-100 cursor-pointer">
          <span>PROBLEMS</span>
       </div>
       
       <div className="ml-auto opacity-70 cursor-pointer hover:opacity-100">
           Ln {wordCount}, Col {charCount}
       </div>
    </div>
  );
}
