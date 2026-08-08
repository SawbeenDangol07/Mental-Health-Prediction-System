import React from 'react';
import { Sparkles } from 'lucide-react';
import { MENTAL_HEALTH_CLASSES } from '../services/mockApi';
import { HumanClassIconMap } from './HumanClassIcons';

export const ClassPreviewCards = () => {
  const classesList = Object.values(MENTAL_HEALTH_CLASSES);

  return (
    <div className="mt-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>System Capabilities</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Supported Mental Health Classes
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
          Our SVM classifier is trained to categorize user emotions into 5 distinct mental health classes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {classesList.map((item) => {
          const IconComponent = HumanClassIconMap[item.key] || HumanClassIconMap.Normal;

          return (
            <div
              key={item.key}
              className={`rounded-2xl p-5 border ${item.borderColor} glass-card transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl ${item.iconBg || 'bg-blue-500'} text-white flex items-center justify-center shadow-md mb-4`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {item.key}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed mt-2">
                  {item.summary}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
