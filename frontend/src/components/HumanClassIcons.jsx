import React from 'react';

/**
 * Human-like Class Icons depicting emotional states for Mental Health Classes
 */

// 1. Normal (Healthy, Smiling Human)
export const NormalHumanIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Human Head */}
    <circle cx="12" cy="12" r="10" />
    {/* Happy Eyes */}
    <circle cx="9" cy="9" r="1" fill="currentColor" />
    <circle cx="15" cy="9" r="1" fill="currentColor" />
    {/* Warm Smile */}
    <path d="M8 14c1.5 2 6.5 2 8 0" />
  </svg>
);

// 2. Depression (Sad, Downhearted Human with Teardrop)
export const DepressionHumanIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Human Head */}
    <circle cx="12" cy="12" r="10" />
    {/* Downcast Eyes */}
    <path d="M8 9.5L10 9.5" />
    <path d="M14 9.5L16 9.5" />
    {/* Sad Frown */}
    <path d="M16 16c-1.5-2-6.5-2-8 0" />
    {/* Teardrop */}
    <path d="M15.5 11.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5c0-.8 1.5-2.5 1.5-2.5s1.5 1.7 1.5 2.5z" fill="currentColor" opacity="0.8" />
  </svg>
);

// 3. Anxiety (Anxious, Wide-Eyed Human with Sweat Drop & Tense Expression)
export const AnxietyHumanIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Human Head */}
    <circle cx="12" cy="12" r="10" />
    {/* Wide Anxious Eyes */}
    <circle cx="9" cy="9.5" r="1.5" />
    <circle cx="15" cy="9.5" r="1.5" />
    {/* Tense Worried Mouth */}
    <path d="M9 15h6" />
    {/* Anxiety Sweat Drop on forehead */}
    <path d="M17.5 7c0 .6-.4 1-.9 1s-.9-.4-.9-1c0-.6.9-1.8.9-1.8s.9 1.2.9 1.8z" fill="currentColor" />
  </svg>
);

// 4. Bipolar (Dual-Mood Human Face showing Shifting Emotions)
export const BipolarHumanIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Human Head Contour */}
    <circle cx="12" cy="12" r="10" />
    {/* Center Split Line representing Dual Mood Spectrum */}
    <path d="M12 2v20" strokeDasharray="2 2" opacity="0.6" />
    {/* Left Happy Side Eye & Smile */}
    <circle cx="8.5" cy="9.5" r="1" fill="currentColor" />
    <path d="M7 14.5c1 1.2 3.5 1.2 4.5 0" />
    {/* Right Sad Side Eye & Frown */}
    <path d="M14.5 9.5h2" />
    <path d="M17 15.5c-1-1.2-3.5-1.2-4.5 0" />
  </svg>
);

// 5. Suicidal (Distressed Human Seeking Lifeline / Heart Care)
export const SuicidalHumanIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Person Silhouette Head */}
    <circle cx="12" cy="7" r="4" />
    {/* Body / Shoulders leaning with Caring Hands holding Heart */}
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    {/* Heart Symbol at Center representing life support & care */}
    <path d="M12 13.5c-1.2-1.2-3.1-.4-3.1 1.2 0 1.5 3.1 3.3 3.1 3.3s3.1-1.8 3.1-3.3c0-1.6-1.9-2.4-3.1-1.2z" fill="currentColor" />
  </svg>
);

export const HumanClassIconMap = {
  Normal: NormalHumanIcon,
  Depression: DepressionHumanIcon,
  Anxiety: AnxietyHumanIcon,
  Bipolar: BipolarHumanIcon,
  Suicidal: SuicidalHumanIcon,
};
