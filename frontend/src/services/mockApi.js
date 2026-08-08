/**
 * Real API & Database Service for Mental Health Classification System
 * Connected to FastAPI Backend + Neon Serverless PostgreSQL Database
 * 
 * Base URL: http://localhost:8000
 */

// Dynamic API URL selection based on local dev (npm run dev) vs production deployment
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  // Auto-correct old placeholder URL if present in Vercel settings
  if (envUrl && envUrl.includes('mental-health-backend.onrender.com')) {
    return 'https://mental-health-prediction-system-di53.onrender.com';
  }

  // Use custom environment variable if explicitly provided
  if (envUrl) {
    return envUrl;
  }

  // Local development mode (npm run dev) -> http://localhost:8000
  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }

  // Live Production deployment (Vercel / Render) -> Actual Render URL
  return 'https://mental-health-prediction-system-di53.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

const STORAGE_KEYS = {
  CURRENT_USER: 'mh_app_current_user',
};

// -------------------------------------------------------------
// Mental Health Classes Metadata (Used across UI for rich cards)
// -------------------------------------------------------------
export const MENTAL_HEALTH_CLASSES = {
  Normal: {
    key: 'Normal',
    title: 'Normal / Healthy',
    badgeText: 'Stable Mood',
    color: 'emerald',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderColor: 'border-emerald-500/30 dark:border-emerald-500/40',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    iconBg: 'bg-emerald-600',
    shadow: 'shadow-emerald-500/20',
    iconName: 'Smile',
    summary: 'Your emotional state appears balanced and within healthy baseline levels.',
    recommendation: 'Maintain your current healthy routines, stay physically active, and practice regular mindfulness or gratitude journaling.',
    isHighRisk: false
  },
  Depression: {
    key: 'Depression',
    title: 'Depression',
    badgeText: 'Elevated Risk',
    color: 'indigo',
    bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    borderColor: 'border-indigo-500/30 dark:border-indigo-500/40',
    textColor: 'text-indigo-700 dark:text-indigo-400',
    iconBg: 'bg-indigo-600',
    shadow: 'shadow-indigo-500/20',
    iconName: 'CloudRain',
    summary: 'Indicators of low mood, persistent fatigue, or loss of interest were detected in your input.',
    recommendation: 'Consider speaking with a licensed therapist or counsellor. Breaking tasks into small manageable steps can help.',
    isHighRisk: true
  },
  Anxiety: {
    key: 'Anxiety',
    title: 'Anxiety',
    badgeText: 'Moderate Stress',
    color: 'amber',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderColor: 'border-amber-500/30 dark:border-amber-500/40',
    textColor: 'text-amber-700 dark:text-amber-400',
    iconBg: 'bg-amber-600',
    shadow: 'shadow-amber-500/20',
    iconName: 'AlertTriangle',
    summary: 'Text pattern shows signals of heightened tension, worry, or nervousness.',
    recommendation: 'Try box-breathing exercises (4s in, 4s hold, 4s out). Reduce caffeine intake and engage in grounding activities.',
    isHighRisk: false
  },
  Bipolar: {
    key: 'Bipolar',
    title: 'Bipolar Spectrum',
    badgeText: 'Fluctuating State',
    color: 'purple',
    bgColor: 'bg-purple-500/10 dark:bg-purple-500/20',
    borderColor: 'border-purple-500/30 dark:border-purple-500/40',
    textColor: 'text-purple-700 dark:text-purple-400',
    iconBg: 'bg-purple-600',
    shadow: 'shadow-purple-500/20',
    iconName: 'Zap',
    summary: 'Indicators of significant mood shifts or high-energy fluctuation were observed.',
    recommendation: 'Keep a daily mood tracking log. Consistent sleep schedules and professional evaluation are strongly advised.',
    isHighRisk: true
  },
  Suicidal: {
    key: 'Suicidal',
    title: 'Suicidal Ideation / High Distress',
    badgeText: 'URGENT CARE NEEDED',
    color: 'rose',
    bgColor: 'bg-rose-500/15 dark:bg-rose-500/25',
    borderColor: 'border-rose-500/50 dark:border-rose-500/60',
    textColor: 'text-rose-700 dark:text-rose-400',
    iconBg: 'bg-rose-600',
    shadow: 'shadow-rose-500/30',
    iconName: 'ShieldAlert',
    summary: 'Severe distress and thoughts of self-harm or hopelessness were detected.',
    recommendation: 'You do not have to carry this alone. Please reach out to someone who can help immediately.',
    helpline: 'Emergency Hotline: Call or Text 988 (US/Canada) or 111 / Local Emergency Services.',
    isHighRisk: true
  }
};

// -------------------------------------------------------------
// Authentication Service (Connected to FastAPI + Neon DB)
// -------------------------------------------------------------
export const mockAuthService = {
  // Get currently logged in user from local session storage
  getCurrentUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  // Login via FastAPI Backend
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Invalid email or password. Please try again.');
      }

      const user = await response.json();
      const sessionUser = { id: user.id, name: user.name, email: user.email };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
      return sessionUser;
    } catch (err) {
      if (err.name === 'TypeError' || err.message.toLowerCase().includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend server is running (or wait ~30s if waking up from Render sleep).`);
      }
      throw err;
    }
  },

  // Signup via FastAPI Backend
  signup: async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create an account. Please try again.');
      }

      const user = await response.json();
      const sessionUser = { id: user.id, name: user.name, email: user.email };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
      return sessionUser;
    } catch (err) {
      if (err.name === 'TypeError' || err.message.toLowerCase().includes('fetch')) {
        throw new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please make sure the backend server is running (or wait ~30s if waking up from Render sleep).`);
      }
      throw err;
    }
  },

  // Logout session
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// -------------------------------------------------------------
// SVM Classifier & History Service (Connected to FastAPI + Neon DB)
// -------------------------------------------------------------
export const mockPredictionService = {
  /**
   * Real SVM Prediction API Call.
   * Sends user input text to backend API endpoint (http://localhost:8000/api/predict).
   * Automatically persists record into Neon PostgreSQL Database.
   */
  predict: async (inputText) => {
    const currentUser = mockAuthService.getCurrentUser();
    const userId = currentUser ? currentUser.id : 'guest';

    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: inputText,
        userId: userId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error (${response.status}): Failed to analyze text.`);
    }

    const data = await response.json();
    const predictedLabel = data.label || 'Normal';

    return {
      id: data.id || `pred_${Date.now()}`,
      userId: data.userId || userId,
      inputText: data.inputText || inputText,
      label: predictedLabel,
      confidence: data.confidence ?? 88.0,
      polarity: data.polarity,
      subjectivity: data.subjectivity,
      timestamp: data.timestamp || new Date().toISOString(),
      classInfo: MENTAL_HEALTH_CLASSES[predictedLabel] || MENTAL_HEALTH_CLASSES.Normal
    };
  },

  // Get prediction history records directly from Neon DB via FastAPI
  getHistory: async (userId = null) => {
    const currentUser = mockAuthService.getCurrentUser();
    const targetUserId = userId || (currentUser ? currentUser.id : 'guest');

    const response = await fetch(`${API_BASE_URL}/api/history?userId=${targetUserId}`);
    if (!response.ok) {
      throw new Error(`Failed to load history from backend server (${response.status}).`);
    }

    const records = await response.json();
    return records.map((r) => ({
      ...r,
      classInfo: MENTAL_HEALTH_CLASSES[r.label] || MENTAL_HEALTH_CLASSES.Normal
    }));
  },

  // Clear prediction history from Neon DB via FastAPI
  clearHistory: async () => {
    const currentUser = mockAuthService.getCurrentUser();
    const targetUserId = currentUser ? currentUser.id : 'guest';

    const response = await fetch(`${API_BASE_URL}/api/history?userId=${targetUserId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Failed to clear history on backend server (${response.status}).`);
    }
  }
};
