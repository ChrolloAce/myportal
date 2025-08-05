/**
 * Professional Theme - Inspired by modern SaaS dashboards
 * Clean, minimal, and sophisticated design system
 */

export const professionalTheme = {
  colors: {
    // Professional neutral palette
    white: '#ffffff',
    
    gray: {
      25: '#fcfcfd',
      50: '#f9fafb', 
      100: '#f2f4f7',
      150: '#e4e7ec',
      200: '#eaecf0',
      300: '#d0d5dd',
      400: '#98a2b3',
      500: '#667085',
      600: '#475467',
      700: '#344054',
      800: '#1d2939',
      900: '#101828',
    },
    
    // Professional primary - sophisticated blue
    primary: {
      25: '#f8fafc',
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    
    // Success - professional green
    success: {
      25: '#f6fdf9',
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    
    // Warning - professional amber
    warning: {
      25: '#fffcf5',
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fed7aa',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    
    // Error - professional red
    error: {
      25: '#fffbfa',
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    
    // Brand colors for status
    brand: {
      purple: '#7c3aed',
      indigo: '#4f46e5',
      teal: '#14b8a6',
      cyan: '#06b6d4',
    }
  },
  
  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "SF Mono", "Consolas", monospace',
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    }
  },
  
  spacing: {
    px: '1px',
    0: '0rem',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
    40: '10rem',      // 160px
    48: '12rem',      // 192px
    56: '14rem',      // 224px
    64: '16rem',      // 256px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px  
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
    
    // Professional card shadows
    card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    cardHover: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    dropdown: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    modal: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  
  borders: {
    width: {
      0: '0px',
      DEFAULT: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    
    style: {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      none: 'none',
    },
    
    color: {
      light: '#f2f4f7',
      default: '#eaecf0',
      medium: '#d0d5dd',
      dark: '#98a2b3',
    }
  },
  
  transitions: {
    all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Professional component styles
  components: {
    // Card styles
    card: {
      background: '#ffffff',
      border: '1px solid #f2f4f7',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      padding: '1.5rem',
    },
    
    // Button styles
    button: {
      primary: {
        background: '#0ea5e9',
        color: '#ffffff',
        border: '1px solid #0ea5e9',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontWeight: 500,
        fontSize: '0.875rem',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      
      secondary: {
        background: '#ffffff',
        color: '#374151',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontWeight: 500,
        fontSize: '0.875rem',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
    },
    
    // Input styles
    input: {
      background: '#ffffff',
      border: '1px solid #d0d5dd',
      borderRadius: '0.375rem',
      padding: '0.625rem 0.875rem',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      color: '#101828',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    },
    
    // Table styles
    table: {
      background: '#ffffff',
      border: '1px solid #f2f4f7',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
  }
} as const;

export type ProfessionalTheme = typeof professionalTheme;