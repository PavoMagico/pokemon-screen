import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

interface CustomStatusBarProps {
  light?: boolean;
}

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({ light = true }) => {
  const color = light ? 'rgba(255,255,255,0.95)' : '#1a1a1a';

  return (
    <View style={styles.container}>
      <Text style={[styles.time, { color }]}>21:04</Text>

      {/* Notch/Camera circle */}
      <View style={styles.notch} />

      <View style={styles.icons}>
        {/* Signal */}
        <Svg width="14" height="10" viewBox="0 0 14 10">
          <Path d="M0 8h2v2H0zm3-2h2v4H3zm3-2h2v6H6zm3-2h2v8H9zm3-2h2v10h-2z" fill={color} />
        </Svg>

        {/* Wifi */}
        <Svg width="14" height="10" viewBox="0 0 14 10" style={styles.iconSpacing}>
          <Path d="M7 10l2-2-1-1a2 2 0 00-2 0l-1 1 2 2zm-4-4l1 1a4 4 0 016 0l1-1a6 6 0 00-8 0zm-2-2l1 1a7 7 0 0110 0l1-1a9 9 0 00-12 0z" fill={color} />
        </Svg>

        {/* Battery */}
        <View style={[styles.batteryOutline, { borderColor: color }]}>
          <View style={[styles.batteryLevel, { backgroundColor: color }]} />
          <View style={[styles.batteryCap, { backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 34,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  time: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  notch: {
    position: 'absolute',
    left: '50%',
    top: 10,
    marginLeft: -9,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0a0a0a',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginHorizontal: 5,
  },
  batteryOutline: {
    width: 22,
    height: 11,
    borderWidth: 1.3,
    borderRadius: 2.5,
    padding: 1.2,
    position: 'relative',
  },
  batteryLevel: {
    width: '78%',
    height: '100%',
    borderRadius: 1,
  },
  batteryCap: {
    position: 'absolute',
    right: -3,
    top: 2.5,
    width: 2,
    height: 4,
    borderRadius: 1,
  },
});

export default CustomStatusBar;
