// theme/animations.ts
import { Animated } from 'react-native';
import { theme } from './theme';

export const createScaleAnimation = () => {
  const scale = new Animated.Value(1);

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: theme.animation.scale.tap,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return { scale, onPressIn, onPressOut };
};