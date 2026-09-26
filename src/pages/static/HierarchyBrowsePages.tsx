import React, { useState, useEffect } from 'react';
import { useRouter, Link } from '../../context/RouterContext';
import { api } from '../../services/api';
import { University, Course, Semester, Subject } from '../../types';
import { GraduationCap, BookOpen, Layers, ArrowRight, Sparkles } from 'lucide-react';

export const UniversitiesBrowsePage: React.FC = () => {
  const { navigate } = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getUniversities()
      .then((data) => setUniversities(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          Curriculum Explorer
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
          Browse by University
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select your university to access course-specific B.A. study notes aligned with your exact exam pattern.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 skeleton-shimmer h-48 flex flex-col justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-300/60 dark:bg-slate-700/60 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-300/60 dark:bg-slate-700/60 rounded w-3/4" />
                  <div className="h-3 bg-slate-300/40 dark:bg-slate-700/40 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-slate-300/40 dark:bg-slate-700/40 rounded w-full" />
              <div className="h-4 bg-slate-300/50 dark:bg-slate-700/50 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {universities.map((u) => (
            <div
              key={u.id}
              onClick={() => navigate(`/shop?universityId=${u.id}`)}
              className="group cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-400 hover:shadow-xl dark:hover:shadow-indigo-950/20 transition-all space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-indigo-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-center font-black text-indigo-600 text-lg">
                  {u.logo && !u.logo.includes('calcutta') ? (
                    <img
                      src={u.logo}
                      alt={u.name}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="font-extrabold text-base text-indigo-600 dark:text-indigo-400">
                      {u.code}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase">
                    {u.code}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-1 truncate">
                    {u.name}
                  </h3>
                  <div className="text-[11px] text-slate-400">{u.state}</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{u.description}</p>
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-800">
                <span>View Available Notes</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CoursesBrowsePage: React.FC = () => {
  const { navigate } = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getCourses()
      .then((data) => setCourses(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          Degree Programs
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
          Undergraduate Courses
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore structured notes and question banks for B.A. Programme, B.A. Honours, and related degrees.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 skeleton-shimmer h-40 flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-300/60 dark:bg-slate-700/60" />
              <div className="h-4 bg-slate-300/60 dark:bg-slate-700/60 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/shop?courseId=${c.id}`)}
              className="group cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-400 hover:shadow-lg transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {c.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {c.durationYears} Years Duration • {c.totalSemesters} Semesters Structure
              </p>
              <div className="pt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <span>Browse Course Notes</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const SemestersBrowsePage: React.FC = () => {
  const { navigate } = useRouter();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getSemesters()
      .then((data) => setSemesters(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          Academic Progression
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
          Browse by Semester
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Find notes categorized by your ongoing semester or clear backlogs in specific past semesters.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 skeleton-shimmer h-36 flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-300/60 dark:bg-slate-700/60" />
              <div className="h-4 bg-slate-300/60 dark:bg-slate-700/60 rounded w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {semesters.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/shop?semesterId=${s.id}`)}
              className="group cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all text-center space-y-2.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-extrabold text-xl mx-auto group-hover:scale-110 transition-transform">
                {s.number}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {s.name}
              </h3>
              <span className="text-[10px] text-slate-400 block font-semibold">CBCS / NEP Syllabus</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const SubjectsBrowsePage: React.FC = () => {
  const { navigate } = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getSubjects()
      .then((data) => setSubjects(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          Disciplines
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
          B.A. Subject Disciplines
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select a subject discipline to view high-scoring model answers and revision summaries.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 skeleton-shimmer h-36 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-300/60 dark:bg-slate-700/60" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-300/60 dark:bg-slate-700/60 rounded w-3/4" />
                  <div className="h-3 bg-slate-300/40 dark:bg-slate-700/40 rounded w-1/3" />
                </div>
              </div>
              <div className="h-3 bg-slate-300/50 dark:bg-slate-700/50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate(`/shop?subjectId=${sub.id}`)}
              className="group cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-400 hover:shadow-lg transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {sub.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Discipline Code: {sub.code}</p>
              <div className="pt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <span>Explore Notes</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
