// 共有テーマプロバイダー
import React, { createContext, useContext, ReactNode } from 'react';
import { SharedThemeConfig } from '../types';

interface SharedThemeContextType {
  theme: SharedThemeConfig;
  updateTheme: (newTheme: Partial<SharedThemeConfig>) => void;
}

const SharedThemeContext = createContext<SharedThemeContextType | undefined>(undefined);

export const useSharedTheme = () => {
  const context = useContext(SharedThemeContext);
  if (context === undefined) {
    throw new Error('useSharedTheme must be used within a SharedThemeProvider');
  }
  return context;
};

interface SharedThemeProviderProps {
  children: ReactNode;
  initialTheme?: Partial<SharedThemeConfig>;
}

const defaultTheme: SharedThemeConfig = {
  colors: {
    primary: '#8b5cf6',
    secondary: '#ec4899',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f1f5f9'
  },
  typography: {
    fontFamily: 'Noto Sans JP, sans-serif',
    fontSize: {
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    }
  },
  spacing: {
    section: '3rem',
    container: '1rem'
  },
  animation: {
    duration: 560,
    easing: 'ease-out'
  }
};

export const SharedThemeProvider: React.FC<SharedThemeProviderProps> = ({ 
  children, 
  initialTheme = {} 
}) => {
  const [theme, setTheme] = React.useState<SharedThemeConfig>({
    ...defaultTheme,
    ...initialTheme
  });

  const updateTheme = (newTheme: Partial<SharedThemeConfig>) => {
    setTheme(prev => ({
      ...prev,
      ...newTheme,
      colors: { ...prev.colors, ...newTheme.colors },
      typography: { ...prev.typography, ...newTheme.typography },
      spacing: { ...prev.spacing, ...newTheme.spacing },
      animation: { ...prev.animation, ...newTheme.animation }
    }));
  };

  return (
    <SharedThemeContext.Provider value={{ theme, updateTheme }}>
      <div 
        style={{
          fontFamily: theme.typography.fontFamily,
          '--primary-color': theme.colors.primary,
          '--secondary-color': theme.colors.secondary,
          '--background-color': theme.colors.background,
          '--text-color': theme.colors.text,
          '--accent-color': theme.colors.accent,
          '--animation-duration': `${theme.animation.duration}ms`,
          '--animation-easing': theme.animation.easing
        } as React.CSSProperties}
      >
        {children}
      </div>
    </SharedThemeContext.Provider>
  );
};

export default SharedThemeProvider;