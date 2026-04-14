import React from 'react';
import { CVData, TemplateType } from './types';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CVPreviewProps {
  data: CVData;
  template: TemplateType;
}

export function CVPreview({ data, template }: CVPreviewProps) {
  const { personalInfo, experience, education, skills, hobbies } = data;

  const renderModern = () => (
    <div className="bg-white text-slate-900 min-h-[1120px] p-12 shadow-inner font-sans">
      {/* Header */}
      <header className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
        <div className="flex-1">
          <h1 className="text-5xl font-bold tracking-tighter uppercase mb-2">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
            {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {personalInfo.phone}</span>}
            {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {personalInfo.location}</span>}
          </div>
        </div>
        {personalInfo.photoUrl && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-900 ml-8">
            <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      <div className="grid grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="col-span-8 space-y-8">
          {personalInfo.summary && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Summary</h2>
              <p className="text-slate-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <span className="text-sm font-medium text-slate-500">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-slate-800 font-medium mb-2">{exp.company}</div>
                  <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">{edu.degree}</h3>
                    <span className="text-sm font-medium text-slate-500">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <div className="text-slate-800 text-sm">{edu.school}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-8">
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="bg-slate-100 text-slate-800 px-2 py-1 text-xs font-bold uppercase tracking-tighter">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {hobbies && hobbies.length > 0 && (
            <section>
              <h2 className="text-lg font-bold uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Hobbies</h2>
              <div className="flex flex-wrap gap-2">
                {hobbies.map((hobby, i) => (
                  <span key={i} className="text-slate-600 text-sm">
                    {hobby}{i < hobbies.length - 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderClassic = () => (
    <div className="bg-white text-black min-h-[1120px] p-16 font-serif">
      <div className="text-center border-b border-black pb-6 mb-8">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="text-sm space-x-2">
          <span>{personalInfo.location}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.email}</span>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-bold border-b border-black mb-3 uppercase">Professional Summary</h2>
          <p className="text-sm leading-relaxed italic">{personalInfo.summary}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold border-b border-black mb-4 uppercase">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold">
                  <span>{exp.company}</span>
                  <span>{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="italic mb-2">{exp.position}</div>
                <p className="text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold border-b border-black mb-4 uppercase">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between font-bold">
                  <span>{edu.school}</span>
                  <span>{edu.startDate} — {edu.endDate}</span>
                </div>
                <div>{edu.degree}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold border-b border-black mb-3 uppercase">Skills</h2>
          <p className="text-sm">{skills.join(', ')}</p>
        </section>

        {hobbies && hobbies.length > 0 && (
          <section>
            <h2 className="text-lg font-bold border-b border-black mb-3 uppercase">Hobbies</h2>
            <p className="text-sm italic">{hobbies.join(', ')}</p>
          </section>
        )}
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="bg-white text-zinc-800 min-h-[1120px] p-12 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-light tracking-tight mb-4">{personalInfo.fullName || 'Your Name'}</h1>
          <div className="text-xs text-zinc-500 flex gap-4">
            <span>{personalInfo.email}</span>
            <span>{personalInfo.phone}</span>
            <span>{personalInfo.location}</span>
          </div>
        </header>

        <div className="space-y-12">
          <section>
            <p className="text-sm leading-relaxed text-zinc-600">{personalInfo.summary}</p>
          </section>

          <section>
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-4 gap-4">
                  <div className="text-xs text-zinc-400 pt-1">{exp.startDate} — {exp.endDate}</div>
                  <div className="col-span-3">
                    <h3 className="text-sm font-bold mb-1">{exp.position}</h3>
                    <div className="text-xs text-zinc-500 mb-3">{exp.company}</div>
                    <p className="text-xs leading-relaxed text-zinc-600 whitespace-pre-line">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Education</h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-4 gap-4">
                  <div className="text-xs text-zinc-400 pt-1">{edu.startDate} — {edu.endDate}</div>
                  <div className="col-span-3">
                    <h3 className="text-sm font-bold mb-1">{edu.degree}</h3>
                    <div className="text-xs text-zinc-500">{edu.school}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Skills</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {skills.map((skill, i) => (
                <span key={i} className="text-xs text-zinc-600">{skill}</span>
              ))}
            </div>
          </section>

          {hobbies && hobbies.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Hobbies</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {hobbies.map((hobby, i) => (
                  <span key={i} className="text-xs text-zinc-600">{hobby}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderCreative = () => (
    <div className="bg-white text-indigo-950 min-h-[1120px] flex font-sans">
      {/* Left Column */}
      <div className="w-1/3 bg-indigo-900 text-white p-10 space-y-10">
        <div className="text-center">
          {personalInfo.photoUrl ? (
            <img src={personalInfo.photoUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-indigo-400 object-cover" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-indigo-800 mx-auto mb-6 flex items-center justify-center border-4 border-indigo-400">
              <span className="text-4xl font-bold">{personalInfo.fullName?.[0]}</span>
            </div>
          )}
          <h1 className="text-2xl font-bold mb-2">{personalInfo.fullName}</h1>
          <p className="text-indigo-300 text-sm uppercase tracking-widest">{experience[0]?.position}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-indigo-700 pb-2">Contact</h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-indigo-400" /> {personalInfo.email}</div>
            <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-indigo-400" /> {personalInfo.phone}</div>
            <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-indigo-400" /> {personalInfo.location}</div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-indigo-700 pb-2">Skills</h2>
          <div className="space-y-2">
            {skills.map((skill, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span>{skill}</span>
                <div className="w-16 h-1 bg-indigo-800 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-indigo-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {hobbies && hobbies.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-indigo-700 pb-2">Hobbies</h2>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby, i) => (
                <span key={i} className="text-xs text-indigo-200">{hobby}</span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Column */}
      <div className="flex-1 p-12 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-8 bg-indigo-500 rounded-full" />
            Profile
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">{personalInfo.summary}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-indigo-500 rounded-full" />
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-indigo-100">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white" />
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-indigo-900">{exp.position}</h3>
                  <span className="text-xs font-bold text-indigo-400">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-sm font-medium text-slate-500 mb-2">{exp.company}</div>
                <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-indigo-500 rounded-full" />
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="relative pl-6 border-l-2 border-indigo-100">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500 border-4 border-white" />
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-indigo-900">{edu.degree}</h3>
                  <span className="text-xs font-bold text-indigo-400">{edu.startDate} — {edu.endDate}</span>
                </div>
                <div className="text-sm font-medium text-slate-500">{edu.school}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const templates = {
    modern: renderModern,
    classic: renderClassic,
    minimal: renderMinimal,
    creative: renderCreative
  };

  return (
    <div className="cv-container bg-white shadow-2xl overflow-hidden">
      {templates[template]()}
    </div>
  );
}
