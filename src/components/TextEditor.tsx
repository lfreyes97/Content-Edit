import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Save, FileText, Download, Upload, Eye, Code, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { marked } from 'marked';
import { TerminalPanel } from './TerminalPanel';
import { cn } from '@/lib/utils';
import Editor from '@monaco-editor/react';

export default function TextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [mode, setMode] = useState<'wysiwyg' | 'markdown' | 'advanced'>('wysiwyg');
  const [markdownContent, setMarkdownContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [advancedLanguage, setAdvancedLanguage] = useState<'markdown' | 'html'>('markdown');

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
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
        if (editorRef.current) {
          editorRef.current.innerHTML = html as string;
        }
      }
    } else if (mode === 'advanced') {
      if (advancedLanguage === 'markdown') {
        const html = await marked(markdownContent);
        setHtmlContent(html as string);
        if (editorRef.current) {
          editorRef.current.innerHTML = html as string;
        }
      } else {
        // If advanced language is html, htmlContent is up to date, just set innerHTML
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlContent;
        }
      }
    } else if (htmlContent && editorRef.current) {
      // Fallback or re-render
      editorRef.current.innerHTML = htmlContent;
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
        
        {/* Top Bar: Tabs & Actions */}
        <div className="flex items-center justify-between bg-zinc-900 border-b border-zinc-800 px-2 pt-2 select-none">
           {/* File Tabs */}
           <div className="flex gap-1 overflow-x-auto">
              {/* Visual Tab */}
              <button
                onClick={() => {
                    if (mode === 'markdown') switchToWysiwyg(); 
                    else if (mode === 'advanced') setMode('wysiwyg');
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  mode === 'wysiwyg'
                    ? 'bg-zinc-800 text-zinc-100 border-t-2 border-primary' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Visual.html</span>
              </button>
              
              {/* Markdown Tab */}
              <button
                onClick={() => {
                    if (mode === 'wysiwyg') switchToMarkdown(); 
                    else if (mode === 'advanced') setMode('markdown');
                }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  mode === 'markdown'
                    ? 'bg-zinc-800 text-zinc-100 border-t-2 border-primary' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                <Code className="h-4 w-4" />
                <span>Source.md</span>
              </button>

              {/* Advanced Tab */}
              <button
                onClick={switchToAdvanced}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  mode === 'advanced'
                    ? 'bg-zinc-800 text-zinc-100 border-t-2 border-primary' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                <Terminal className="h-4 w-4" />
                <span>Editor.tsx</span>
              </button>
           </div>

           {/* Top Actions */}
           <div className="flex items-center gap-2 px-2 pb-1">
              <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                 <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDownload} className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                 <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleUpload} className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                 <Upload className="h-4 w-4" />
              </Button>
           </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400">
           <TooltipProvider>
             {mode !== 'advanced' && (
               <>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="sm" onClick={() => handleFormat('bold')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <Bold className="h-4 w-4" />
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>Negrita</TooltipContent>
                 </Tooltip>
                 
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="sm" onClick={() => handleFormat('italic')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <Italic className="h-4 w-4" />
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>Cursiva</TooltipContent>
                 </Tooltip>

                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="sm" onClick={() => handleFormat('underline')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <Underline className="h-4 w-4" />
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>Subrayado</TooltipContent>
                 </Tooltip>

                 <Separator orientation="vertical" className="h-4 mx-2 bg-zinc-700" />

                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="sm" onClick={() => handleFormat('justifyLeft')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <AlignLeft className="h-4 w-4" />
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>Alinear Izquierda</TooltipContent>
                 </Tooltip>

                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="sm" onClick={() => handleFormat('justifyCenter')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
                        <AlignCenter className="h-4 w-4" />
                     </Button>
                   </TooltipTrigger>
                   <TooltipContent>Centrar</TooltipContent>
                 </Tooltip>

                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Button variant="ghost" size="sm" onClick={() => handleFormat('justifyRight')} className="h-7 w-7 p-0 hover:bg-zinc-800 hover:text-zinc-100" disabled={mode === 'markdown'}>
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
             {wordCount} words • {charCount} chars
           </span>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-zinc-900 overflow-hidden relative">
           
           {/* Visual Mode */}
           {mode === 'wysiwyg' && (
             <ScrollArea className="h-full w-full">
               <div
                 ref={editorRef}
                 contentEditable
                 onInput={(e) => {
                   setHtmlContent(e.currentTarget.innerHTML);
                   updateStats();
                 }}
                 className="min-h-full w-full p-6 focus:outline-none text-zinc-100 wysiwyg-content"
                 style={{ lineHeight: '1.6', fontSize: '16px' }}
               />
             </ScrollArea>
           )}

           {/* Markdown Mode */}
           {mode === 'markdown' && (
              <div className="grid grid-cols-2 h-full">
                <textarea
                  ref={markdownRef}
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  className="h-full w-full p-4 bg-zinc-900 text-zinc-100 focus:outline-none resize-none font-mono text-sm border-r border-zinc-800"
                  placeholder="# Enter your markdown..."
                />
                <ScrollArea className="h-full w-full bg-zinc-900">
                  <div
                    className="p-4 text-zinc-300 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: marked(markdownContent) as string }}
                  />
                </ScrollArea>
              </div>
           )}

           {/* Advanced Mode */}
           {mode === 'advanced' && (
              <div className="flex flex-col h-full">
                 <div className="flex items-center justify-between p-2 bg-zinc-800/50 border-b border-zinc-800">
                    <span className="text-xs font-mono text-zinc-400">
                       {advancedLanguage === 'markdown' ? 'content.md' : 'content.html'}
                    </span>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => {
                            if (advancedLanguage === 'html') {
                                const md = htmlToMarkdown(htmlContent);
                                setMarkdownContent(md);
                            }
                            setAdvancedLanguage('markdown');
                         }}
                         className={`text-xs px-2 py-1 rounded ${advancedLanguage === 'markdown' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                       >
                         Markdown
                       </button>
                       <button 
                         onClick={async () => {
                             if (advancedLanguage === 'markdown') {
                                 const html = await marked(markdownContent);
                                 setHtmlContent(html as string);
                             }
                             setAdvancedLanguage('html');
                         }}
                         className={`text-xs px-2 py-1 rounded ${advancedLanguage === 'html' ? 'bg-orange-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                       >
                         HTML
                       </button>
                    </div>
                 </div>
                 <div className="flex-1">
                   <Editor
                     height="100%"
                     language={advancedLanguage}
                     theme="vs-dark"
                     value={advancedLanguage === 'markdown' ? markdownContent : htmlContent}
                     onChange={(value) => {
                         if (value !== undefined) {
                             if (advancedLanguage === 'markdown') {
                                 setMarkdownContent(value);
                             } else {
                                 setHtmlContent(value);
                             }
                         }
                     }}
                     options={{
                         minimap: { enabled: true },
                         fontSize: 14,
                         wordWrap: 'on',
                         scrollBeyondLastLine: false,
                         automaticLayout: true,
                         fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                     }}
                   />
                 </div>
              </div>
           )}
        </div>

        {/* Terminal / Bottom Panel - Disabled by default */}
        {/* <TerminalPanel wordCount={wordCount} charCount={charCount} /> */}
      </div>
    </div>
  );
}
