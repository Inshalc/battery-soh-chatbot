// themes/globalStyles.ts
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    ...theme.shadows.soft,
  },

  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)', // ignored on mobile, but useful on web
  },

  textPrimary: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
  },

  textSecondary: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },

  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
  },

  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },

  buttonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
  },
});