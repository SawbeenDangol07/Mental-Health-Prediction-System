import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  HelpCircle, 
  PhoneCall, 
  RotateCcw,
  Calendar,
  X
} from 'lucide-react';
import { MENTAL_HEALTH_CLASSES } from '../services/mockApi';
import { HumanClassIconMap } from './HumanClassIcons';

export const PredictionCard = ({ prediction, onReset, onClose }) => {
  if (!prediction) return null;

  const { inputText, label, confidence, timestamp } = prediction;
  const info = MENTAL_HEALTH_CLASSES[label] || MENTAL_HEALTH_CLASSES.Normal;
  const IconComponent = HumanClassIconMap[label] || HumanClassIconMap.Normal;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-3xl border ${info.borderColor} bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl ${info.shadow} transition-all max-w-2xl w-full mx-auto text-left`}
    >
      {/* Top Right Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
          title="Close Popup"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header Badge & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80 pr-6 sm:pr-8">
        
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-2xl ${info.iconBg || 'bg-teal-600'} text-white shadow-md`}>
            <IconComponent className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full ${info.bgColor} ${info.textColor}`}>
                {info.badgeText}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {info.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Guidance Box */}
      <div className="my-6">
        {/* Recommendation Box */}
        <div className={`p-4 rounded-2xl ${info.bgColor} border ${info.borderColor}`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider ${info.textColor} mb-1 flex items-center gap-1.5`}>
            <HelpCircle className="w-4 h-4" />
            Recommended Guidance
          </h4>
          <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
            {info.recommendation}
          </p>
          
          {info.helpline && (
            <div className="mt-3 pt-3 border-t border-rose-500/30 flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>{info.helpline}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-teal-500" />
          <span>Classified by Linear Support Vector Machine (SVM) Model</span>
        </div>

        {onReset && (
          <button
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Analyze Another Feeling</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
