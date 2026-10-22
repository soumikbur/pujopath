import { useWindowDimensions, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';

export type WindowWidthClass = 'compact' | 'medium' | 'expanded';
export type WindowHeightClass = 'compact' | 'medium' | 'expanded';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  widthClass: WindowWidthClass;
  heightClass: WindowHeightClass;
  insets: EdgeInsets;
  safeLeft: number;
  safeRight: number;
  safeTop: number;
  safeBottom: number;
  contentPaddingHorizontal: number;
  screenPaddingLeft: number;
  screenPaddingRight: number;
  tabScrollBottomPadding: number;
  stackScrollBottomPadding: number;
  headerHeight: number;
  bottomNavHeight: number;
  // Dynamic column calculators
  quickAccessColumns: number;
  highlightsColumns: number;
  pillsColumns: number;
  exploreColumns: number;
  developerColumns: number;
  helplineColumns: number;
  savedColumns: number;
  musicColumns: number;
  calendarColumns: number;
  moreDrawerColumns: number;
}

export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isLandscape = width > height;
  const shortestSide = Math.min(width, height);
  const isTablet = shortestSide >= 600;

  // Android Window Size Classes
  const widthClass: WindowWidthClass =
    width < 600 ? 'compact' : width < 840 ? 'medium' : 'expanded';

  const heightClass: WindowHeightClass =
    height < 480 ? 'compact' : height < 900 ? 'medium' : 'expanded';

  // Android Status bar height fallback
  const androidStatusBarHeight =
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;
  const safeTop = Math.max(insets.top, androidStatusBarHeight);
  const safeBottom = Math.max(insets.bottom, 8);
  const safeLeft = Math.max(insets.left, isLandscape ? 16 : 0);
  const safeRight = Math.max(insets.right, isLandscape ? 16 : 0);

  const screenPaddingLeft = 16 + safeLeft;
  const screenPaddingRight = 16 + safeRight;

  const contentPaddingHorizontal = isLandscape
    ? Math.max(insets.left, insets.right, 20)
    : 16;

  // In landscape mode on phones/tablets, use compact bars to maximize vertical content space
  const headerHeight = isLandscape ? 48 : 58;
  const bottomNavHeight = isLandscape ? 48 : 56;

  // Standardized bottom clearance for scroll containers (ensures last items never hidden behind tab bar / system insets)
  const tabScrollBottomPadding = bottomNavHeight + safeBottom + 36;
  const stackScrollBottomPadding = safeBottom + 32;

  // Grid column count calculations
  const quickAccessColumns = isLandscape ? (width >= 960 ? 6 : 3) : 2;
  const highlightsColumns = isLandscape ? (width >= 960 ? 3 : 3) : 1;
  const pillsColumns = isLandscape ? (width >= 960 ? 6 : 3) : 2;
  const exploreColumns = isLandscape ? (width >= 1100 ? 3 : 2) : 1;
  const developerColumns = isLandscape ? 2 : 1;
  const helplineColumns = isLandscape ? 2 : 1;
  const savedColumns = isLandscape ? (width >= 1100 ? 3 : 2) : 1;
  const musicColumns = isLandscape ? (width >= 1000 ? 3 : 2) : 1;
  const calendarColumns = isLandscape ? 2 : 1;
  const moreDrawerColumns = isLandscape ? 4 : 2;

  return {
    width,
    height,
    isLandscape,
    isTablet,
    widthClass,
    heightClass,
    insets,
    safeLeft,
    safeRight,
    safeTop,
    safeBottom,
    contentPaddingHorizontal,
    screenPaddingLeft,
    screenPaddingRight,
    tabScrollBottomPadding,
    stackScrollBottomPadding,
    headerHeight,
    bottomNavHeight,
    quickAccessColumns,
    highlightsColumns,
    pillsColumns,
    exploreColumns,
    developerColumns,
    helplineColumns,
    savedColumns,
    musicColumns,
    calendarColumns,
    moreDrawerColumns,
  };
}
