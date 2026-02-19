import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { marked } from 'marked';
import { TerminalPanel } from './TerminalPanel';
import { EditorTabs } from './editor/EditorTabs';
// import { EditorSidebar } from './editor/EditorSidebar'; // Deprecated
import { ActivityBar, type ActivityView } from './editor/ActivityBar';
import { SidePanel } from './editor/SidePanel';
import { WysiwygView } from './editor/WysiwygView';
import { MarkdownView } from './editor/MarkdownView';
import { AdvancedView } from './editor/AdvancedView';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function TextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [mode, setMode] = useState<'wysiwyg' | 'markdown' | 'advanced'>('wysiwyg');
  const [activeView, setActiveView] = useState<ActivityView>('edit'); // Default to Edit view
  const [markdownContent, setMarkdownContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [advancedLanguage, setAdvancedLanguage] = useState<'markdown' | 'html'>('markdown');

  const handleFormat = (command: string, value?: string) => {
    if (command === 'createLink' && !value) {
        const url = prompt('Introduce la URL:');
        if (url) {
            document.execCommand(command, false, url);
        }
    } else {
        document.execCommand(command, false, value);
    }
    editorRef.current?.focus();
  };

  const htmlToMarkdown = (html: string): string => {
    let md = html
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<i>(.*?)<\/i>/g, '*$1*')
      .replace(/<u>(.*?)<\/u>/g, '_$1_')
      .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
      .replace(/<div[^>]*>/g, '')
      .replace(/<\/div>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<p[^>]*>/g, '')
      .replace(/<\/p>/g, '\n\n')
      .replace(/&nbsp;/g, ' ');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = md;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const updateStats = useCallback(() => {
    let text = '';
    if (mode === 'wysiwyg') {
      text = editorRef.current?.innerText.trim() || '';
    } else if (mode === 'markdown') {
      text = markdownContent.trim();
    } else {
      // In advanced mode, we use the current content based on the selected language
      text = advancedLanguage === 'markdown' ? markdownContent.trim() : htmlContent.replace(/<[^>]*>/g, '').trim();
    }
    setCharCount(text.length);
    setWordCount(text ? text.split(/\s+/).filter(word => word.length > 0).length : 0);
  }, [mode, markdownContent, htmlContent, advancedLanguage]);

  const switchToMarkdown = () => {
    if (mode === 'wysiwyg' && editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlContent(html);
      const md = htmlToMarkdown(html);
      setMarkdownContent(md);
    } else if (mode === 'advanced') {
      if (advancedLanguage === 'html') {
         const md = htmlToMarkdown(htmlContent);
         setMarkdownContent(md);
      }
      // If advanced language is markdown, markdownContent is already up to date
    }
    setMode('markdown');
  };

  const switchToWysiwyg = async () => {
    if (mode === 'markdown') {
      if (markdownContent.trim()) {
        const html = await marked(markdownContent);
        setHtmlContent(html as string);
      }
    } else if (mode === 'advanced') {
      if (advancedLanguage === 'markdown') {
        const html = await marked(markdownContent);
        setHtmlContent(html as string);
      } 
      // If advanced language is html, htmlContent is already up to date via onChange
    }
    setMode('wysiwyg');
  };

  const switchToAdvanced = async () => {
    if (mode === 'wysiwyg' && editorRef.current) {
       const html = editorRef.current.innerHTML;
       setHtmlContent(html);
       // We default to whatever advancedLanguage is set to. 
       // If it's markdown, we need to convert.
       if (advancedLanguage === 'markdown') {
         const md = htmlToMarkdown(html);
         setMarkdownContent(md);
       }
    } else if (mode === 'markdown') {
       // If going to advanced and advancedLanguage is html, we might want to convert MD to HTML?
       // Let's assume yes for consistency.
       if (advancedLanguage === 'html') {
          const html = await marked(markdownContent);
          setHtmlContent(html as string);
       }
    }
    setMode('advanced');
  };

  const handleSave = () => {
    if (mode === 'wysiwyg' && editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHtmlContent(content);
      localStorage.setItem('editor-html', content);
      localStorage.setItem('editor-markdown', markdownContent);
      localStorage.setItem('editor-mode', 'wysiwyg');
    } else {
      localStorage.setItem('editor-markdown', markdownContent);
      localStorage.setItem('editor-html', htmlContent);
      localStorage.setItem('editor-mode', 'markdown');
    }
    toast.success('Documento guardado');
  };

  const handleDownload = () => {
    if (mode === 'wysiwyg' && editorRef.current) {
      const content = editorRef.current.innerHTML;
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'documento.html';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'documento.md';
      a.click();
      URL.revokeObjectURL(url);
    }
    toast.success('Documento descargado');
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/html,text/plain,text/markdown,.md';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          if (file.name.endsWith('.md') || file.type === 'text/markdown') {
            setMarkdownContent(content);
            const html = await marked(content);
            if (editorRef.current) {
              editorRef.current.innerHTML = html as string;
            }
            setMode('markdown');
          } else {
            if (editorRef.current) {
              editorRef.current.innerHTML = content;
            }
            setMode('wysiwyg');
          }
          updateStats();
          toast.success('Documento cargado');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    setMarkdownContent('');
    updateStats();
    toast.success('Documento limpiado');
  };

  useEffect(() => {
    const savedHtml = localStorage.getItem('editor-html');
    const savedMarkdown = localStorage.getItem('editor-markdown');
    const savedMode = localStorage.getItem('editor-mode') as 'wysiwyg' | 'markdown' | null;

    if (savedHtml || savedMarkdown) {
      if (savedMarkdown) {
        setMarkdownContent(savedMarkdown);
      }
      if (savedHtml) {
        setHtmlContent(savedHtml);
        if (editorRef.current) {
          editorRef.current.innerHTML = savedHtml;
        }
      }
      if (savedMode) {
        setMode(savedMode);
      }
      updateStats();
    }
  }, []);

  useEffect(() => {
    updateStats();
  }, [markdownContent, mode]);

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Main IDE Container */}
      <div className="flex flex-col h-full w-full">
        
        <EditorTabs 
            mode={mode}
            onSwitchToWysiwyg={() => {
                if (mode !== 'wysiwyg') switchToWysiwyg();
            }}
            onSwitchToMarkdown={() => {
                if (mode === 'wysiwyg') switchToMarkdown();
                else if (mode === 'advanced') setMode('markdown');
            }}
            onSwitchToAdvanced={switchToAdvanced}
            onSave={handleSave}
            onDownload={handleDownload}
            onUpload={handleUpload}
        />

        <div className="flex-1 overflow-hidden">
            <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-lg border-zinc-800">
                {/* Main Content Area */}
                <ResizablePanel defaultSize={80} minSize={50} className="bg-zinc-900 relative">
                
                    {/* Visual Mode */}
                    {mode === 'wysiwyg' && (
                        <WysiwygView 
                            ref={editorRef}
                            content={htmlContent} // Pass current content to ensure sync on re-render
                            onInput={(html) => {
                                setHtmlContent(html);
                                updateStats();
                            }}
                        />
                    )}

                    {/* Markdown Mode */}
                    {mode === 'markdown' && (
                        <MarkdownView 
                            content={markdownContent}
                            onChange={setMarkdownContent}
                        />
                    )}

                    {/* Advanced Mode */}
                    {mode === 'advanced' && (
                        <AdvancedView 
                            language={advancedLanguage}
                            content={advancedLanguage === 'markdown' ? markdownContent : htmlContent}
                            onChange={(value) => {
                                if (value !== undefined) {
                                    if (advancedLanguage === 'markdown') {
                                        setMarkdownContent(value);
                                    } else {
                                        setHtmlContent(value);
                                    }
                                }
                            }}
                            onLanguageChange={async (lang) => {
                                if (lang === 'markdown' && advancedLanguage === 'html') {
                                    const md = htmlToMarkdown(htmlContent);
                                    setMarkdownContent(md);
                                } else if (lang === 'html' && advancedLanguage === 'markdown') {
                                    const html = await marked(markdownContent);
                                    setHtmlContent(html as string);
                                }
                                setAdvancedLanguage(lang);
                            }}
                        />
                    )}
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-zinc-800" />

                {/* Workbench Sidebar (Right Side) */}
                <ResizablePanel defaultSize={20} minSize={15} maxSize={40} className="flex h-full bg-zinc-950">
                   {/* Activity Bar (Icons) */}
                   <ActivityBar 
                     activeView={activeView}
                     onViewChange={(view) => {
                        setActiveView(view);
                        // If view is closed (null), we could theoretically collapse the panel, 
                        // but for now we just keep the layout stable.
                     }}
                   />

                   {/* Collapsible Panel */}
                   <SidePanel 
                     activeView={activeView}
                     mode={mode}
                     onFormat={handleFormat}
                     wordCount={wordCount}
                     charCount={charCount}
                   />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
