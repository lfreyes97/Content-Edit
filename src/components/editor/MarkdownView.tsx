import { ScrollArea } from '@/components/ui/scroll-area';
import { marked } from 'marked';

interface MarkdownViewProps {
  content: string;
  onChange: (value: string) => void;
}

export function MarkdownView({ content, onChange }: MarkdownViewProps) {
  return (
    <div className="grid grid-cols-2 h-full">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full p-4 bg-zinc-900 text-zinc-100 focus:outline-none resize-none font-mono text-sm border-r border-zinc-800"
        placeholder="# Enter your markdown..."
      />
      <ScrollArea className="h-full w-full bg-zinc-900">
        <div
          className="p-4 text-zinc-300 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(content) as string }}
        />
      </ScrollArea>
    </div>
  );
}
