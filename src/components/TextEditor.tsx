import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Save, FileText, Download, Upload, Eye, Code } from 'lucide-react';
import { toast } from 'sonner';
import { marked } from 'marked';

export default function TextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [mode, setMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg');
  const [markdownContent, setMarkdownContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');

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

  const updateStats = () => {
    const text = mode === 'wysiwyg'
      ? editorRef.current?.innerText.trim() || ''
      : markdownContent.trim();
    setCharCount(text.length);
    setWordCount(text ? text.split(/\s+/).filter(word => word.length > 0).length : 0);
  };

  const switchToMarkdown = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlContent(html);
      const md = htmlToMarkdown(html);
      setMarkdownContent(md);
    }
    setMode('markdown');
  };

  const switchToWysiwyg = async () => {
    if (markdownContent.trim()) {
      const html = await marked(markdownContent);
      setHtmlContent(html as string);
      if (editorRef.current) {
        editorRef.current.innerHTML = html as string;
      }
    } else if (htmlContent && editorRef.current) {
      editorRef.current.innerHTML = htmlContent;
    }
    setMode('wysiwyg');
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
    <div className="w-full max-w-6xl mx-auto p-6 space-y-4">
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Editor de Texto</h1>
          </div>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>{wordCount} palabras</span>
            <span>•</span>
            <span>{charCount} caracteres</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-2 border-b">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFormat('bold')}
            title="Negrita"
            disabled={mode === 'markdown'}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFormat('italic')}
            title="Cursiva"
            disabled={mode === 'markdown'}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFormat('underline')}
            title="Subrayado"
            disabled={mode === 'markdown'}
          >
            <Underline className="h-4 w-4" />
          </Button>

          <div className="w-px h-8 bg-border mx-1" />

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFormat('justifyLeft')}
            title="Alinear izquierda"
            disabled={mode === 'markdown'}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFormat('justifyCenter')}
            title="Alinear centro"
            disabled={mode === 'markdown'}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFormat('justifyRight')}
            title="Alinear derecha"
            disabled={mode === 'markdown'}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="w-px h-8 bg-border mx-1" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Guardar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Descargar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpload}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Cargar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            Limpiar
          </Button>
        </div>

        <Tabs value={mode} onValueChange={(v) => {
          if (v === 'markdown' && mode === 'wysiwyg') {
            switchToMarkdown();
          } else if (v === 'wysiwyg' && mode === 'markdown') {
            switchToWysiwyg();
          }
        }}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="wysiwyg" className="gap-2">
              <Eye className="h-4 w-4" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="markdown" className="gap-2">
              <Code className="h-4 w-4" />
              Markdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wysiwyg" className="mt-4">
            <div
              ref={editorRef}
              contentEditable
              onInput={(e) => {
                setHtmlContent(e.currentTarget.innerHTML);
                updateStats();
              }}
              className="min-h-[500px] p-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              style={{
                lineHeight: '1.6',
                fontSize: '16px',
              }}
            />
          </TabsContent>

          <TabsContent value="markdown" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Markdown</h3>
                <textarea
                  ref={markdownRef}
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  className="min-h-[500px] w-full p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background font-mono resize-none text-sm"
                  placeholder="Escribe tu contenido en Markdown...\n\n# Título\n## Subtítulo\n**negrita** *cursiva*\n- Lista\n- Elementos"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Vista Previa</h3>
                <div
                  className="min-h-[500px] p-4 border rounded-md bg-muted/30 prose prose-sm max-w-none overflow-auto"
                  dangerouslySetInnerHTML={{ __html: marked(markdownContent) as string }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
