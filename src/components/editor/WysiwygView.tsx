import { forwardRef, useEffect, useRef, type KeyboardEvent } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WysiwygViewProps {
  onInput: (html: string) => void;
  content: string;
}

export const WysiwygView = forwardRef<HTMLDivElement, WysiwygViewProps>(
  ({ onInput, content }, ref) => {
    
    const contentRef = useRef(content);

    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        // Only update if the content prop has changed and it's different from the current editor content
        // This prevents the cursor from jumping when the user is typing
        if (content !== contentRef.current && ref.current.innerHTML !== content) {
          ref.current.innerHTML = content;
          contentRef.current = content;
        }
      }
    }, [content, ref]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const newContent = e.currentTarget.innerHTML;
      contentRef.current = newContent;
      onInput(newContent);
    };


    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === ' ') {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        
        const range = selection.getRangeAt(0);
        const startNode = range.startContainer;
        
        if (startNode.nodeType === Node.TEXT_NODE && startNode.textContent) {
             const text = startNode.textContent;
             const offset = range.startOffset;
             const strUpToCursor = text.slice(0, offset);
             
             const patterns: Record<string, string> = {
                 '#': 'h1',
                 '##': 'h2',
                 '###': 'h3',
                 '####': 'h4',
                 '#####': 'h5',
                 '######': 'h6',
                 '>': 'blockquote',
                 '```': 'pre',
                 '*': 'insertUnorderedList',
                 '-': 'insertUnorderedList',
                 '1.': 'insertOrderedList',
                 '---': 'insertHorizontalRule'
             };

             if (patterns[strUpToCursor]) {
                 e.preventDefault();
                 const cmd = patterns[strUpToCursor];
                 
                 const newRange = document.createRange();
                 newRange.setStart(startNode, 0);
                 newRange.setEnd(startNode, offset);
                 newRange.deleteContents();
                 
                 if (cmd.startsWith('h') || cmd === 'blockquote' || cmd === 'pre') {
                     document.execCommand('formatBlock', false, cmd);
                 } else {
                     document.execCommand(cmd);
                 }
             }
        }
      }
    };

    return (
      <ScrollArea className="h-full w-full">
        <div
          ref={ref}
          contentEditable
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          className="min-h-full w-full p-6 focus:outline-none text-zinc-100 wysiwyg-content outline-none prose prose-invert max-w-none prose-p:my-0 prose-headings:my-1 leading-snug"
          style={{ lineHeight: '1.25', fontSize: '16px' }}
        />
      </ScrollArea>
    );
  }
);
WysiwygView.displayName = 'WysiwygView';
