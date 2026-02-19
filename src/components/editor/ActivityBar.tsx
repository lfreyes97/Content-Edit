import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { PenTool, Info, Settings, ClipboardList } from 'lucide-react';

export type ActivityView = 'edit' | 'clipboard' | 'info' | 'settings' | null;

interface ActivityBarProps {
  activeView: ActivityView;
  onViewChange: (view: ActivityView) => void;
}

export function ActivityBar({ activeView, onViewChange }: ActivityBarProps) {
  const handleToggle = (view: ActivityView) => {
    onViewChange(activeView === view ? null : view);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4 bg-zinc-950 border-r border-zinc-900 w-12 h-full z-20 shrink-0">
       <TooltipProvider delayDuration={0}>
         
         <Tooltip>
           <TooltipTrigger asChild>
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleToggle('edit')}
                className={`h-10 w-10 transition-colors ${activeView === 'edit' ? 'text-zinc-100 border-l-2 border-blue-500 bg-zinc-900 rounded-none' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
             >
                <PenTool className="h-5 w-5" />
             </Button>
           </TooltipTrigger>
           <TooltipContent side="left">Formato</TooltipContent>
         </Tooltip>

         <Tooltip>
           <TooltipTrigger asChild>
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleToggle('clipboard')}
                className={`h-10 w-10 transition-colors ${activeView === 'clipboard' ? 'text-zinc-100 border-l-2 border-blue-500 bg-zinc-900 rounded-none' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
             >
                <ClipboardList className="h-5 w-5" />
             </Button>
           </TooltipTrigger>
           <TooltipContent side="left">Portapapeles</TooltipContent>
         </Tooltip>

         <Tooltip>
           <TooltipTrigger asChild>
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleToggle('info')}
                className={`h-10 w-10 transition-colors ${activeView === 'info' ? 'text-zinc-100 border-l-2 border-blue-500 bg-zinc-900 rounded-none' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
             >
                <Info className="h-5 w-5" />
             </Button>
           </TooltipTrigger>
           <TooltipContent side="left">Información</TooltipContent>
         </Tooltip>

         <div className="mt-auto">
            <Tooltip>
            <TooltipTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleToggle('settings')}
                    className={`h-10 w-10 transition-colors ${activeView === 'settings' ? 'text-zinc-100 border-l-2 border-blue-500 bg-zinc-900 rounded-none' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}
                >
                    <Settings className="h-5 w-5" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Configuración</TooltipContent>
            </Tooltip>
         </div>

       </TooltipProvider>
    </div>
  );
}
