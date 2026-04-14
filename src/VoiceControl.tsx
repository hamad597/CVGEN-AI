import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Command, Info } from 'lucide-react';
import { CVData } from './types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VoiceControlProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export function VoiceControl({ data, onChange }: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    // Name command
    if (lowerText.startsWith('set name to ')) {
      const name = text.slice(12).trim();
      onChange({ ...data, personalInfo: { ...data.personalInfo, fullName: name } });
      setLastCommand(`Set name to "${name}"`);
    }
    
    // Email command
    else if (lowerText.startsWith('set email to ')) {
      const email = text.slice(13).trim().replace(/\s/g, '');
      onChange({ ...data, personalInfo: { ...data.personalInfo, email } });
      setLastCommand(`Set email to "${email}"`);
    }

    // Phone command
    else if (lowerText.startsWith('set phone to ')) {
      const phone = text.slice(13).trim();
      onChange({ ...data, personalInfo: { ...data.personalInfo, phone } });
      setLastCommand(`Set phone to "${phone}"`);
    }

    // Location command
    else if (lowerText.startsWith('set location to ')) {
      const location = text.slice(16).trim();
      onChange({ ...data, personalInfo: { ...data.personalInfo, location } });
      setLastCommand(`Set location to "${location}"`);
    }

    // Skill command
    else if (lowerText.startsWith('add skill ')) {
      const skill = text.slice(10).trim();
      if (!data.skills.includes(skill)) {
        onChange({ ...data, skills: [...data.skills, skill] });
        setLastCommand(`Added skill "${skill}"`);
      }
    }

    // Hobby command
    else if (lowerText.startsWith('add hobby ')) {
      const hobby = text.slice(10).trim();
      if (!data.hobbies?.includes(hobby)) {
        onChange({ ...data, hobbies: [...(data.hobbies || []), hobby] });
        setLastCommand(`Added hobby "${hobby}"`);
      }
    }

    // Summary command
    else if (lowerText.startsWith('set summary to ')) {
      const summary = text.slice(15).trim();
      onChange({ ...data, personalInfo: { ...data.personalInfo, summary } });
      setLastCommand(`Set summary`);
    }
  }, [data, onChange]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;
          setTranscript(finalTranscript);
          processCommand(finalTranscript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening, processCommand]);

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={() => setIsListening(!isListening)}
          className="gap-2"
        >
          {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
          {isListening ? "Listening..." : "Voice Control"}
        </Button>
        
        <AnimatePresence>
          {isListening && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-full mt-2 left-0 w-64 bg-background border rounded-md p-2 text-xs shadow-lg z-50"
            >
              <p className="text-muted-foreground mb-1 font-bold">Current Transcript:</p>
              <p className="italic">"{transcript}"</p>
              {lastCommand && (
                <p className="mt-2 text-primary font-bold">✓ {lastCommand}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog>
        <DialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
          <Info className="w-4 h-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help & Voice Commands</DialogTitle>
            <DialogDescription>
              Tips and commands to help you build your CV:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 text-sm">
            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
              <h3 className="font-bold text-primary mb-1">🖨️ Printing Tip</h3>
              <p className="text-xs leading-relaxed">
                If the <strong>Print / PDF</strong> button doesn't respond in this preview window, click the <strong>External Link icon (↗️)</strong> next to it to open the app in a new tab. Printing works best in a full browser tab!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="font-bold">Command</div>
              <div className="font-bold">Action</div>
              
              <code className="bg-muted p-1 rounded">"Set name to [Name]"</code>
              <span>Updates full name</span>
              
              <code className="bg-muted p-1 rounded">"Set email to [Email]"</code>
              <span>Updates email address</span>
              
              <code className="bg-muted p-1 rounded">"Set phone to [Phone]"</code>
              <span>Updates phone number</span>
              
              <code className="bg-muted p-1 rounded">"Set location to [City]"</code>
              <span>Updates location</span>
              
              <code className="bg-muted p-1 rounded">"Add skill [Skill]"</code>
              <span>Adds a new skill</span>
              
              <code className="bg-muted p-1 rounded">"Add hobby [Hobby]"</code>
              <span>Adds a new hobby</span>
              
              <code className="bg-muted p-1 rounded">"Set summary to [Text]"</code>
              <span>Updates summary</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
