import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ClipboardPaste, Eraser } from 'lucide-react';
import { toast } from 'sonner';

interface ClipboardToolsProps {
    onFormat: (command: string, value?: string) => void;
}

export function ClipboardTools({ onFormat }: ClipboardToolsProps) {
    const [scratchpadContent, setScratchpadContent] = useState('');

    const handlePastePlainText = async () => {
        try {
            const text = await navigator.clipboard.readText();
            document.execCommand('insertText', false, text);
            toast.success('Texto pegado sin formato');
        } catch (err) {
            toast.error('No se pudo acceder al portapapeles');
        }
    };

    const handleScratchpadInsert = () => {
        if (scratchpadContent) {
            document.execCommand('insertText', false, scratchpadContent);
            toast.success('Texto insertado');
            setScratchpadContent('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex flex-col gap-3">
                    <Button 
                        variant="ghost" 
                        size="lg" 
                        onClick={handlePastePlainText}
                        className="w-full h-auto py-4 px-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left justify-start group"
                    >
                        <ClipboardPaste className="h-5 w-5 mr-4 text-zinc-400 group-hover:text-zinc-100 transition-colors" /> 
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-sm font-medium text-zinc-200 group-hover:text-white">Pegar Texto Plano</span>
                            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Elimina todo el formato de origen</span>
                        </div>
                    </Button>

                    <Button 
                        variant="ghost" 
                        size="lg" 
                        onClick={() => onFormat('removeFormat')} 
                        className="w-full h-auto py-4 px-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-left justify-start group"
                    >
                        <Eraser className="h-5 w-5 mr-4 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-sm font-medium text-zinc-200 group-hover:text-white">Limpiar Formato</span>
                            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Resetea estilos del texto seleccionado</span>
                        </div>
                    </Button>
                </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Área de Pruebas (Scratchpad)</h4>
                <textarea
                    className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-md p-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 resize-none font-mono placeholder:text-zinc-700"
                    placeholder="Pega aquí para limpiar o editar texto antes de insertar..."
                    value={scratchpadContent}
                    onChange={(e) => setScratchpadContent(e.target.value)}
                />
                <div className="flex gap-2">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="flex-1 text-xs"
                        onClick={handleScratchpadInsert}
                        disabled={!scratchpadContent}
                    >
                        Insertar
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs border-zinc-800 hover:bg-zinc-800 text-zinc-400"
                        onClick={() => setScratchpadContent('')}
                        disabled={!scratchpadContent}
                    >
                        Limpiar
                    </Button>
                </div>
            </div>

            <div className="bg-zinc-800/20 p-4 rounded-lg border border-zinc-800/50">
                <h5 className="text-xs font-semibold text-zinc-500 mb-2">Consejo Pro</h5>
                <p className="text-xs text-zinc-400 leading-relaxed">
                    Usa "Pegar Texto Plano" cuando traigas contenido de PDFs o sitios web para mantener tu documento limpio y consistente.
                </p>
            </div>
        </div>
    );
}
