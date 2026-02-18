import { forwardRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WysiwygViewProps {
  onInput: (html: string) => void;
  content: string;
}

export const WysiwygView = forwardRef<HTMLDivElement, WysiwygViewProps>(
  ({ onInput, content }, ref) => {
    
    useEffect(() => {
        if (ref && 'current' in ref && ref.current) {
            if (ref.current.innerHTML !== content) {
                ref.current.innerHTML = content;
            }
        }
    }, [content, ref]);

    return (
      <ScrollArea className="h-full w-full">
        <div
          ref={ref}
          contentEditable
          onInput={(e) => {
            onInput(e.currentTarget.innerHTML);
          }}
          className="min-h-full w-full p-6 focus:outline-none text-zinc-100 wysiwyg-content outline-none prose prose-invert max-w-none"
          style={{ lineHeight: '1.6', fontSize: '16px' }}
        />
      </ScrollArea>
    );
  }
);
WysiwygView.displayName = 'WysiwygView';
