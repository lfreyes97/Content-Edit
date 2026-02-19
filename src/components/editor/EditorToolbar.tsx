import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, List, ListOrdered, Link, Quote } from 'lucide-react';

interface EditorToolbarProps {
  mode: 'wysiwyg' | 'markdown' | 'advanced';
  onFormat: (command: string, value?: string) => void;
  wordCount: number;
  charCount: number;
}

export function EditorToolbar({ mode, onFormat, wordCount, charCount }: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400">
       <TooltipProvider>
         {mode !== 'advanced' && (
           <>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('bold')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <Bold className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Negrita</TooltipContent>
             </Tooltip>
             
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('italic')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <Italic className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Cursiva</TooltipContent>
             </Tooltip>

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('underline')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <Underline className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Subrayado</TooltipContent>
             </Tooltip>

             <Separator orientation="vertical" className="h-4 mx-2 bg-zinc-700" />

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('formatBlock', 'h1')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <Heading1 className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Título 1</TooltipContent>
             </Tooltip>

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('formatBlock', 'h2')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <Heading2 className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Título 2</TooltipContent>
             </Tooltip>
             
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('formatBlock', 'blockquote')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <Quote className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Cita</TooltipContent>
             </Tooltip>

             <Separator orientation="vertical" className="h-4 mx-2 bg-zinc-700" />

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('insertUnorderedList')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <List className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Lista con viñetas</TooltipContent>
             </Tooltip>

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('insertOrderedList')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <ListOrdered className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Lista numerada</TooltipContent>
             </Tooltip>

             <Separator orientation="vertical" className="h-4 mx-2 bg-zinc-700" />

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('createLink')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <Link className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Enlace</TooltipContent>
             </Tooltip>

             <Separator orientation="vertical" className="h-4 mx-2 bg-zinc-700" />

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('justifyLeft')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <AlignLeft className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Alinear Izquierda</TooltipContent>
             </Tooltip>

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('justifyCenter')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <AlignCenter className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Centrar</TooltipContent>
             </Tooltip>

             <Tooltip>
               <TooltipTrigger asChild>
                 <Button variant="ghost" size="sm" onClick={() => onFormat('justifyRight')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                    <AlignRight className="h-4 w-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>Alinear Derecha</TooltipContent>
             </Tooltip>

             <Separator orientation="vertical" className="h-4 mx-2 bg-zinc-700" />
           </>
         )}
       </TooltipProvider>
       <span className="text-xs ml-auto px-2 font-mono text-zinc-500">
         {wordCount} palabras • {charCount} caracteres
       </span>
    </div>
  );
}
