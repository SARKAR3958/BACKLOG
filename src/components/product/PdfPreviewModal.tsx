import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShieldCheck, Lock, Sparkles, CheckCircle2, FileText, Eye } from 'lucide-react';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  previewImages: string[];
  totalPages: number;
  sampleTopics?: string[];
  price: number;
  onBuyNow: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  previewImages,
  totalPages,
  sampleTopics,
  price,
  onBuyNow,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) return null;

  const images = previewImages && previewImages.length > 0 ? previewImages : [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[96vh] sm:max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/90 dark:border-slate-800 animate-in zoom-in-95 duration-150 my-auto">
        {/* Header with Title & Close */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/95 shrink-0">
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-md shadow-xs">
                Sample Preview
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
                Extract {currentPage + 1} of {images.length} • ({totalPages} Total Pages)
              </span>
            </div>
            <h3 className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white truncate mt-1">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0 cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable area with document view and details */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100 dark:bg-slate-950 flex flex-col lg:flex-row gap-5 items-stretch">
          {/* Main Sample Document View */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[320px] sm:min-h-[440px]">
            {/* Top document pagination bar */}
            <div className="bg-slate-50 dark:bg-slate-850 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" /> Page {currentPage + 1} Preview
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Prev</span>
                </button>
                <span className="text-xs font-mono font-bold px-2 text-slate-600 dark:text-slate-300">
                  {currentPage + 1} / {images.length}
                </span>
                <button
                  type="button"
                  disabled={currentPage === images.length - 1}
                  onClick={() => setCurrentPage((p) => Math.min(images.length - 1, p + 1))}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span> <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document page preview canvas with security watermark */}
            <div className="relative flex-1 bg-slate-200/50 dark:bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none min-h-[280px]">
              <img
                src={images[currentPage]}
                alt={`Sample page ${currentPage + 1}`}
                className="max-h-[380px] sm:max-h-[480px] w-auto max-w-full object-contain rounded-lg shadow-md border border-slate-300 dark:border-slate-800"
              />

              {/* Watermark overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-30 select-none">
                <div className="rotate-[-30deg] text-center font-black text-slate-900 dark:text-white text-lg sm:text-2xl tracking-widest uppercase py-4">
                  BACKLOG SAVER SAMPLE
                  <div className="text-[10px] sm:text-xs tracking-normal font-bold">EXAM REVISION PREVIEW</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right/Bottom Feature Breakdown & Purchase Card */}
          <div className="w-full lg:w-80 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-sm shrink-0">
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60">
                <Lock className="w-3.5 h-3.5" />
                <span>Full Document Protected</span>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">What You Get in Full PDF:</h4>
                <ul className="mt-2 space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Complete <strong>{totalPages} High-Yield Pages</strong> (clean searchable PDF)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Previous 7-Year Solved Exam Questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>15-Mark Structured Model Essay Answers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Instant download & lifetime access in student portal</span>
                  </li>
                </ul>
              </div>

              {sampleTopics && sampleTopics.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Syllabus Units:</h5>
                  <div className="space-y-1">
                    {sampleTopics.slice(0, 3).map((topic, i) => (
                      <div key={i} className="text-[11px] text-slate-600 dark:text-slate-400 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="truncate">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Unlock Button */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">One-time Price:</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">₹{price}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">Instant Digital Access</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBuyNow();
                }}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Unlock Full PDF (₹{price})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
