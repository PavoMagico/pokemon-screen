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

const { PokemonModule } = NativeModules;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const POKE_IDS: { [key: string]: number } = {
    zubat: 41, golbat: 42, slowpoke: 79, slowbro: 80, onix: 95, chansey: 113, horsea: 116, seadra: 117, scyther: 123, eevee: 133, vaporeon: 134, jolteon: 135, flareon: 136, porygon: 137,
    chikorita: 152, bayleef: 153, meganium: 154, cyndaquil: 155, quilava: 156, typhlosion: 157, totodile: 158, croconaw: 159, feraligatr: 160, sentret: 161, furret: 162, hoothoot: 163, noctowl: 164, ledyba: 165, ledian: 166, spinarak: 167, ariados: 168, crobat: 169, chinchou: 170, lanturn: 171, pichu: 172, cleffa: 173, igglybuff: 174, togepi: 175, togetic: 176, natu: 177, xatu: 178, mareep: 179, flaaffy: 180, ampharos: 181, bellossom: 182, marill: 183, azumarill: 184, sudowoodo: 185, politoed: 186, hoppip: 187, skiploom: 188, jumpluff: 189, aipom: 190, sunkern: 191, sunflora: 192, yanma: 193, wooper: 194, quagsire: 195, espeon: 196, umbreon: 197, murkrow: 198, slowking: 199, misdreavus: 200, unown: 201, wobbuffet: 202, girafarig: 203, pineco: 204, forretress: 205, dunsparce: 206, gligar: 207, steelix: 208, snubbull: 209, granbull: 210, qwilfish: 211, scizor: 212, shuckle: 213, heracross: 214, sneasel: 215, teddiursa: 216, ursaring: 217, slugma: 218, magcargo: 219, swinub: 220, piloswine: 221, corsola: 222, remoraid: 223, octillery: 224, delibird: 225, mantine: 226, skarmory: 227, houndour: 228, houndoom: 229, kingdra: 230, phanpy: 231, donphan: 232, porygon2: 233, stantler: 234, smeargle: 235, tyrogue: 236, hitmontop: 237, smoochum: 238, elekid: 239, magby: 240, miltank: 241, blissey: 242, raikou: 243, entei: 244, suicune: 245, larvitar: 246, pupitar: 247, tyranitar: 248, lugia: 249, ho_oh: 250, celebi: 251, mamoswine: 473, togekiss: 468
};

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

  const getIconUri = (name: string) => {
    const id = POKE_IDS[name.toLowerCase()] || 158;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${id}.png`;
  };

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
