import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface XPBarProps {
  progress: number;
  label?: string;
}

export const XPBar: React.FC<XPBarProps> = ({ progress, label }) => {
  return (
    <View style={styles.xpContainer}>
      <View style={styles.xpBackground}>
        <LinearGradient
          colors={['#6ec7e8', '#a8e4f0']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.xpFill, { width: `${progress * 100}%` }]}
        />
      </View>
      {label && <Text style={styles.xpLabel}>{label}</Text>}
    </View>
  );
};

interface PokemonStatusHUDProps {
  level: number;
  name: string;
  species: string;
  xpProgress: number;
  xpText: string;
}

export const PokemonStatusHUD: React.FC<PokemonStatusHUDProps> = ({
  level,
  name,
  species,
  xpProgress,
  xpText,
}) => {
  return (
    <View style={styles.hudContainer}>
      <LinearGradient
        colors={['#6ec7e8', '#3a8fbf']}
        style={styles.levelBadge}
      >
        <Text style={styles.levelText}>Lv{level}</Text>
      </LinearGradient>
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{name} · {species}</Text>
        <XPBar progress={xpProgress} label={xpText} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  xpContainer: {
    width: '100%',
    marginTop: 4,
  },
  xpBackground: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
  },
  xpLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  hudContainer: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 18,
    padding: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    minWidth: 240,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  nameText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
