import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TotodileProps {
  bottom?: number;
  duration?: number;
  direction?: 'rtl' | 'ltr';
  size?: number;
  paused?: boolean;
  onPress?: () => void;
}

const Totodile: React.FC<TotodileProps> = ({
  bottom = 64,
  duration = 18000, // ms
  size = 64,
  paused = false,
  onPress,
}) => {
  const translateX = useSharedValue(SCREEN_WIDTH);
  const scaleX = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (paused) return;

    // Horizontal movement: Walk from right to left, flip, and walk back.
    translateX.value = withRepeat(
      withSequence(
        // Move to left
        withTiming(-size, { duration: duration / 2, easing: Easing.linear }),
        // Move back to right (after scale flip)
        withTiming(SCREEN_WIDTH, { duration: duration / 2, easing: Easing.linear })
      ),
      -1,
      false
    );

    // Flip scaleX when at the edges
    scaleX.value = withRepeat(
      withSequence(
        withTiming(1, { duration: duration / 2 }), // Going left
        withTiming(-1, { duration: 0 }),           // Instant flip
        withTiming(-1, { duration: duration / 2 }), // Going right
        withTiming(1, { duration: 0 })             // Instant flip
      ),
      -1,
      false
    );

    // Bobbing animation
    translateY.value = withRepeat(
      withTiming(-2, { duration: 300, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [duration, paused, size, translateX, scaleX, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scaleX: scaleX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const content = (
    <Animated.View style={[styles.container, { bottom }, animatedStyle]}>
      <View style={styles.shadowContainer}>
        {/* Shadow */}
        <View
          style={[
            styles.shadow,
            {
              width: size * 0.7,
              bottom: -4,
            },
          ]}
        />
        <Image
          source={require('../../../assets/images/totodile.gif')}
          style={{
            width: size,
            height: size,
            resizeMode: 'contain',
          }}
        />
      </View>
    </Animated.View>
  );

  if (onPress) {
    return <TouchableWithoutFeedback onPress={onPress}>{content}</TouchableWithoutFeedback>;
  }
  return content;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
  },
  shadowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default Totodile;
