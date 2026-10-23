import { Easing } from 'react-native';

/**
 * PujoPath Unified Motion Design System
 * Defines standardized timing, easing curves, spring physics, and interaction scales
 * for high-performance 60/90/120 Hz rendering across all screens.
 */

export const motion = {
  // Duration Tokens (in milliseconds)
  duration: {
    instant: 100,     // Instant micro-taps, badge states
    quick: 160,       // Small icons, chips, toggles, filter clicks
    standard: 240,    // Cards, sheets, dialogs, accordion expand
    navigation: 300,  // Screen transitions, tab navigation slides
    emphasized: 360,  // Festival switch, hero cards, prominent reveals
  },

  // Easing Presets
  easing: {
    // Standard cubic curves for natural acceleration and deceleration
    standard: Easing.bezier(0.2, 0.0, 0, 1.0),
    decelerate: Easing.bezier(0.0, 0.0, 0.2, 1.0),
    accelerate: Easing.bezier(0.4, 0.0, 1.0, 1.0),
    emphasized: Easing.bezier(0.05, 0.7, 0.1, 1.0),
  },

  // Spring Physics Presets (Tension & Friction for Animated.spring)
  spring: {
    // Snappy: fast, responsive, ideal for buttons, navigation pills
    snappy: {
      tension: 320,
      friction: 24,
      useNativeDriver: true,
    },
    // Bouncy: joyful subtle overshoot, ideal for favorite heart, badge pop
    bouncy: {
      tension: 240,
      friction: 14,
      useNativeDriver: true,
    },
    // Gentle: silky smooth, ideal for sheet drawers, card expansions
    gentle: {
      tension: 180,
      friction: 22,
      useNativeDriver: true,
    },
    // Firm: controlled movement with zero bounce, ideal for tab bars and sliders
    firm: {
      tension: 260,
      friction: 30,
      useNativeDriver: true,
    },
  },

  // Touch Feedback Scale Multipliers
  scale: {
    card: 0.97,       // Large touch targets (pandal cards, festival options)
    button: 0.95,     // Primary/secondary CTA buttons
    chip: 0.92,       // Filter chips, zone tags, category pills
    icon: 0.88,       // Action buttons, header icons, favorite heart
    iconButton: 0.88, // Action icons, circular buttons, clear buttons
  },
} as const;

export type Motion = typeof motion;
