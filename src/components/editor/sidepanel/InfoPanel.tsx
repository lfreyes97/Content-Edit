interface InfoPanelProps {
    wordCount: number;
    charCount: number;
}

export function InfoPanel({ wordCount, charCount }: InfoPanelProps) {
    return (
        <div className="space-y-4">
            <div className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-800">
                <span className="text-3xl font-bold text-zinc-100 block">{wordCount}</span>
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Palabras</span>
            </div>
            <div className="bg-zinc-800/30 p-4 rounded-lg border border-zinc-800">
                <span className="text-3xl font-bold text-zinc-100 block">{charCount}</span>
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Caracteres</span>
            </div>
        </div>
    );
}
