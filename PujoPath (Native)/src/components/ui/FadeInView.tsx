import React, { useRef, useEffect } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { motion } from '@/theme/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface FadeInViewProps {
  delay?: number;
  duration?: number;
  slideOffset?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * FadeInView: A lightweight, native-driven entrance wrapper
 * that coordinates an upward slide and fade-in without JS thread overhead.
 */
export const FadeInView: React.FC<FadeInViewProps> = ({
  delay = 0,
  duration = motion.duration.standard,
  slideOffset = 18,
  style,
  children,
}) => {
  const reduceMotion = useReducedMotion();
  const anim = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      anim.setValue(1);
      return;
    }

    const timer = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 1,
        duration,
        easing: motion.easing.decelerate,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [anim, delay, duration, reduceMotion]);

  if (reduceMotion) {
    return <Animated.View style={style}>{children}</Animated.View>;
  }

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [slideOffset, 0],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
