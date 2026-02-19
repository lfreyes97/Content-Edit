import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, List, ListOrdered, Link, Quote } from 'lucide-react';

interface EditorSidebarProps {
  mode: 'wysiwyg' | 'markdown' | 'advanced';
  onFormat: (command: string, value?: string) => void;
  wordCount: number;
  charCount: number;
}

export function EditorSidebar({ mode, onFormat, wordCount, charCount }: EditorSidebarProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-2 bg-zinc-900 border-l border-zinc-800 text-zinc-400 w-14 h-full">
       <TooltipProvider delayDuration={0}>
         {mode !== 'advanced' && (
           <>
             {/* Text Style Group */}
             <div className="flex flex-col gap-1">
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('bold')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <Bold className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Negrita</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('italic')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <Italic className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Cursiva</TooltipContent>
                </Tooltip>

                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('underline')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <Underline className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Subrayado</TooltipContent>
                </Tooltip>
             </div>

             <Separator className="w-8 bg-zinc-800" />

             {/* Headings Group */}
             <div className="flex flex-col gap-1">
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('formatBlock', 'h1')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <Heading1 className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Título 1</TooltipContent>
                </Tooltip>

                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('formatBlock', 'h2')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <Heading2 className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Título 2</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('formatBlock', 'blockquote')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <Quote className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Cita</TooltipContent>
                </Tooltip>
             </div>

             <Separator className="w-8 bg-zinc-800" />

             {/* Lists Group */}
             <div className="flex flex-col gap-1">
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('insertUnorderedList')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <List className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Lista con viñetas</TooltipContent>
                </Tooltip>

                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('insertOrderedList')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Lista numerada</TooltipContent>
                </Tooltip>
             </div>

             <Separator className="w-8 bg-zinc-800" />

             {/* Alignment Group */}
             <div className="flex flex-col gap-1">
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('createLink')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <Link className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Enlace</TooltipContent>
                </Tooltip>

                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('justifyLeft')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <AlignLeft className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Alinear Izquierda</TooltipContent>
                </Tooltip>

                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('justifyCenter')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <AlignCenter className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Centrar</TooltipContent>
                </Tooltip>

                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('justifyRight')} className="h-8 w-8 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <AlignRight className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Alinear Derecha</TooltipContent>
                </Tooltip>
             </div>
           </>
         )}
       </TooltipProvider>
       
       <div className="mt-auto flex flex-col items-center gap-1 py-2 text-[10px] font-mono text-zinc-600">
         <div className="text-center">
            <span className="block font-bold text-zinc-500">{wordCount}</span>
            <span>w</span>
         </div>
         <Separator className="w-4 bg-zinc-800" />
         <div className="text-center">
            <span className="block font-bold text-zinc-500">{charCount}</span>
            <span>c</span>
         </div>
       </div>
    </div>
  );
}
