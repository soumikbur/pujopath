/**
 * PujoPath Spacing & Layout Design System (8dp Grid System)
 * Strictly adheres to 8dp primary grid with 4dp sub-step refinements.
 */

export const spacing = {
  none: 0,
  xxs: 2,   // Fine micro-adjustments
  xs: 4,    // 4dp - Sub-step: tight text gaps, badge padding, subtle micro-offsets
  sm: 8,    // 8dp - Base unit: icon-to-label, badge gaps, small card item gaps
  md: 12,   // 12dp - Medium gap: section headers to content, compact card padding
  lg: 16,   // 16dp - Standard unit: screen horizontal margins, standard card padding
  xl: 20,   // 20dp - Large gap: prominent card gaps, section separation
  xxl: 24,  // 24dp - Major section spacing, prominent headers
  xxxl: 32, // 32dp - Hero section separation, empty state padding
  huge: 40, // 40dp - Major screen divisions
} as const;

export const layout = {
  // Screen Margins
  screenPaddingHorizontalPortrait: 16,
  screenPaddingHorizontalLandscape: 20,

  // Section Hierarchy
  sectionGap: 24,
  sectionHeadingToContent: 12,
  headingToSubtext: 4,

  // Card System
  cardPadding: 16,
  cardPaddingCompact: 12,
  cardGap: 12,
  cardBorderRadius: 18,
  cardBorderRadiusLarge: 24,

  // Component Elements
  iconToLabel: 8,
  buttonPaddingHorizontal: 16,
  buttonPaddingVertical: 12,
  buttonGap: 8,

  // Navigation & Bars
  headerHeightPortrait: 58,
  headerHeightLandscape: 48,
  bottomNavHeightPortrait: 56,
  bottomNavHeightLandscape: 48,
} as const;

export type Spacing = typeof spacing;
export type Layout = typeof layout;
