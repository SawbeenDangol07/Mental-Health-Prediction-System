import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon, 
  Trash2, 
  Filter, 
  Search, 
  Calendar, 
  BrainCircuit, 
  CheckCircle2, 
  BarChart2,
  FileText
} from 'lucide-react';
import { mockPredictionService, MENTAL_HEALTH_CLASSES } from '../services/mockApi';
import { HumanClassIconMap } from '../components/HumanClassIcons';

export const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const records = await mockPredictionService.getHistory();
      setHistoryItems(records);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your prediction history?')) {
      try {
        await mockPredictionService.clearHistory();
        setHistoryItems([]);
      } catch (err) {
        alert('Failed to clear history on server.');
      }
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesFilter = selectedFilter === 'All' || item.label === selectedFilter;
    const matchesSearch =
      item.inputText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['All', 'Normal', 'Depression', 'Anxiety', 'Bipolar', 'Suicidal'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Saved Records</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Prediction History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review past mental health assessments, timestamps, and SVM model confidence scores.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="self-start md:self-auto flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/60 dark:border-rose-800/60 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === cat
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

      </div>

      {/* History Items List */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <HistoryIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No history records found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {searchQuery || selectedFilter !== 'All'
              ? 'Try adjusting your search or category filter.'
              : 'Submit your first feeling on the Home page to start logging records!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              const classInfo = MENTAL_HEALTH_CLASSES[item.label] || MENTAL_HEALTH_CLASSES.Normal;
              const IconComp = HumanClassIconMap[item.label] || HumanClassIconMap.Normal;

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-panel rounded-2xl p-4 border ${classInfo.borderColor} hover:shadow-lg transition-all`}
                >
                  {/* Class Badge & Timestamp */}
                  <div className="flex flex-wrap items-center justify-between w-full gap-2 mb-2.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${classInfo.bgColor} ${classInfo.textColor} flex items-center space-x-1.5`}>
                      <IconComp className="w-4 h-4" />
                      <span>{classInfo.title}</span>
                    </span>

                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {/* Inputted Feeling Text */}
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 italic">
                    "{item.inputText}"
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
};
