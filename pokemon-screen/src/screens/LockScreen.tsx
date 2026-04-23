import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, NativeModules } from 'react-native';

const { PokemonModule } = NativeModules;
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Wallpaper from '../components/shared/Wallpaper';
import Totodile from '../components/shared/Totodile';
import CustomStatusBar from '../components/shared/CustomStatusBar';
import { PokemonStatusHUD } from '../components/shared/HUD';

const LockScreen = () => {
  return (
    <Wallpaper variant="dusk">
      <SafeAreaView style={styles.container}>
        <CustomStatusBar light />

        {/* Clock Section */}
        <View style={styles.clockContainer}>
          <Text style={styles.dateText}>Tue · 21 Apr</Text>
          <Text style={styles.timeText}>21:04</Text>
        </View>

        {/* HUD Section */}
        <View style={styles.hudWrapper}>
          <PokemonStatusHUD
            level={8}
            name="Totodile"
            species="Caimán"
            xpProgress={0.62}
            xpText="1 247 / 2 000 XP · evolves at Lv 18"
          />
        </View>

        {/* Notifications */}
        <View style={styles.notificationStack}>
          <View style={styles.notification}>
            <View style={styles.notificationHeader}>
              <View style={[styles.appIcon, { backgroundColor: '#6ec7e8' }]} />
              <Text style={styles.appName}>POKÉMON SCREEN</Text>
              <Text style={styles.timeLabel}>now</Text>
            </View>
            <Text style={styles.notificationTitle}>Totodile walked 2 341 steps with you today</Text>
          </View>

          <View style={styles.notification}>
            <View style={styles.notificationHeader}>
              <View style={[styles.appIcon, { backgroundColor: '#7bd88f' }]} />
              <Text style={styles.appName}>MESSAGES</Text>
              <Text style={styles.timeLabel}>19:42</Text>
            </View>
            <Text style={styles.notificationTitle}>Mom</Text>
            <Text style={styles.notificationBody}>¿Cenas en casa?</Text>
          </View>
        </View>

        <Totodile bottom={120} duration={22000} size={70} onPress={() => PokemonModule.playCry('totodile')} />

        {/* Bottom Shortcuts */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.shortcutCircle}>
             <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <Path d="M12 2a4 4 0 00-4 4v4a4 4 0 008 0V6a4 4 0 00-4-4zM5 10a7 7 0 0014 0M12 17v4"/>
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcutCircle}>
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <Path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={styles.navPillContainer}>
            <View style={styles.navPill} />
        </View>
      </SafeAreaView>
    </Wallpaper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  clockContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  dateText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
    opacity: 0.85,
    textTransform: 'uppercase',
  },
  timeText: {
    color: '#fff',
    fontSize: 96,
    fontWeight: '200',
    letterSpacing: -4,
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 24,
  },
  hudWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  notificationStack: {
    paddingHorizontal: 20,
    marginTop: 40,
    gap: 8,
  },
  notification: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  appIcon: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  appName: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 8,
    opacity: 0.8,
  },
  timeLabel: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.7,
    marginLeft: 'auto',
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  notificationBody: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.85,
    marginTop: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
  },
  shortcutCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navPillContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  navPill: {
    width: 122,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});

export default LockScreen;
