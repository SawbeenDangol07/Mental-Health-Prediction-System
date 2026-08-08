import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  BrainCircuit, 
  AlertCircle, 
  RefreshCw, 
  Heart,
  MessageSquare,
  Info
} from 'lucide-react';
import { mockPredictionService } from '../services/mockApi';
import { PredictionCard } from '../components/PredictionCard';
import { ClassPreviewCards } from '../components/ClassPreviewCards';

export const Home = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!inputText.trim()) {
      setError('Please type your feelings or how your day went before submitting.');
      return;
    }

    setError('');
    setLoading(true);
    setPrediction(null);

    try {
      const result = await mockPredictionService.predict(inputText);
      setPrediction(result);
    } catch (err) {
      setError(err.message || 'An error occurred while connecting to the prediction system.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Hero Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-blue-500/20"
        >
          <BrainCircuit className="w-4 h-4 text-blue-500" />
          <span>Support Vector Machine (SVM) Classification</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
        >
          Express How You Feel, <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
            Discover Mental Health Insights
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed"
        >
          Type your emotions, thoughts, or feelings in your own words. Our AI model analyzes sentiment and text patterns to predict mental health categories instantly.
        </motion.p>
      </div>

      {/* Main Form & Prediction Area */}
      <div className="max-w-3xl mx-auto">
        
        {/* Input Card Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <label 
                  htmlFor="feeling-input"
                  className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-slate-200"
                >
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>How are you feeling today?</span>
                </label>

                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {inputText.length} characters
                </span>
              </div>

              <div className="relative">
                <textarea
                  id="feeling-input"
                  rows="6"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. I have been feeling quite overwhelmed and anxious about upcoming exams, finding it hard to relax..."
                  className="w-full p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all resize-none text-base min-h-[180px]"
                />
              </div>

              {error && (
                <div className="flex items-center space-x-2 mt-2 text-rose-500 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing Feelings with SVM...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Analyze Mental Health</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </motion.div>

      {/* Modal Popup Prediction Results */}
      <AnimatePresence>
        {prediction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPrediction(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-2xl my-auto"
            >
              <PredictionCard 
                prediction={prediction} 
                onClose={() => setPrediction(null)}
                onReset={() => {
                  setPrediction(null);
                  setInputText('');
                }} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>

      {/* Supported Classes Explorer Section */}
      <ClassPreviewCards />

    </div>
  );
};
