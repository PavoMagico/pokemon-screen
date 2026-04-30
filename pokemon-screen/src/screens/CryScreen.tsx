import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, NativeModules } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Wallpaper from '../components/shared/Wallpaper';
import CustomStatusBar from '../components/shared/CustomStatusBar';
import { PokemonStatusHUD } from '../components/shared/HUD';

import { POKE_IDS, getIconUri } from '../constants/pokemon';

const { PokemonModule } = NativeModules;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Ripple = ({ delay = 0 }: { delay?: number }) => {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(withTiming(2.2, { duration: 2100, easing: Easing.out(Easing.ease) }), -1, false)
    );
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0, { duration: 2100, easing: Easing.out(Easing.ease) }), -1, false)
    );
  }, [delay, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.ripple, animatedStyle]} />;
};

const CryScreen = () => {
  const [stats, setStats] = useState({ steps: 0, level: 1, isHatched: false, selectedPokemon: 'totodile' });

  const bubbleScale = useSharedValue(0.6);
  const bubbleOpacity = useSharedValue(0);
  const bubbleTranslateY = useSharedValue(10);
  const xpOpacity = useSharedValue(0);
  const xpTranslateY = useSharedValue(0);

  const fetchStats = async () => {
    try {
      const data = await PokemonModule.getStats();
      if (data.selectedPokemon) setStats(data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 2000);

    // Animations
    bubbleScale.value = withRepeat(withSequence(withTiming(1.1, { duration: 280, easing: Easing.out(Easing.ease) }), withTiming(1, { duration: 1120 })), -1, false);
    bubbleOpacity.value = withRepeat(withSequence(withTiming(1, { duration: 280 }), withTiming(0, { duration: 1120 })), -1, false);
    bubbleTranslateY.value = withRepeat(withSequence(withTiming(-4, { duration: 280 }), withTiming(-20, { duration: 1120 })), -1, false);
    xpOpacity.value = withRepeat(withSequence(withTiming(1, { duration: 320 }), withTiming(0, { duration: 1280 })), -1, false);
    xpTranslateY.value = withRepeat(withSequence(withTiming(-8, { duration: 320 }), withTiming(-48, { duration: 1280 })), -1, false);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stats.isHatched && stats.selectedPokemon) {
      PokemonModule.playCry(stats.selectedPokemon);
    }
  }, [stats.isHatched, stats.selectedPokemon]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }, { translateY: bubbleTranslateY.value }],
    opacity: bubbleOpacity.value,
  }));

  const xpStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: xpTranslateY.value }],
    opacity: xpOpacity.value,
  }));

  if (!stats.selectedPokemon) return null;

  return (
    <Wallpaper variant="night">
      <SafeAreaView style={styles.container}>
        <CustomStatusBar light />

        <View style={styles.clockContainer}>
          <Text style={styles.dateText}>Partner Status</Text>
          <Text style={styles.timeText}>{stats.isHatched ? stats.selectedPokemon.toUpperCase() : "EGG"}</Text>
        </View>

        <View style={styles.hudWrapper}>
          <PokemonStatusHUD
            level={stats.level}
            name={stats.isHatched ? stats.selectedPokemon : "Egg"}
            species="Johto"
            xpProgress={(stats.steps % 100) / 100}
            xpText={`${stats.steps % 100} / 100 XP`}
          />
        </View>

        <View style={styles.cryContainer}>
          <Ripple delay={0} />
          <Ripple delay={700} />
          <Ripple delay={1400} />

          <Animated.View style={[styles.bubble, bubbleStyle]}>
            <Text style={styles.bubbleText}>{stats.isHatched ? "¡Poka! ✨" : "Zzz... 🥚"}</Text>
            <View style={styles.bubbleArrow} />
          </Animated.View>

          <Animated.View style={[styles.xpFloat, xpStyle]}>
            <Text style={styles.xpText}>+1 XP</Text>
          </Animated.View>

          <View style={styles.totodileWrapper}>
             <View style={styles.shadow} />
             {stats.isHatched ? (
                 <Image source={{ uri: getIconUri(stats.selectedPokemon) }} style={styles.sprite} />
             ) : (
                 <Text style={{fontSize: 60}}>🥚</Text>
             )}
          </View>
        </View>

        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>JOHTO RPG OVERLAY ACTIVE</Text>
        </View>

        <View style={styles.navPillContainer}>
          <View style={styles.navPill} />
        </View>
      </SafeAreaView>
    </Wallpaper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  clockContainer: { alignItems: 'center', marginTop: 40 },
  dateText: { color: '#fff', fontSize: 13, fontWeight: '500', letterSpacing: 2, opacity: 0.85, textTransform: 'uppercase' },
  timeText: { color: '#fff', fontSize: 48, fontWeight: '900', marginTop: 4 },
  hudWrapper: { alignItems: 'center', marginTop: 20 },
  cryContainer: { position: 'absolute', bottom: 140, left: 0, right: 0, height: 180, alignItems: 'center', justifyContent: 'flex-end' },
  ripple: { position: 'absolute', bottom: 12, width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(110, 199, 232, 0.7)' },
  bubble: { position: 'absolute', top: -10, backgroundColor: 'rgba(255,255,255,0.96)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, zIndex: 10 },
  bubbleText: { color: '#2a5a8f', fontWeight: '700', fontSize: 13 },
  bubbleArrow: { position: 'absolute', bottom: -5, left: '50%', marginLeft: -5, width: 0, height: 0, borderLeftWidth: 5, borderLeftColor: 'transparent', borderRightWidth: 5, borderRightColor: 'transparent', borderTopWidth: 6, borderTopColor: 'rgba(255,255,255,0.96)' },
  xpFloat: { position: 'absolute', top: 30, right: '30%', zIndex: 10 },
  xpText: { color: '#a8e4f0', fontSize: 14, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  totodileWrapper: { alignItems: 'center', zIndex: 2 },
  sprite: { width: 100, height: 100, resizeMode: 'contain' },
  shadow: { position: 'absolute', bottom: 6, width: 50, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.5)' },
  hintContainer: { position: 'absolute', bottom: 96, left: 0, right: 0, alignItems: 'center' },
  hintText: { color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: 1 },
  navPillContainer: { position: 'absolute', bottom: 8, left: 0, right: 0, alignItems: 'center' },
  navPill: { width: 122, height: 4.5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.8)' },
});

export default CryScreen;
