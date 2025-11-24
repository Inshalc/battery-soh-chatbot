// themes/theme.ts
export const theme = {
    colors: {
      background: '#0A0A10',         // deep black background
      surface: '#1A1A1D',            // sleek dark surface tone
      accent: '#7B3EFF',             // glowing purple accent
      accentSecondary: '#9E6BFF',    // lighter purple for gradients
      textPrimary: '#FFFFFF',        // main text
      textSecondary: '#A0A0A0',      // neutral secondary text for better readability
      border: 'rgba(255,255,255,0.05)',  // faint border for dark UI separation
      success: '#4AEF8E',            // for “healthy battery” states
      warning: '#FFC34D',            // for medium battery
      danger: '#FF5C5C',             // for low SOH values
    },
  
    spacing: {
      xs: 6,
      sm: 12,
      md: 18,
      lg: 28,
    },
  
    borderRadius: {
      sm: 8,
      md: 16,
      lg: 24,
      full: 999,
    },
  
    fontSize: {
      sm: 12,
      md: 16,
      lg: 22,
      xl: 28,
    },
  
    shadows: {
      soft: {
        shadowColor: '#7B3EFF',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
      },
    },

    animation: {
        duration: {
          fast: 100,
          medium: 250,
          slow: 500,
        },
        scale: {
          tap: 1.05,      // how much to grow on press
          pulse: 1.1,     // for bounce-type animations
        },
        easing: {
          default: 'ease-out',
        },
      },
  };