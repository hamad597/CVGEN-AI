export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
    photoUrl: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  hobbies: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export type TemplateType = 'modern' | 'classic' | 'minimal' | 'creative';
