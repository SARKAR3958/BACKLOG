import React from 'react';
import { Link } from '../../context/RouterContext';
import { GraduationCap, ShieldCheck, BookOpen, CheckCircle2, Award, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 animate-in fade-in duration-300">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
          About Backlog Saver
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Helping Indian Students Clear Backlogs with Confidence
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          BACKLOG SAVER is India's dedicated educational digital marketplace connecting undergraduate students with syllabus-aligned, high-yield PDF study notes.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
        <p>
          Undergraduate degree programs in India under the Choice Based Credit System (CBCS) and National Education Policy (NEP) feature comprehensive and challenging curriculums. When students face an unexpected backlog or need to prepare for critical semester exams, standard textbooks spanning 700+ pages of dense prose can cause overwhelming panic.
        </p>
        <p>
          Backlog Saver bridges this gap by offering structured, exam-oriented study materials crafted by experienced subject educators. Every module focuses on what university examiners specifically evaluate: clear introductory thesis statements, point-wise theoretical frameworks, comparative diagrams, and 15-mark essay structures.
        </p>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">Who It Is For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">Backlog Clearance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Students needing high-scoring revision materials to clear repeat or backlog papers without risking their degree timeline.</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">Regular Semester Exams</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Full-time B.A., B.Com, and arts students seeking high-yield summaries to revise 6 months of syllabus in 2 weeks.</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">Authorized Educational Content Policy</h2>
        <p>
          BACKLOG SAVER maintains strict adherence to educational intellectual property laws. We only publish and distribute original study summaries, author-licensed revision frameworks, and analytical question guides. We firmly oppose the unauthorized sharing of copyrighted textbooks or scanned pirated materials.
        </p>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="font-bold">Important Notice Regarding University Affiliation:</div>
          <p className="leading-relaxed">
            BACKLOG SAVER is an independent digital educational publisher. We are not officially affiliated with, endorsed by, or authorized by Delhi University, University of Mumbai, or any specific state or central university. All university titles and course names are referenced strictly for descriptive curriculum classification purposes.
          </p>
        </div>
      </div>
    </div>
  );
};
