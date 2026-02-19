import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
    Bold, Italic, Underline, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, 
    Heading1, Heading2, Quote, 
    List, ListOrdered 
} from 'lucide-react';

interface FormatToolsProps {
    mode: 'wysiwyg' | 'markdown' | 'advanced';
    onFormat: (command: string, value?: string) => void;
}

export function FormatTools({ mode, onFormat }: FormatToolsProps) {
    if (mode === 'markdown') {
        return (
            <div className="text-sm text-zinc-500 text-center py-4">
                El formato visual está desactivado en modo Markdown.
            </div>
        );
    }

    return (
        <>
            {/* Typography Section */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tipografía</h4>
                <div className="flex gap-1">
                    <Button variant="secondary" size="sm" onClick={() => onFormat('bold')} className="flex-1">
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => onFormat('italic')} className="flex-1">
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => onFormat('underline')} className="flex-1">
                        <Underline className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => onFormat('strikeThrough')} className="flex-1">
                        <Strikethrough className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Structure Section */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Estructura</h4>
                <div className="grid grid-cols-1 gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onFormat('formatBlock', 'h1')} className="justify-start">
                        <Heading1 className="h-4 w-4 mr-2 text-zinc-400" /> Título Principal
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('formatBlock', 'h2')} className="justify-start">
                        <Heading2 className="h-4 w-4 mr-2 text-zinc-400" /> Subtítulo
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onFormat('formatBlock', 'blockquote')} className="justify-start">
                        <Quote className="h-4 w-4 mr-2 text-zinc-400" /> Cita en Bloque
                    </Button>
                </div>
            </div>

            <Separator className="bg-zinc-800" />

            {/* Lists & Alignment Section */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Párrafo</h4>
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-1">
                        <Button variant="ghost" size="sm" onClick={() => onFormat('insertUnorderedList')} className="justify-start">
                            <List className="h-4 w-4 mr-2" /> Viñetas
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onFormat('insertOrderedList')} className="justify-start">
                            <ListOrdered className="h-4 w-4 mr-2" /> Numerada
                        </Button>
                    </div>
                    <div className="flex gap-1 bg-zinc-800/50 p-1 rounded-md">
                        <Button variant="ghost" size="icon" onClick={() => onFormat('justifyLeft')} className="h-6 w-full">
                            <AlignLeft className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onFormat('justifyCenter')} className="h-6 w-full">
                            <AlignCenter className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onFormat('justifyRight')} className="h-6 w-full">
                            <AlignRight className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
