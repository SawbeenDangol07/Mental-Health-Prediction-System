import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  HeartHandshake, 
  MessageSquareText, 
  BarChart3, 
  CheckCircle2
} from 'lucide-react';
import { ClassPreviewCards } from '../components/ClassPreviewCards';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-14 space-y-20 sm:space-y-28">
      
      {/* 1. HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto relative pt-4">
        
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold uppercase tracking-wider border border-blue-500/20"
          >
            <BrainCircuit className="w-4 h-4 text-blue-500" />
            <span>Support Vector Machine (SVM) ML Model</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Developed by <strong className="text-blue-600 dark:text-blue-400 font-extrabold">Sabin Dangol</strong></span>
          </motion.div>
        </div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]"
        >
          Empathetic AI for Your <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
            Mental Well-being & Clarity
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-6 text-slate-600 dark:text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto"
        >
          Express how you feel in your own words. Our Machine Learning model categorizes sentiment and text patterns into 5 distinct mental health states instantly.
        </motion.p>

        {/* Action Button: "Check Mental Health" */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate('/predict')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 group"
          >
            <BrainCircuit className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Check Mental Health</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 text-left">
          
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 flex items-start space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% Private & Confidential</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Your entries are evaluated client-side or via secure endpoints without tracking.
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 flex items-start space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Instant Classification</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Receive real-time category predictions and guidance within seconds.
              </p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 flex items-start space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">SVM Machine Learning</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Powered by Support Vector Machine (LinearSVC) and TF-IDF feature extraction.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* 2. SYSTEM CAPABILITIES SECTION (MOVED FROM DASHBOARD) */}
      <section className="pt-4">
        <ClassPreviewCards />
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800/80 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            How The Prediction System Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div className="relative text-center p-6 bg-slate-50/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Express Your Feelings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Type how your day went or express your emotional state in free-form natural language.
            </p>
          </div>

          <div className="relative text-center p-6 bg-slate-50/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              SVM Feature Analysis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our model extracts TF-IDF n-grams and sentiment metrics to compute classification hyperplanes.
            </p>
          </div>

          <div className="relative text-center p-6 bg-slate-50/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Instant Modal Insights
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A clean popup card opens presenting your category, human silhouette icon, and guidance.
            </p>
          </div>

        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION BANNER */}
      <section className="text-center bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Check Your Mental Well-being?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Take a moment for yourself today. Input how you're feeling and get instant machine learning classification insights.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/predict')}
              className="px-8 py-4 rounded-2xl bg-white text-blue-600 font-extrabold text-lg shadow-xl hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center space-x-2"
            >
              <HeartHandshake className="w-6 h-6 text-blue-600" />
              <span>Check Mental Health Now</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
