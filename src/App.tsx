import React, { useState, useEffect } from 'react';
import { CVData, TemplateType } from './types';
import { CVEditor } from './CVEditor';
import { CVPreview } from './CVPreview';
import { VoiceControl } from './VoiceControl';
import { Button } from '@/components/ui/button';
import { 
  Printer, 
  Layout, 
  Download, 
  Moon, 
  Sun, 
  FileText, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'motion/react';

const INITIAL_DATA: CVData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
    photoUrl: ''
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  hobbies: []
};

export default function App() {
  const [data, setData] = useState<CVData>(() => {
    const saved = localStorage.getItem('cv-data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('cv-data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (data.personalInfo.fullName) {
      document.title = `${data.personalInfo.fullName} - CV`;
    } else {
      document.title = 'CV Generator';
    }
  }, [data.personalInfo.fullName]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${isDarkMode ? 'dark' : ''}`}>
      {/* Print-only container (outside main layout) */}
      <div className="hidden print:block print:static print:w-full">
        <CVPreview data={data} template={template} />
      </div>

      {/* Navigation / Header */}
      <header className="no-print sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">CVGen <span className="text-primary">AI</span></span>
          </div>

          <div className="flex items-center gap-4">
            <VoiceControl data={data} onChange={setData} />
            
            <div className="h-6 w-[1px] bg-border mx-2" />
            
            <Select value={template} onValueChange={(v) => setTemplate(v as TemplateType)}>
              <SelectTrigger className="w-[140px]">
                <Layout className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print / PDF
            </Button>

            <a 
              href={window.location.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="no-print inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-8 w-8 transition-colors cursor-pointer"
              title="Open in new tab (Recommended for Printing)"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-screen-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel: Editor */}
          <section className="no-print space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Editor</h2>
              <Button variant="ghost" size="sm" onClick={() => setData(INITIAL_DATA)} className="text-muted-foreground">
                Reset All
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
              <CVEditor data={data} onChange={setData} />
            </ScrollArea>
          </section>

          {/* Right Panel: Preview */}
          <section className="relative group">
            <div className="no-print flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Preview</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="capitalize">{template}</span> Template
              </div>
            </div>
            
            <div className="sticky top-24 transition-all duration-500 ease-in-out">
              <ScrollArea className="h-[calc(100vh-12rem)] rounded-xl border shadow-2xl bg-muted/50 p-4 lg:p-8 overflow-hidden">
                <motion.div
                  key={template}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CVPreview data={data} template={template} />
                </motion.div>
              </ScrollArea>
              
              {/* Floating AI Tip */}
              <div className="no-print absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
                <Sparkles className="w-4 h-4" />
                Try "Add skill React"
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

