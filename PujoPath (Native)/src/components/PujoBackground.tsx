import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface PujoBackgroundProps {
  isHomepage?: boolean;
}

export const PujoBackground: React.FC<PujoBackgroundProps> = ({ isHomepage = false }) => {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} pointerEvents="none">
      {isHomepage && (
        <>
          {/* Subtle Ghibli-inspired Durga Puja Artwork Layer */}
          <Image
            source={require('../../assets/images/backgrounds/ghibli-durga-idol-flowers-portrait.webp')}
            style={[
              styles.backgroundImage,
              { opacity: isDark ? 0.36 : 0.30 },
            ]}
            resizeMode="cover"
          />

          {/* Soft Radial Vignette Framing Simulation */}
          <View
            style={[
              styles.vignetteOverlay,
              {
                backgroundColor: isDark ? 'rgba(20, 17, 14, 0.55)' : 'rgba(252, 250, 247, 0.65)',
              },
            ]}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: -1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  vignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
