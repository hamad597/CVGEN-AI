import React from 'react';
import { CVData, Experience, Education } from './types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Sparkles, User, Briefcase, GraduationCap, Wrench, Palette } from 'lucide-react';
import { generateSummary, improveBulletPoint, suggestSkills } from './services/gemini';
import { motion, AnimatePresence } from 'motion/react';

interface CVEditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export function CVEditor({ data, onChange }: CVEditorProps) {
  const updatePersonalInfo = (field: keyof CVData['personalInfo'], value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(exp => exp.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const handleAISummary = async () => {
    const details = `${data.personalInfo.fullName} is a professional with experience in ${data.experience.map(e => e.position).join(', ')}.`;
    const summary = await generateSummary(details);
    if (summary) updatePersonalInfo('summary', summary);
  };

  const handleImproveExp = async (id: string, text: string) => {
    const improved = await improveBulletPoint(text);
    if (improved) updateExperience(id, 'description', improved);
  };

  const handleSuggestSkills = async () => {
    const lastJob = data.experience[0]?.position || "Professional";
    const suggested = await suggestSkills(lastJob);
    if (suggested) {
      const newSkills = suggested.split(',').map(s => s.trim());
      onChange({ ...data, skills: Array.from(new Set([...data.skills, ...newSkills])) });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Personal Info */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/20">
                {data.personalInfo.photoUrl ? (
                  <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder="New York, NY"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="summary">Professional Summary</Label>
              <Button variant="ghost" size="sm" onClick={handleAISummary} className="text-xs h-7 gap-1">
                <Sparkles className="w-3 h-3" />
                AI Generate
              </Button>
            </div>
            <Textarea
              id="summary"
              value={data.personalInfo.summary}
              onChange={(e) => updatePersonalInfo('summary', e.target.value)}
              placeholder="Briefly describe your professional background..."
              className="h-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <CardTitle>Work Experience</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={addExperience}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence>
            {data.experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 border rounded-lg relative group bg-card/50"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  onClick={() => removeExperience(exp.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="Job Title"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      placeholder="Present or MM/YYYY"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Description</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleImproveExp(exp.id, exp.description)} 
                      className="text-xs h-7 gap-1"
                      disabled={!exp.description}
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Improve
                    </Button>
                  </div>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <CardTitle>Education</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.education.map((edu) => (
            <div key={edu.id} className="p-4 border rounded-lg relative group bg-card/50">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                onClick={() => removeEducation(edu.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>School</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder="University Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Science"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    placeholder="YYYY"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    placeholder="YYYY"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            <CardTitle>Skills</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSuggestSkills} className="text-xs h-7 gap-1">
            <Sparkles className="w-3 h-3" />
            Suggest Skills
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                {skill}
                <button 
                  onClick={() => onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) })}
                  className="hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <Input
            placeholder="Add a skill and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && !data.skills.includes(val)) {
                  onChange({ ...data, skills: [...data.skills, val] });
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </CardContent>
      </Card>
      {/* Hobbies */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <CardTitle>Hobbies & Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {data.hobbies?.map((hobby, index) => (
              <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md text-sm">
                {hobby}
                <button 
                  onClick={() => onChange({ ...data, hobbies: data.hobbies.filter((_, i) => i !== index) })}
                  className="hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <Input
            placeholder="Add a hobby and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && !data.hobbies?.includes(val)) {
                  onChange({ ...data, hobbies: [...(data.hobbies || []), val] });
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
