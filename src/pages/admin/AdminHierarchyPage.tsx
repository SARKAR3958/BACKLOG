import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../services/api';
import { University, Course, Semester, Subject } from '../../types';
import { Layers, GraduationCap, BookOpen, CheckCircle2 } from 'lucide-react';

export const AdminHierarchyPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'universities' | 'courses' | 'semesters' | 'subjects'>('universities');
  const [universities, setUniversities] = useState<University[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [u, c, s, sub] = await Promise.all([
          api.getUniversities(),
          api.getCourses(),
          api.getSemesters(),
          api.getSubjects(),
        ]);
        setUniversities(u);
        setCourses(c);
        setSemesters(s);
        setSubjects(sub);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <AdminLayout activeTab="hierarchy">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Curriculum & Education Hierarchy</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              University → Course → Semester → Subject dynamic educational architecture (PRD Section 13).
            </p>
          </div>

          <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['universities', 'courses', 'semesters', 'subjects'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                  activeSubTab === tab
                    ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Universities */}
        {activeSubTab === 'universities' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Configured universities across India offering B.A. programs:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {universities.map((univ) => (
                <div key={univ.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{univ.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                      {univ.code}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{univ.state}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{univ.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Courses */}
        {activeSubTab === 'courses' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Configured degrees and degree specializations:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => {
                const u = universities.find((univ) => univ.id === course.universityId);
                return (
                  <div key={course.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{course.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                        {course.code}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">University: {u?.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Semesters */}
        {activeSubTab === 'semesters' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Academic semesters configured across programs:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {semesters.map((sem) => (
                <div key={sem.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
                  <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{sem.number}</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{sem.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Subjects */}
        {activeSubTab === 'subjects' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Available B.A. academic disciplines:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subjects.map((sub) => (
                <div key={sub.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{sub.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Code: {sub.code}</div>
                  </div>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded font-mono">
                    {sub.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
