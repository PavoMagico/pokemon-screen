import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, NativeModules, ScrollView, SafeAreaView, Image, FlatList, Platform, PermissionsAndroid } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { PokemonModule } = NativeModules;

const POKE_IDS: { [key: string]: number } = {
  // Gen 1
  bulbasaur: 1, ivysaur: 2, venusaur: 3, charmander: 4, charmeleon: 5, charizard: 6, squirtle: 7, wartortle: 8, blastoise: 9, caterpie: 10, metapod: 11, butterfree: 12, weedle: 13, kakuna: 14, beedrill: 15, pidgey: 16, pidgeotto: 17, pidgeot: 18, rattata: 19, raticate: 20, spearow: 21, fearow: 22, ekans: 23, arbok: 24, pikachu: 25, raichu: 26, sandshrew: 27, sandslash: 28, nidoran_f: 29, nidorina: 30, nidoqueen: 31, nidoran_m: 32, nidorino: 33, nidoking: 34, clefairy: 35, clefable: 36, vulpix: 37, ninetales: 38, jigglypuff: 39, wigglytuff: 40, zubat: 41, golbat: 42, oddish: 43, gloom: 44, vileplume: 45, paras: 46, parasect: 47, venonat: 48, venomoth: 49, diglett: 50, dugtrio: 51, meowth: 52, persian: 53, psyduck: 54, golduck: 55, mankey: 56, primeape: 57, growlithe: 58, arcanine: 59, poliwag: 60, poliwhirl: 61, poliwrath: 62, abra: 63, kadabra: 64, alakazam: 65, machop: 66, machoke: 67, machamp: 68, bellsprout: 69, weepinbell: 70, victreebel: 71, tentacool: 72, tentacruel: 73, geodude: 74, graveler: 75, golem: 76, ponyta: 77, rapidash: 78, slowpoke: 79, slowbro: 80, magnemite: 81, magneton: 82, farfetchd: 83, doduo: 84, dodrio: 85, seel: 86, dewgong: 87, grimer: 88, muk: 89, shellder: 90, cloyster: 91, gastly: 92, haunter: 93, gengar: 94, onix: 95, drowzee: 96, hypno: 97, krabby: 98, kingler: 99, voltorb: 100, electrode: 101, exeggcute: 102, exeggutor: 103, cubone: 104, marowak: 105, hitmonlee: 106, hitmonchan: 107, lickitung: 108, koffing: 109, weezing: 110, rhyhorn: 111, rhydon: 112, chansey: 113, tangela: 114, kangaskhan: 115, horsea: 116, seadra: 117, goldeen: 118, seaking: 119, staryu: 120, starmie: 121, mr_mime: 122, scyther: 123, jynx: 124, electabuzz: 125, magmar: 126, pinsir: 127, tauros: 128, magikarp: 129, gyarados: 130, lapras: 131, ditto: 132, eevee: 133, vaporeon: 134, jolteon: 135, flareon: 136, porygon: 137, omanyte: 138, omastar: 139, kabuto: 140, kabutops: 141, aerodactyl: 142, snorlax: 143, articuno: 144, zapdos: 145, moltres: 146, dratini: 147, dragonair: 148, dragonite: 149, mewtwo: 150, mew: 151,
  // Gen 2
  chikorita: 152, bayleef: 153, meganium: 154, cyndaquil: 155, quilava: 156, typhlosion: 157, totodile: 158, croconaw: 159, feraligatr: 160, sentret: 161, furret: 162, hoothoot: 163, noctowl: 164, ledyba: 165, ledian: 166, spinarak: 167, ariados: 168, crobat: 169, chinchou: 170, lanturn: 171, pichu: 172, cleffa: 173, igglybuff: 174, togepi: 175, togetic: 176, natu: 177, xatu: 178, mareep: 179, flaaffy: 180, ampharos: 181, bellossom: 182, marill: 183, azumarill: 184, sudowoodo: 185, politoed: 186, hoppip: 187, skiploom: 188, jumpluff: 189, aipom: 190, sunkern: 191, sunflora: 192, yanma: 193, wooper: 194, quagsire: 195, espeon: 196, umbreon: 197, murkrow: 198, slowking: 199, misdreavus: 200, unown: 201, wobbuffet: 202, girafarig: 203, pineco: 204, forretress: 205, dunsparce: 206, gligar: 207, steelix: 208, snubbull: 209, granbull: 210, qwilfish: 211, scizor: 212, shuckle: 213, heracross: 214, sneasel: 215, teddiursa: 216, ursaring: 217, slugma: 218, magcargo: 219, swinub: 220, piloswine: 221, corsola: 222, remoraid: 223, octillery: 224, delibird: 225, mantine: 226, skarmory: 227, houndour: 228, houndoom: 229, kingdra: 230, phanpy: 231, donphan: 232, porygon2: 233, stantler: 234, smeargle: 235, tyrogue: 236, hitmontop: 237, smoochum: 238, elekid: 239, magby: 240, miltank: 241, blissey: 242, raikou: 243, entei: 244, suicune: 245, larvitar: 246, pupitar: 247, tyranitar: 248, lugia: 249, ho_oh: 250, celebi: 251, mamoswine: 473, togekiss: 468
};

const EVO_MAP: { [key: string]: { next: string, level?: number, item?: string } } = {
  bulbasaur: { next: 'ivysaur', level: 16 }, ivysaur: { next: 'venusaur', level: 32 },
  charmander: { next: 'charmeleon', level: 16 }, charmeleon: { next: 'charizard', level: 36 },
  squirtle: { next: 'wartortle', level: 16 }, wartortle: { next: 'blastoise', level: 36 },
  caterpie: { next: 'metapod', level: 7 }, metapod: { next: 'butterfree', level: 10 },
  weedle: { next: 'kakuna', level: 7 }, kakuna: { next: 'beedrill', level: 10 },
  pidgey: { next: 'pidgeotto', level: 18 }, pidgeotto: { next: 'pidgeot', level: 36 },
  rattata: { next: 'raticate', level: 20 }, spearow: { next: 'fearow', level: 20 },
  ekans: { next: 'arbok', level: 22 }, pikachu: { next: 'raichu', item: 'Thunder Stone' },
  sandshrew: { next: 'sandslash', level: 22 }, nidoran_f: { next: 'nidorina', level: 16 },
  nidorina: { next: 'nidoqueen', item: 'Moon Stone' }, nidoran_m: { next: 'nidorino', level: 16 },
  nidorino: { next: 'nidoking', item: 'Moon Stone' }, clefairy: { next: 'clefable', item: 'Moon Stone' },
  vulpix: { next: 'ninetales', item: 'Fire Stone' }, jigglypuff: { next: 'wigglytuff', item: 'Moon Stone' },
  zubat: { next: 'golbat', level: 22 }, golbat: { next: 'crobat', level: 40 },
  oddish: { next: 'gloom', level: 21 }, gloom: { next: 'vileplume', item: 'Leaf Stone' },
  paras: { next: 'parasect', level: 24 }, venonat: { next: 'venomoth', level: 31 },
  diglett: { next: 'dugtrio', level: 26 }, meowth: { next: 'persian', level: 28 },
  psyduck: { next: 'golduck', level: 33 }, mankey: { next: 'primeape', level: 28 },
  growlithe: { next: 'arcanine', item: 'Fire Stone' }, poliwag: { next: 'poliwhirl', level: 25 },
  poliwhirl: { next: 'poliwrath', item: 'Water Stone' }, abra: { next: 'kadabra', level: 16 },
  kadabra: { next: 'alakazam', level: 36 }, machop: { next: 'machoke', level: 28 },
  machoke: { next: 'machamp', level: 40 }, bellsprout: { next: 'weepinbell', level: 21 },
  weepinbell: { next: 'victreebel', item: 'Leaf Stone' }, tentacool: { next: 'tentacruel', level: 30 },
  geodude: { next: 'graveler', level: 25 }, graveler: { next: 'golem', level: 40 },
  ponyta: { next: 'rapidash', level: 40 }, slowpoke: { next: 'slowbro', level: 37 },
  magnemite: { next: 'magneton', level: 30 }, doduo: { next: 'dodrio', level: 31 },
  seel: { next: 'dewgong', level: 34 }, grimer: { next: 'muk', level: 38 },
  shellder: { next: 'cloyster', item: 'Water Stone' }, gastly: { next: 'haunter', level: 25 },
  haunter: { next: 'gengar', level: 40 }, drowzee: { next: 'hypno', level: 26 },
  krabby: { next: 'kingler', level: 28 }, voltorb: { next: 'electrode', level: 30 },
  exeggcute: { next: 'exeggutor', item: 'Leaf Stone' }, cubone: { next: 'marowak', level: 28 },
  koffing: { next: 'weezing', level: 35 }, rhyhorn: { next: 'rhydon', level: 42 },
  horsea: { next: 'seadra', level: 32 }, seaking: { next: 'goldeen', level: 33 },
  staryu: { next: 'starmie', item: 'Water Stone' }, magikarp: { next: 'gyarados', level: 20 },
  eevee: { next: 'vaporeon', item: 'Water Stone' }, omanyte: { next: 'omastar', level: 40 },
  kabuto: { next: 'kabutops', level: 40 }, dratini: { next: 'dragonair', level: 30 },
  dragonair: { next: 'dragonite', level: 55 },
  chikorita: { next: 'bayleef', level: 16 }, bayleef: { next: 'meganium', level: 32 },
  cyndaquil: { next: 'quilava', level: 14 }, quilava: { next: 'typhlosion', level: 36 },
  totodile: { next: 'croconaw', level: 18 }, croconaw: { next: 'feraligatr', level: 30 },
  sentret: { next: 'furret', level: 15 }, hoothoot: { next: 'noctowl', level: 20 },
  ledyba: { next: 'ledian', level: 18 }, spinarak: { next: 'ariados', level: 20 },
  mareep: { next: 'flaaffy', level: 15 }, flaaffy: { next: 'ampharos', level: 30 },
  marill: { next: 'azumarill', level: 18 }, hoppip: { next: 'skiploom', level: 18 },
  skiploom: { next: 'jumpluff', level: 27 }, sunkern: { next: 'sunflora', item: 'Sun Stone' },
  wooper: { next: 'quagsire', level: 20 }, pineco: { next: 'forretress', level: 31 },
  snubbull: { next: 'granbull', level: 23 }, slugma: { next: 'magcargo', level: 38 },
  swinub: { next: 'piloswine', level: 33 }, remoraid: { next: 'octillery', level: 25 },
  houndour: { next: 'houndoom', level: 24 }, phanpy: { next: 'donphan', level: 25 },
  larvitar: { next: 'pupitar', level: 30 }, pupitar: { next: 'tyranitar', level: 55 },
  // Item-specific evolutions
  onix: { next: 'steelix', item: 'Metal Coat' },
  scyther: { next: 'scizor', item: 'Metal Coat' },
  slowbro: { next: 'slowking', item: "King's Rock" },
  seadra: { next: 'kingdra', item: 'Dragon Scale' },
  poliwhirl_2: { next: 'politoed', item: "King's Rock" }, // Special handling if needed
};

const ITEMS = [
  { name: 'Fire Stone', cost: 15 },
  { name: 'Water Stone', cost: 15 },
  { name: 'Thunder Stone', cost: 15 },
  { name: 'Leaf Stone', cost: 15 },
  { name: 'Moon Stone', cost: 20 },
  { name: 'Sun Stone', cost: 20 },
  { name: 'Metal Coat', cost: 30 },
  { name: "King's Rock", cost: 30 },
  { name: 'Dragon Scale', cost: 30 },
];

const STARTERS = ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile'];
const COMMON = ['pidgey', 'rattata', 'zubat', 'caterpie', 'weedle', 'pikachu', 'eevee', 'onix', 'scyther', 'magikarp', 'abra', 'machop', 'geodude', 'gastly', 'dratini', 'chansey', 'horsea', 'sentret', 'hoothoot', 'ledyba', 'spinarak', 'mareep', 'marill', 'hoppip', 'aipom', 'sunkern', 'yanma', 'wooper', 'murkrow', 'misdreavus', 'unown', 'girafarig', 'pineco', 'dunsparce', 'gligar', 'snubbull', 'qwilfish', 'shuckle', 'heracross', 'sneasel', 'teddiursa', 'slugma', 'swinub', 'corsola', 'remoraid', 'delibird', 'mantine', 'skarmory', 'houndour', 'phanpy', 'stantler', 'smeargle', 'tyrogue', 'smoochum', 'elekid', 'magby', 'miltank', 'larvitar'];
const LEGENDARY = ['articuno', 'zapdos', 'moltres', 'mewtwo', 'mew', 'raikou', 'entei', 'suicune', 'lugia', 'ho_oh', 'celebi'];

// Ordenar todos los Pokémon por su ID de Pokedex Nacional
const ALL_POKEMON = Object.keys(POKE_IDS)
  .sort((a, b) => POKE_IDS[a] - POKE_IDS[b])
  .filter(name => POKE_IDS[name] <= 251); // Solo Gen 1 y 2 para el grid principal

const normalizeName = (name: string) => name.toLowerCase().replace('-', '_');

const getIconUri = (name: string) => {
  const id = POKE_IDS[name.toLowerCase()] || 158;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${id}.png`;
};

const PokemonGridItem = React.memo(({ item, isOwned, isSelected, onPress }: { item: string; isOwned: boolean; isSelected: boolean; onPress: (name: string) => void }) => (
  <TouchableOpacity onPress={() => onPress(item)} style={[styles.gridItem, isSelected && styles.selectedItem]}>
    <Image source={{ uri: getIconUri(item) }} style={[styles.gridIcon, !isOwned && { opacity: 0.15, tintColor: '#fff' }]} resizeMode="contain" />
  </TouchableOpacity>
));

export default function HomeScreen() {
  const [stats, setStats] = useState({ steps: 0, level: 1, isHatched: false, selectedPokemon: null, candies: 0, eggsBought: 0, ownedPokemon: [], inventory: [] });

  const fetchStats = async () => {
    try {
      const data = await PokemonModule.getStats();
      setStats({ ...data, ownedPokemon: data.ownedPokemon || [], inventory: data.inventory || [] });
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    const init = async () => { await PokemonModule.requestPermissions(); fetchStats(); };
    init();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const ownedSet = useMemo(() => new Set(stats.ownedPokemon), [stats.ownedPokemon]);

  const handleGridPress = useCallback((name: string) => {
    if (ownedSet.has(name)) {
      PokemonModule.playCry(name);
      PokemonModule.switchPokemon(name);
    }
  }, [ownedSet]);

  const buyEgg = async () => {
    // 1. Verificar/Pedir permiso de superposición antes de proceder
    await PokemonModule.requestPermissions();

    const eggCost = stats.eggsBought === 0 ? 0 : Math.min(50, stats.eggsBought * 10);
    if (stats.candies >= eggCost || stats.eggsBought === 0) {
      let pool = [];
      if (stats.eggsBought === 0) {
        pool = STARTERS;
      } else {
        pool = (Math.random() * 100 < 15) ? LEGENDARY : [...COMMON, ...STARTERS];
        pool = pool.filter(p => !ownedSet.has(p));
      }

      if (pool.length > 0) {
        const picked = pool[Math.floor(Math.random() * pool.length)];
        PokemonModule.setPokemon(picked);
        fetchStats();
      }
    }
  };

  const handleEvolve = async () => {
    if (!stats.selectedPokemon) return;
    const evo = EVO_MAP[stats.selectedPokemon];
    if (!evo) return;

    const hasItem = evo.item ? stats.inventory.includes(evo.item) : true;
    const hasLevel = evo.level ? stats.level >= evo.level : true;

    if (hasItem && hasLevel && !ownedSet.has(evo.next)) {
      await PokemonModule.evolve(stats.selectedPokemon, evo.next, evo.item || null);
      fetchStats();
    }
  };

  const buyItem = async (item: { name: string, cost: number }) => {
    if (stats.candies >= item.cost) {
        await PokemonModule.buyItem(item.name, item.cost);
        fetchStats();
    }
  };

  const levelUp = async () => {
    if (stats.candies >= 5 && stats.selectedPokemon) {
      await PokemonModule.addLevel(1);
      fetchStats();
    }
  };

  const evoInfo = stats.selectedPokemon ? EVO_MAP[stats.selectedPokemon] : null;
  const alreadyHasEvo = evoInfo && ownedSet.has(evoInfo.next);
  const hasRequiredItem = evoInfo?.item ? stats.inventory.includes(evoInfo.item) : true;
  const hasRequiredLevel = evoInfo?.level ? stats.level >= evoInfo.level : true;
  const canEvolve = evoInfo && hasRequiredItem && hasRequiredLevel && !alreadyHasEvo;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.bg}>
        <FlatList
          data={ALL_POKEMON}
          keyExtractor={(item) => item}
          numColumns={4}
          ListHeaderComponent={() => (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>POKÉMON SCREEN</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statBox}><Text style={styles.statValue}>{stats.candies}</Text><Text style={styles.statLabel}>CANDIES</Text></View>
                  <View style={styles.statBox}><Text style={styles.statValue}>{stats.steps}</Text><Text style={styles.statLabel}>STEPS</Text></View>
                </View>
              </View>

              {stats.selectedPokemon ? (
                <View style={styles.currentCard}>
                  <Text style={styles.cardTitle}>CURRENT PARTNER</Text>
                  {!stats.isHatched ? (
                     <View style={styles.eggPlaceholder}>
                        <View style={styles.uiEgg}>
                            <View style={[styles.eggDot, {top: 10, left: 10}]} />
                            <View style={[styles.eggDot, {top: 25, left: 25, width: 6, height: 6}]} />
                        </View>
                     </View>
                  ) : (
                    <Image source={{ uri: getIconUri(stats.selectedPokemon) }} style={styles.mainPokemonIcon} />
                  )}
                  <Text style={styles.pokemonName}>{stats.isHatched ? stats.selectedPokemon.toUpperCase() : "EGG"}</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.levelText}>LV. {stats.level}</Text>
                    <TouchableOpacity onPress={() => PokemonModule.summon()} style={styles.summonBtn}><Text style={styles.summonBtnText}>RE-SUMMON</Text></TouchableOpacity>
                  </View>
                  {evoInfo && stats.isHatched && (
                    <Text style={styles.evoRequirement}>
                        {alreadyHasEvo ? "Already own evolution" :
                         `${evoInfo.level ? `LV. ${evoInfo.level}` : ''}${evoInfo.level && evoInfo.item ? ' + ' : ''}${evoInfo.item ? evoInfo.item : ''}`}
                    </Text>
                  )}
                  <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: `${Math.min(100, (stats.steps % 100))}%` }]} /></View>
                </View>
              ) : (
                <View style={[styles.currentCard, { paddingVertical: 40 }]}>
                  <Text style={styles.pokemonName}>NO PARTNER</Text>
                  <Text style={styles.evoRequirement}>Get your first egg below!</Text>
                </View>
              )}

              <View style={styles.shopContainer}>
                <TouchableOpacity style={styles.actionBtn} onPress={buyEgg}>
                  <Text style={styles.btnEmoji}>🥚</Text>
                  <View><Text style={styles.btnTitle}>BUY NEW EGG</Text><Text style={styles.btnDesc}>Costs {stats.eggsBought === 0 ? 'FREE' : Math.min(50, stats.eggsBought * 10)} 🍬</Text></View>
                </TouchableOpacity>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemShop}>
                    {ITEMS.map((item) => (
                        <TouchableOpacity key={item.name} style={styles.itemBtn} onPress={() => buyItem(item)}>
                            <Text style={styles.itemEmoji}>{item.name.includes('Stone') ? '💎' : '🛠️'}</Text>
                            <Text style={styles.itemBtnTitle}>{item.name}</Text>
                            <Text style={styles.itemBtnCost}>{item.cost} 🍬</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.dualActionRow}>
                  <TouchableOpacity style={[styles.miniActionBtn, (stats.candies < 5 || !stats.selectedPokemon || !stats.isHatched) && { opacity: 0.5 }]} onPress={levelUp} disabled={!stats.selectedPokemon || !stats.isHatched}>
                    <Text style={styles.btnTitle}>LEVEL UP</Text>
                    <Text style={styles.btnDesc}>5 🍬</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.miniActionBtn, (!canEvolve || !stats.selectedPokemon) && { opacity: 0.5, backgroundColor: '#334155' }]}
                    onPress={handleEvolve}
                    disabled={!canEvolve}
                  >
                    <Text style={styles.btnTitle}>{alreadyHasEvo ? 'OWNED' : (canEvolve ? 'EVOLVE!' : 'LOCKED')}</Text>
                    <Text style={styles.btnDesc}>{evoInfo ? `LV. ${evoInfo.level}` : 'MAX'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[styles.cardTitle, { marginTop: 30, marginBottom: 10 }]}>JOHTO COLLECTION</Text>
            </>
          )}
          renderItem={({ item }) => {
            const isOwned = ownedSet.has(item);
            const isSelected = stats.selectedPokemon === item;
            return (
              <PokemonGridItem item={item} isOwned={isOwned} isSelected={isSelected} onPress={handleGridPress} />
            );
          }}
          contentContainerStyle={{ padding: 25 }}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  bg: { flex: 1 },
  header: { alignItems: 'center', marginBottom: 25 },
  title: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 4 },
  statsRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  statBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 15, alignItems: 'center', flex: 1 },
  statValue: { color: '#fbbf24', fontSize: 20, fontWeight: '900' },
  statLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold' },
  currentCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 25, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  mainPokemonIcon: { width: 64, height: 64 },
  eggPlaceholder: { width: 64, height: 64, justifyContent: 'center', alignItems: 'center' },
  uiEgg: { width: 40, height: 50, backgroundColor: '#fff', borderRadius: 20, borderWidth: 2, borderColor: '#E5E7EB' },
  eggDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  cardTitle: { color: '#64748b', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  pokemonName: { color: '#fff', fontSize: 28, fontWeight: '900' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 5 },
  levelText: { color: '#38bdf8', fontSize: 18, fontWeight: 'bold' },
  summonBtn: { backgroundColor: '#38bdf8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  summonBtnText: { color: '#000', fontSize: 9, fontWeight: '900' },
  evoRequirement: { color: '#64748b', fontSize: 10, marginTop: 5, textAlign: 'center' },
  progressBarBg: { width: '100%', height: 8, backgroundColor: '#1e293b', borderRadius: 4, marginTop: 15, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#38bdf8' },
  shopContainer: { marginTop: 20, gap: 10 },
  itemShop: { flexDirection: 'row', marginVertical: 5 },
  itemBtn: { backgroundColor: '#1e293b', padding: 12, borderRadius: 15, marginRight: 10, alignItems: 'center', minWidth: 80, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  itemEmoji: { fontSize: 18, marginBottom: 4 },
  itemBtnTitle: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  itemBtnCost: { color: '#fbbf24', fontSize: 9, fontWeight: '900' },
  actionBtn: { flexDirection: 'row', backgroundColor: '#1e293b', padding: 15, borderRadius: 18, alignItems: 'center', gap: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  dualActionRow: { flexDirection: 'row', gap: 10 },
  miniActionBtn: { flex: 1, backgroundColor: '#1e293b', padding: 15, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  btnEmoji: { fontSize: 24 },
  btnTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnDesc: { color: '#64748b', fontSize: 11 },
  gridItem: { flex: 1, aspectRatio: 1, margin: 5, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  gridIcon: { width: 50, height: 50 },
  selectedItem: { borderColor: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.1)' }
});
