import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface WallpaperProps {
  children?: React.ReactNode;
  variant?: 'dusk' | 'night';
}

const Wallpaper: React.FC<WallpaperProps> = ({ children, variant = 'dusk' }) => {
  const isDusk = variant === 'dusk';

  const bgColors = isDusk
    ? (['#2a2745', '#4a3f6b', '#7a5a7e', '#c88a80', '#e8b999'] as const)
    : (['#0e1226', '#1a1e3f', '#2a2a5c', '#3d3560'] as const);

  const hill1Color = isDusk ? '#3a2d52' : '#0a0d20';
  const hill2Color = isDusk ? '#1e1633' : '#05071a';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={bgColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {variant === 'night' && [...Array(28)].map((_, i) => {
        const top = (i * 37) % 55;
        const left = (i * 53) % 100;
        const sz = (i % 3 === 0) ? 2 : 1;
        return (
          <View
            key={i}
            style={[
              styles.star,
              {
                top: `${top}%`,
                left: `${left}%`,
                width: sz,
                height: sz,
                borderRadius: sz,
              },
            ]}
          />
        );
      })}

      {/* Distant hill silhouette 1 */}
      <View style={[styles.hillContainer, { bottom: '22%', height: '28%', opacity: 0.55 }]}>
        <Svg viewBox="0 0 412 200" preserveAspectRatio="none" width="100%" height="100%">
          <Path
            d="M0,140 C60,90 120,110 180,80 C240,50 300,90 360,70 L412,80 L412,200 L0,200 Z"
            fill={hill1Color}
          />
        </Svg>
      </View>

      {/* Near hill silhouette */}
      <View style={[styles.hillContainer, { bottom: 0, height: '26%' }]}>
        <Svg viewBox="0 0 412 200" preserveAspectRatio="none" width="100%" height="100%">
          <Path
            d="M0,110 C80,70 160,100 220,60 C280,20 340,70 412,50 L412,200 L0,200 Z"
            fill={hill2Color}
          />
        </Svg>
      </View>

      {/* Subtle ground plane */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.35)']}
        style={styles.ground}
      />

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  hillContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
});

export default Wallpaper;
