import React from 'react';

interface CategoryIconProps {
  className?: string;
}

// Sedan - Klasik sedan silueti
export const SedanIcon: React.FC<CategoryIconProps> = ({ className = "w-16 h-10" }) => (
  <svg className={className} viewBox="0 0 80 40" fill="currentColor">
    <path d="M8 28 L8 24 Q8 20 12 20 L18 20 L22 12 Q24 8 28 8 L52 8 Q56 8 58 12 L62 20 L68 20 Q72 20 72 24 L72 28 Q72 30 70 30 L62 30 L62 28 Q62 24 58 24 Q54 24 54 28 L54 30 L26 30 L26 28 Q26 24 22 24 Q18 24 18 28 L18 30 L10 30 Q8 30 8 28 Z M26 14 L26 18 L38 18 L38 12 L30 12 Q28 12 26 14 Z M42 12 L42 18 L54 18 L54 14 Q52 12 50 12 L42 12 Z"/>
    <circle cx="22" cy="28" r="5" fill="currentColor" opacity="0.3"/>
    <circle cx="58" cy="28" r="5" fill="currentColor" opacity="0.3"/>
  </svg>
);

// SUV - Yüksek gövdeli SUV silueti
export const SUVIcon: React.FC<CategoryIconProps> = ({ className = "w-16 h-10" }) => (
  <svg className={className} viewBox="0 0 80 40" fill="currentColor">
    <path d="M6 30 L6 22 Q6 18 10 18 L14 18 L18 8 Q20 4 24 4 L56 4 Q60 4 62 8 L66 18 L70 18 Q74 18 74 22 L74 30 Q74 32 72 32 L64 32 L64 30 Q64 25 59 25 Q54 25 54 30 L54 32 L26 32 L26 30 Q26 25 21 25 Q16 25 16 30 L16 32 L8 32 Q6 32 6 30 Z M22 12 L22 16 L36 16 L36 8 L26 8 Q24 8 22 12 Z M40 8 L40 16 L58 16 L58 12 Q56 8 54 8 L40 8 Z"/>
    <circle cx="21" cy="30" r="6" fill="currentColor" opacity="0.3"/>
    <circle cx="59" cy="30" r="6" fill="currentColor" opacity="0.3"/>
  </svg>
);

// Hatchback - Kompakt hatchback silueti
export const HatchbackIcon: React.FC<CategoryIconProps> = ({ className = "w-16 h-10" }) => (
  <svg className={className} viewBox="0 0 80 40" fill="currentColor">
    <path d="M10 28 L10 24 Q10 20 14 20 L20 20 L24 12 Q26 8 30 8 L48 8 Q52 8 56 12 L64 20 L66 20 Q70 20 70 24 L70 28 Q70 30 68 30 L60 30 L60 28 Q60 24 56 24 Q52 24 52 28 L52 30 L28 30 L28 28 Q28 24 24 24 Q20 24 20 28 L20 30 L12 30 Q10 30 10 28 Z M28 14 L28 18 L40 18 L40 12 L32 12 Q30 12 28 14 Z M44 12 L44 18 L58 18 L52 12 L44 12 Z"/>
    <circle cx="24" cy="28" r="5" fill="currentColor" opacity="0.3"/>
    <circle cx="56" cy="28" r="5" fill="currentColor" opacity="0.3"/>
  </svg>
);

// Coupe - Sportif coupe silueti
export const CoupeIcon: React.FC<CategoryIconProps> = ({ className = "w-16 h-10" }) => (
  <svg className={className} viewBox="0 0 80 40" fill="currentColor">
    <path d="M4 28 L4 24 Q4 21 8 21 L16 21 L22 11 Q24 7 28 7 L50 7 Q56 7 62 13 L68 21 L72 21 Q76 21 76 24 L76 28 Q76 30 74 30 L64 30 L64 28 Q64 24 60 24 Q56 24 56 28 L56 30 L24 30 L24 28 Q24 24 20 24 Q16 24 16 28 L16 30 L6 30 Q4 30 4 28 Z M24 13 L24 18 L40 18 L40 10 L30 10 Q26 10 24 13 Z M44 10 L44 18 L62 18 L56 12 Q54 10 50 10 L44 10 Z"/>
    <circle cx="20" cy="28" r="5" fill="currentColor" opacity="0.3"/>
    <circle cx="60" cy="28" r="5" fill="currentColor" opacity="0.3"/>
  </svg>
);

// Pickup - Pickup kamyonet silueti
export const PickupIcon: React.FC<CategoryIconProps> = ({ className = "w-16 h-10" }) => (
  <svg className={className} viewBox="0 0 80 40" fill="currentColor">
    <path d="M6 28 L6 24 Q6 20 10 20 L14 20 L18 10 Q20 6 24 6 L38 6 Q42 6 42 10 L42 20 L68 20 Q72 20 72 24 L72 28 Q72 30 70 30 L64 30 L64 28 Q64 24 60 24 Q56 24 56 28 L56 30 L24 30 L24 28 Q24 24 20 24 Q16 24 16 28 L16 30 L8 30 Q6 30 6 28 Z M20 12 L20 18 L32 18 L32 10 L26 10 Q22 10 20 12 Z"/>
    <rect x="44" y="16" width="24" height="12" rx="2" fill="currentColor" opacity="0.4"/>
    <circle cx="20" cy="28" r="5" fill="currentColor" opacity="0.3"/>
    <circle cx="60" cy="28" r="5" fill="currentColor" opacity="0.3"/>
  </svg>
);

// MPV - Aile aracı / minivan silueti
export const MPVIcon: React.FC<CategoryIconProps> = ({ className = "w-16 h-10" }) => (
  <svg className={className} viewBox="0 0 80 40" fill="currentColor">
    <path d="M6 30 L6 20 Q6 16 10 16 L14 16 L16 6 Q18 2 22 2 L58 2 Q62 2 64 6 L66 16 L70 16 Q74 16 74 20 L74 30 Q74 32 72 32 L66 32 L66 30 Q66 25 61 25 Q56 25 56 30 L56 32 L24 32 L24 30 Q24 25 19 25 Q14 25 14 30 L14 32 L8 32 Q6 32 6 30 Z M20 10 L20 14 L32 14 L32 6 L24 6 Q22 6 20 10 Z M36 6 L36 14 L48 14 L48 6 L36 6 Z M52 6 L52 14 L62 14 L60 10 Q58 6 56 6 L52 6 Z"/>
    <circle cx="19" cy="30" r="6" fill="currentColor" opacity="0.3"/>
    <circle cx="61" cy="30" r="6" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const categoryIcons: Record<string, React.FC<CategoryIconProps>> = {
  sedan: SedanIcon,
  suv: SUVIcon,
  hatchback: HatchbackIcon,
  coupe: CoupeIcon,
  pickup: PickupIcon,
  mpv: MPVIcon,
};

interface CategoryIconComponentProps {
  categoryId: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconComponentProps> = ({ categoryId, className }) => {
  const IconComponent = categoryIcons[categoryId.toLowerCase()];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};
