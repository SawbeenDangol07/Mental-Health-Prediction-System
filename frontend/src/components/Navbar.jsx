import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Sun, 
  Moon, 
  History, 
  Home as HomeIcon, 
  LogOut, 
  User, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  BrainCircuit
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 bg-blue-500 rounded-xl text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <BrainCircuit className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                MindCheck <span className="text-blue-500 dark:text-blue-400 font-extrabold">SVM</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                Mental Health AI Predictor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/history"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/history')
                  ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Prediction History</span>
            </Link>
          </nav>

          {/* Right Utilities (Theme & User Auth) */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </button>

            {/* Auth Buttons / Profile */}
            {user ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <LogIn className="w-4 h-4 text-blue-500" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl shadow-md shadow-blue-500/25 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <HomeIcon className="w-5 h-5 text-blue-500" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/history"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <History className="w-5 h-5 text-blue-500" />
            <span>Prediction History</span>
          </Link>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-semibold">{user.name} ({user.email})</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 py-2.5 text-center font-medium border border-slate-300 dark:border-slate-700 rounded-xl"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 py-2.5 text-center font-medium bg-blue-500 text-white rounded-xl"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
