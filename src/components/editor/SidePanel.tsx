import { ScrollArea } from '@/components/ui/scroll-area';
import { type ActivityView } from './ActivityBar';
import { FormatTools } from './sidepanel/FormatTools';
import { ClipboardTools } from './sidepanel/ClipboardTools';
import { InfoPanel } from './sidepanel/InfoPanel';

interface SidePanelProps {
  activeView: ActivityView;
  mode: 'wysiwyg' | 'markdown' | 'advanced';
  onFormat: (command: string, value?: string) => void;
  wordCount: number;
  charCount: number;
}

export function SidePanel({ activeView, mode, onFormat, wordCount, charCount }: SidePanelProps) {
  if (!activeView) return null;

  return (
     <div className="flex-1 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full animate-in slide-in-from-right-10 duration-200 shadow-xl z-10">
       <div className="p-3 border-b border-zinc-800">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {activeView === 'edit' && 'Herramientas de Formato'}
            {activeView === 'clipboard' && 'Asistente de Portapapeles'}
            {activeView === 'info' && 'Estadísticas del Documento'}
            {activeView === 'settings' && 'Configuración'}
          </h3>
       </div>
       
       <ScrollArea className="flex-1">
          <div className="p-4 flex flex-col gap-6">
             
             {activeView === 'edit' && (
                <FormatTools mode={mode} onFormat={onFormat} />
             )}

             {activeView === 'clipboard' && (
                <ClipboardTools onFormat={onFormat} />
             )}

             {activeView === 'info' && (
                <InfoPanel wordCount={wordCount} charCount={charCount} />
             )}

              {activeView === 'settings' && (
                <div className="space-y-4">
                    <p className="text-sm text-zinc-500">Configuración del editor (próximamente)</p>
                </div>
             )}

          </div>
       </ScrollArea>
    </div>
  );
}
