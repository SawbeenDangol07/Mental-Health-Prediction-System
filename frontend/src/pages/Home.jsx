import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  BrainCircuit, 
  AlertCircle, 
  RefreshCw, 
  Heart,
  MessageSquare,
  Lock,
  LogIn,
  UserPlus,
  X,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockPredictionService } from '../services/mockApi';
import { PredictionCard } from '../components/PredictionCard';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // COMPULSORY LOGIN CHECK
    if (!user) {
      setShowAuthModal(true);
      return;
    }

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
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold uppercase tracking-wider border border-blue-500/20"
          >
            <BrainCircuit className="w-4 h-4 text-blue-500" />
            <span>Support Vector Machine (SVM) Classification</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>by <strong className="text-blue-600 dark:text-blue-400 font-extrabold">Sabin Dangol</strong></span>
          </motion.div>
        </div>

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
        
        {/* Unauthenticated Login Notice Banner */}
        {!user && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-3 text-amber-700 dark:text-amber-300 text-xs sm:text-sm">
              <Lock className="w-5 h-5 shrink-0 text-amber-500" />
              <span>
                <strong>Login Required:</strong> You must be signed in to analyze your mental health and save your results.
              </span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-500/10 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}

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

      {/* COMPULSORY LOGIN MODAL POPUP */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center border border-slate-200 dark:border-slate-800"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                <Lock className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Login Required
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                You must be logged in to analyze your feelings and receive your SVM mental health prediction.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In Now</span>
                </button>

                <button
                  onClick={() => navigate('/signup')}
                  className="w-full py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm transition-all flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create an Account</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

    </div>
  );
};
