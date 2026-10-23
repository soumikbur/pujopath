import React, { useRef } from 'react';
import {
  Pressable,
  Animated,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  PressableProps,
} from 'react-native';
import { motion } from '@/theme/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  scaleTo?: number;
  activeOpacity?: number;
  preset?: keyof typeof motion.scale;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * AnimatedPressable: A reusable touch component providing immediate, tactile
 * visual feedback with fluid spring returns on the native UI thread.
 * Guarantees zero action delay and fully honors accessibility reduced-motion preferences.
 */
const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  scaleTo,
  activeOpacity = 0.88,
  preset = 'button',
  style,
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}) => {
  const reduceMotion = useReducedMotion();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const targetScale = scaleTo ?? motion.scale[preset];

  const handlePressIn = (event: GestureResponderEvent) => {
    if (disabled) return;

    if (!reduceMotion) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: targetScale,
          duration: motion.duration.instant,
          easing: motion.easing.standard,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: activeOpacity,
          duration: motion.duration.instant,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: activeOpacity,
        duration: motion.duration.instant,
        useNativeDriver: true,
      }).start();
    }

    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    if (disabled) return;

    if (!reduceMotion) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          ...motion.spring.snappy,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: motion.duration.quick,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: motion.duration.instant,
        useNativeDriver: true,
      }).start();
    }

    onPressOut?.(event);
  };

  return (
    <AnimatedPressableBase
      {...props}
      disabled={disabled}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        style,
        disabled && { opacity: 0.45 },
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {children}
    </AnimatedPressableBase>
  );
};
