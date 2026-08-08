import React from 'react';
import { Heart, Shield, PhoneCall, BrainCircuit } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Column 1: Project Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-teal-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Mental Health Prediction System (SVM)
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Final Year Project utilizing Support Vector Machine (SVM) algorithm for natural language feeling analysis and early mental health classification.
            </p>
          </div>

          {/* Column 2: Supported Classes */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Supported Mental Health Classes
            </h4>
            <ul className="flex flex-wrap gap-2 text-xs">
              <li className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">Normal</li>
              <li className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-medium">Depression</li>
              <li className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">Anxiety</li>
              <li className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-medium">Bipolar</li>
              <li className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-medium">Suicidal</li>
            </ul>
          </div>

          {/* Column 3: Emergency Helpline Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-slate-700 dark:text-slate-300">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-semibold text-xs mb-1">
              <PhoneCall className="w-4 h-4" />
              <span>Need Immediate Support?</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
              This application is an AI research demonstrator. If you or someone you know is in distress, please contact national suicide prevention helplines immediately.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Mental Health Prediction SVM Project. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>using React & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
