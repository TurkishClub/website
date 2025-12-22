/**
 * Turkish Club Color Configuration
 * 
 * This file centralizes all color definitions for the Turkish Club website.
 * Use these constants instead of hardcoded color values throughout the application.
 */

// Brand Colors (can be used as className values)
export const BRAND_COLORS = {
  // Primary Turkish Red
  red: {
    DEFAULT: 'turkish-red',
    light: 'turkish-red-light',
    dark: 'turkish-red-dark',
    hex: '#C61E1E',
    // Tailwind scale
    50: 'turkish-red-50',
    100: 'turkish-red-100',
    200: 'turkish-red-200',
    300: 'turkish-red-300',
    400: 'turkish-red-400',
    500: 'turkish-red-500', // Main brand color
    600: 'turkish-red-600',
    700: 'turkish-red-700',
    800: 'turkish-red-800',
    900: 'turkish-red-900',
  },
  // Accent Gold
  gold: {
    DEFAULT: 'turkish-gold',
    hex: '#f59e0b',
  },
  // Neutral Colors
  white: 'turkish-white',
  cream: 'turkish-cream',
  black: 'black',
} as const;

// Semantic Color Classes (Tailwind class strings)
export const SEMANTIC_COLORS = {
  // Backgrounds
  background: {
    primary: 'bg-turkish-red-500',
    secondary: 'bg-turkish-cream',
    white: 'bg-turkish-white',
    card: 'bg-card',
    muted: 'bg-muted',
  },
  // Text colors
  text: {
    primary: 'text-turkish-red-500',
    secondary: 'text-turkish-red-700',
    muted: 'text-muted-foreground',
    white: 'text-turkish-white',
    black: 'text-black',
    foreground: 'text-foreground',
  },
  // Borders
  border: {
    primary: 'border-turkish-red-500',
    secondary: 'border-border',
    muted: 'border-muted',
  },
  // Buttons
  button: {
    primary: 'bg-turkish-red-500 hover:bg-turkish-red-600 text-white',
    secondary: 'bg-turkish-gold hover:bg-turkish-gold/90 text-white',
    outline: 'border-turkish-red-500 text-turkish-red-500 hover:bg-turkish-red-50',
  },
} as const;

// Hex color values for direct use (e.g., in inline styles or chart libraries)
export const HEX_COLORS = {
  turkishRed: '#C61E1E',
  turkishRedLight: '#ef4444',
  turkishRedDark: '#7f1414',
  turkishGold: '#f59e0b',
  turkishWhite: '#FFFFFF',
  turkishCream: '#F5F5F0',
} as const;

// HSL values for programmatic color manipulation
export const HSL_COLORS = {
  turkishRed: 'hsl(0, 77%, 45%)',
  turkishRedLight: 'hsl(0, 77%, 55%)',
  turkishRedDark: 'hsl(0, 77%, 35%)',
  turkishGold: 'hsl(38, 92%, 50%)',
  turkishWhite: 'hsl(0, 0%, 100%)',
  turkishCream: 'hsl(45, 33%, 95%)',
} as const;

// Helper function to get background classes
export const getBgClass = (color: keyof typeof SEMANTIC_COLORS.background) => {
  return SEMANTIC_COLORS.background[color];
};

// Helper function to get text classes
export const getTextClass = (color: keyof typeof SEMANTIC_COLORS.text) => {
  return SEMANTIC_COLORS.text[color];
};

// Helper function to get border classes
export const getBorderClass = (color: keyof typeof SEMANTIC_COLORS.border) => {
  return SEMANTIC_COLORS.border[color];
};

// Helper function to get button classes
export const getButtonClass = (variant: keyof typeof SEMANTIC_COLORS.button) => {
  return SEMANTIC_COLORS.button[variant];
};
