import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, NativeModules, ScrollView, SafeAreaView, Image, FlatList, SectionList, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { PokemonModule } = NativeModules;

const POKE_IDS: { [key: string]: number } = {
  // Gen 1 (Kanto)
  bulbasaur: 1, ivysaur: 2, venusaur: 3, charmander: 4, charmeleon: 5, charizard: 6, squirtle: 7, wartortle: 8, blastoise: 9, caterpie: 10, metapod: 11, butterfree: 12, weedle: 13, kakuna: 14, beedrill: 15, pidgey: 16, pidgeotto: 17, pidgeot: 18, rattata: 19, raticate: 20, spearow: 21, fearow: 22, ekans: 23, arbok: 24, pikachu: 25, raichu: 26, sandshrew: 27, sandslash: 28, nidoran_f: 29, nidorina: 30, nidoqueen: 31, nidoran_m: 32, nidorino: 33, nidoking: 34, clefairy: 35, clefable: 36, vulpix: 37, ninetales: 38, jigglypuff: 39, wigglytuff: 40, zubat: 41, golbat: 42, oddish: 43, gloom: 44, vileplume: 45, paras: 46, parasect: 47, venonat: 48, venomoth: 49, diglett: 50, dugtrio: 51, meowth: 52, persian: 53, psyduck: 54, golduck: 55, mankey: 56, primeape: 57, growlithe: 58, arcanine: 59, poliwag: 60, poliwhirl: 61, poliwrath: 62, abra: 63, kadabra: 64, alakazam: 65, machop: 66, machoke: 67, machamp: 68, bellsprout: 69, weepinbell: 70, victreebel: 71, tentacool: 72, tentacruel: 73, geodude: 74, graveler: 75, golem: 76, ponyta: 77, rapidash: 78, slowpoke: 79, slowbro: 80, magnemite: 81, magneton: 82, farfetchd: 83, doduo: 84, dodrio: 85, seel: 86, dewgong: 87, grimer: 88, muk: 89, shellder: 90, cloyster: 91, gastly: 92, haunter: 93, gengar: 94, onix: 95, drowzee: 96, hypno: 97, krabby: 98, kingler: 99, voltorb: 100, electrode: 101, exeggcute: 102, exeggutor: 103, cubone: 104, marowak: 105, hitmonlee: 106, hitmonchan: 107, lickitung: 108, koffing: 109, weezing: 110, rhyhorn: 111, rhydon: 112, chansey: 113, tangela: 114, kangaskhan: 115, horsea: 116, seadra: 117, goldeen: 118, seaking: 119, staryu: 120, starmie: 121, mr_mime: 122, scyther: 123, jynx: 124, electabuzz: 125, magmar: 126, pinsir: 127, tauros: 128, magikarp: 129, gyarados: 130, lapras: 131, ditto: 132, eevee: 133, vaporeon: 134, jolteon: 135, flareon: 136, porygon: 137, omanyte: 138, omastar: 139, kabuto: 140, kabutops: 141, aerodactyl: 142, snorlax: 143, articuno: 144, zapdos: 145, moltres: 146, dratini: 147, dragonair: 148, dragonite: 149, mewtwo: 150, mew: 151,
  // Gen 2 (Johto)
  chikorita: 152, bayleef: 153, meganium: 154, cyndaquil: 155, quilava: 156, typhlosion: 157, totodile: 158, croconaw: 159, feraligatr: 160, sentret: 161, furret: 162, hoothoot: 163, noctowl: 164, ledyba: 165, ledian: 166, spinarak: 167, ariados: 168, crobat: 169, chinchou: 170, lanturn: 171, pichu: 172, cleffa: 173, igglybuff: 174, togepi: 175, togetic: 176, natu: 177, xatu: 178, mareep: 179, flaaffy: 180, ampharos: 181, bellossom: 182, marill: 183, azumarill: 184, sudowoodo: 185, politoed: 186, hoppip: 187, skiploom: 188, jumpluff: 189, aipom: 190, sunkern: 191, sunflora: 192, yanma: 193, wooper: 194, quagsire: 195, espeon: 196, umbreon: 197, murkrow: 198, slowking: 199, misdreavus: 200, unown: 201, wobbuffet: 202, girafarig: 203, pineco: 204, forretress: 205, dunsparce: 206, gligar: 207, steelix: 208, snubbull: 209, granbull: 210, qwilfish: 211, scizor: 212, shuckle: 213, heracross: 214, sneasel: 215, teddiursa: 216, ursaring: 217, slugma: 218, magcargo: 219, swinub: 220, piloswine: 221, corsola: 222, remoraid: 223, octillery: 224, delibird: 225, mantine: 226, skarmory: 227, houndour: 228, houndoom: 229, kingdra: 230, phanpy: 231, donphan: 232, porygon2: 233, stantler: 234, smeargle: 235, tyrogue: 236, hitmontop: 237, smoochum: 238, elekid: 239, magby: 240, miltank: 241, blissey: 242, raikou: 243, entei: 244, suicune: 245, larvitar: 246, pupitar: 247, tyranitar: 248, lugia: 249, ho_oh: 250, celebi: 251,
  // Gen 3 (Hoenn)
  treecko: 252, grovyle: 253, sceptile: 254, torchic: 255, combusken: 256, blaziken: 257, mudkip: 258, marshtomp: 259, swampert: 260, poochyena: 261, mightyena: 262, zigzagoon: 263, linoone: 264, wurmple: 265, silcoon: 266, beautifly: 267, cascoon: 268, dustox: 269, lotad: 270, lombre: 271, ludicolo: 272, seedot: 273, nuzleaf: 274, shiftry: 275, taillow: 276, swellow: 277, wingull: 278, pelipper: 279, ralts: 280, kirlia: 281, gardevoir: 282, surskit: 283, masquerain: 284, shroomish: 285, breloom: 286, slakoth: 287, vigoroth: 288, slaking: 289, nincada: 290, ninjask: 291, shedinja: 292, whismur: 293, loudred: 294, exploud: 295, makuhita: 296, hariyama: 297, azurill: 298, nosepass: 299, skitty: 300, delcatty: 301, sableye: 302, mawile: 303, aron: 304, lairon: 305, aggron: 306, meditite: 307, medicham: 308, electrike: 309, manectric: 310, plusle: 311, minun: 312, volbeat: 313, illumise: 314, roselia: 315, gulpin: 316, swalot: 317, carvanha: 318, sharpedo: 319, wailmer: 320, wailord: 321, numel: 322, camerupt: 323, torkoal: 324, spoink: 325, grumpig: 326, spinda: 327, trapinch: 328, vibrava: 329, flygon: 330, cacnea: 331, cacturne: 332, swablu: 333, altaria: 334, zangoose: 335, seviper: 336, lunatone: 337, solrock: 338, barboach: 339, whiscash: 340, corphish: 341, crawdaunt: 342, baltoy: 343, claydol: 344, lileep: 345, cradily: 346, anorith: 347, armaldo: 348, feebas: 349, milotic: 350, castform: 351, kecleon: 352, shuppet: 353, banette: 354, duskull: 355, dusclops: 356, tropius: 357, chimecho: 358, absol: 359, wynaut: 360, snorunt: 361, glalie: 362, spheal: 363, sealeo: 364, walrein: 365, clamperl: 366, huntail: 367, gorebyss: 368, relicanth: 369, luvdisc: 370, bagon: 371, shelgon: 372, salamence: 373, beldum: 374, metang: 375, metagross: 376, regirock: 377, regice: 378, registeel: 379, latias: 380, latios: 381, kyogre: 382, groudon: 383, rayquaza: 384, jirachi: 385, deoxys: 386,
};

const ITEM_ICONS: { [key: string]: any } = {
    'Fire Stone': { uri: 'fire_stone' },
    'Water Stone': { uri: 'water_stone' },
    'Thunder Stone': { uri: 'thunder_stone' },
    'Leaf Stone': { uri: 'leaf_stone' },
    'Moon Stone': { uri: 'moon_stone' },
    'Sun Stone': { uri: 'sun_stone' },
    'Metal Coat': { uri: 'metal_coat' },
    "King's Rock": { uri: 'kings_rock' },
    'Dragon Scale': { uri: 'dragon_scale' },
    'Egg': { uri: 'pokemon_egg' }
};

const I18N: any = {
  en: {
    title: "POKÉMON SCREEN",
    candies: "CANDIES",
    steps: "STEPS",
    partner: "CURRENT PARTNER",
    egg: "EGG",
    no_partner: "NO PARTNER",
    get_egg: "Shop below!",
    buy_egg: "RANDOM EGG",
    buy_desc: "30 🍬",
    buy_regional: "%s EGG",
    regional_desc: "60 🍬",
    level_up: "LEVEL UP",
    evolve: "EVOLVE!",
    owned: "OWNED",
    locked: "LOCKED",
    max: "MAX",
    re_summon: "RE-SUMMON",
    tabs: { eggs: "EGGS", pokemon: "MY POKÉMON", pokedex: "POKÉDEX", bag: "BAG" },
    tutorial: {
      title: "HOW TO PLAY",
      steps: "👣 Walk to hatch eggs and earn candies (1🍬 every 50 steps).",
      partner: "✨ Set a partner to see it on your screen!",
      actions: "👆 Tap your Pokémon to hear its cry. Long press or tap 5 times to unsummon.",
      evolve: "🧬 Level up and use items to evolve your team.",
      bag: "🎒 Check your items in the Bag tab.",
      cheat: "Hacer trampas (2 🍬)"
    },
    empty_eggs: "No eggs yet!",
    empty_pokemon: "No Pokémon yet!",
    empty_pool: "You already have all base Pokémon from this region!",
    already_evolved: "You already have %s! Each species must be unique for now.",
    regions: { kanto: "KANTO", johto: "JOHTO", hoenn: "HOENN" },
    buy_candies: "BUY 50 CANDIES",
    ludopata_msg: "Don't be a gambling addict, for God's sake",
    items: {
        'Fire Stone': 'Fire Stone',
        'Water Stone': 'Water Stone',
        'Thunder Stone': 'Thunder Stone',
        'Leaf Stone': 'Leaf Stone',
        'Moon Stone': 'Moon Stone',
        'Sun Stone': 'Sun Stone',
        'Metal Coat': 'Metal Coat',
        "King's Rock": "King's Rock",
        'Dragon Scale': 'Dragon Scale'
    }
  },
  es: {
    title: "POKÉMON SCREEN",
    candies: "CARAMELOS",
    steps: "PASOS",
    partner: "COMPAÑERO ACTUAL",
    egg: "HUEVO",
    no_partner: "SIN COMPAÑERO",
    get_egg: "¡Compra en la tienda!",
    buy_egg: "HUEVO ALEATORIO",
    buy_desc: "30 🍬",
    buy_regional: "HUEVO %s",
    regional_desc: "60 🍬",
    level_up: "SUBIR NIVEL",
    evolve: "¡EVOLUCIONAR!",
    owned: "OBTENIDO",
    locked: "BLOQUEADO",
    max: "NIVEL MÁX",
    re_summon: "RE-INVOCAR",
    tabs: { eggs: "HUEVOS", pokemon: "MIS POKÉMON", pokedex: "POKÉDEX", bag: "BOLSA" },
    tutorial: {
      title: "CÓMO JUGAR",
      steps: "👣 Camina para eclosionar huevos y ganar caramelos (1🍬 cada 50 pasos).",
      partner: "✨ ¡Elige un compañero para que aparezca en tu pantalla!",
      actions: "👆 Toca a tu Pokémon para oír su grito. Mantén pulsado o toca 5 veces para desinvocar.",
      evolve: "🧬 Sube de nivel y usa objetos para evolucionar a tu equipo.",
      bag: "🎒 Revisa tus objetos en la pestaña Bolsa.",
      cheat: "Hacer trampas (2 🍬)"
    },
    empty_eggs: "¡No tienes huevos!",
    empty_pokemon: "¡No tienes Pokémon!",
    empty_pool: "¡Ya tienes todos los Pokémon base de esta región!",
    already_evolved: "¡Ya tienes a %s! Por ahora no se permiten duplicados.",
    regions: { kanto: "KANTO", johto: "JOHTO", hoenn: "HOENN" },
    buy_candies: "COMPRAR 50 CARAMELOS",
    ludopata_msg: "No me seas ludópata por dios",
    items: {
        'Fire Stone': 'Piedra Fuego',
        'Water Stone': 'Piedra Agua',
        'Thunder Stone': 'Piedra Trueno',
        'Leaf Stone': 'Piedra Hoja',
        'Moon Stone': 'Piedra Lunar',
        'Sun Stone': 'Piedra Solar',
        'Metal Coat': 'Revest. Metálico',
        "King's Rock": "Roca del Rey",
        'Dragon Scale': 'Escama Dragón'
    }
  }
};

const EVO_MAP: { [key: string]: any } = {
  bulbasaur: { next: 'ivysaur', level: 16 }, ivysaur: { next: 'venusaur', level: 32 },
  charmander: { next: 'charmeleon', level: 16 }, charmeleon: { next: 'charizard', level: 36 },
  squirtle: { next: 'wartortle', level: 16 }, wartortle: { next: 'blastoise', level: 36 },
  caterpie: { next: 'metapod', level: 7 }, metapod: { next: 'butterfree', level: 10 },
  weedle: { next: 'kakuna', level: 7 }, kakuna: { next: 'beedrill', level: 10 },
  pidgey: { next: 'pidgeotto', level: 18 }, pidgeotto: { next: 'pidgeot', level: 36 },
  rattata: { next: 'raticate', level: 20 }, spearow: { next: 'fearow', level: 20 },
  ekans: { next: 'arbok', level: 22 },
  pikachu: { next: 'raichu', item: 'Thunder Stone' },
  sandshrew: { next: 'sandslash', level: 22 }, nidoran_f: { next: 'nidorina', level: 16 },
  nidorina: { next: 'nidoqueen', item: 'Moon Stone' }, nidoran_m: { next: 'nidorino', level: 16 },
  nidorino: { next: 'nidoking', item: 'Moon Stone' },
  clefairy: { next: 'clefable', item: 'Moon Stone' }, vulpix: { next: 'ninetales', item: 'Fire Stone' },
  jigglypuff: { next: 'wigglytuff', item: 'Moon Stone' },
  zubat: { next: 'golbat', level: 22 }, golbat: { next: 'crobat', level: 40 },
  oddish: { next: 'gloom', level: 21 },
  gloom: [
    { next: 'vileplume', item: 'Leaf Stone' },
    { next: 'bellossom', item: 'Sun Stone' }
  ],
  paras: { next: 'parasect', level: 24 }, venonat: { next: 'venomoth', level: 31 },
  diglett: { next: 'dugtrio', level: 26 }, meowth: { next: 'persian', level: 28 },
  psyduck: { next: 'golduck', level: 33 }, mankey: { next: 'primeape', level: 28 },
  growlithe: { next: 'arcanine', item: 'Fire Stone' }, poliwag: { next: 'poliwhirl', level: 25 },
  poliwhirl: [
    { next: 'poliwrath', item: 'Water Stone' },
    { next: 'politoed', item: "King's Rock" }
  ],
  abra: { next: 'kadabra', level: 16 },
  kadabra: { next: 'alakazam', level: 36 }, machop: { next: 'machoke', level: 28 },
  machoke: { next: 'machamp', level: 40 }, bellsprout: { next: 'weepinbell', level: 21 },
  weepinbell: { next: 'victreebel', item: 'Leaf Stone' }, tentacool: { next: 'tentacruel', level: 30 },
  geodude: { next: 'graveler', level: 25 }, graveler: { next: 'golem', level: 40 },
  ponyta: { next: 'rapidash', level: 40 }, slowpoke: [
    { next: 'slowbro', level: 37 },
    { next: 'slowking', item: "King's Rock" }
  ],
  magnemite: { next: 'magneton', level: 30 }, doduo: { next: 'dodrio', level: 31 },
  seel: { next: 'dewgong', level: 34 }, grimer: { next: 'muk', level: 38 },
  shellder: { next: 'cloyster', item: 'Water Stone' }, gastly: { next: 'haunter', level: 25 },
  haunter: { next: 'gengar', level: 40 }, drowzee: { next: 'hypno', level: 26 },
  krabby: { next: 'kingler', level: 28 }, voltorb: { next: 'electrode', level: 30 },
  exeggcute: { next: 'exeggutor', item: 'Leaf Stone' }, cubone: { next: 'marowak', level: 28 },
  koffing: { next: 'weezing', level: 35 }, rhyhorn: { next: 'rhydon', level: 42 },
  horsea: { next: 'seadra', level: 32 }, seaking: { next: 'goldeen', level: 33 },
  staryu: { next: 'starmie', item: 'Water Stone' }, magikarp: { next: 'gyarados', level: 20 },
  eevee: [
    { next: 'vaporeon', item: 'Water Stone' },
    { next: 'jolteon', item: 'Thunder Stone' },
    { next: 'flareon', item: 'Fire Stone' },
    { next: 'espeon', level: 25 },
    { next: 'umbreon', level: 25 }
  ],
  omanyte: { next: 'omastar', level: 40 },
  kabuto: { next: 'kabutops', level: 40 }, dratini: { next: 'dragonair', level: 30 },
  dragonair: { next: 'dragonite', level: 55 },

  // Baby & Multi-stage Evolutions
  pichu: { next: 'pikachu', level: 10 },
  cleffa: { next: 'clefairy', level: 10 },
  igglybuff: { next: 'jigglypuff', level: 10 },
  smoochum: { next: 'jynx', level: 30 },
  elekid: { next: 'electabuzz', level: 30 },
  magby: { next: 'magmar', level: 30 },
  azurill: { next: 'marill', level: 10 },
  wynaut: { next: 'wobbuffet', level: 15 },
  tyrogue: [
      { next: 'hitmonlee', level: 20 },
      { next: 'hitmonchan', level: 20 },
      { next: 'hitmontop', level: 20 }
  ],

  chikorita: { next: 'bayleef', level: 16 }, bayleef: { next: 'meganium', level: 32 },
  cyndaquil: { next: 'quilava', level: 14 }, quilava: { next: 'typhlosion', level: 36 },
  totodile: { next: 'croconaw', level: 18 }, croconaw: { next: 'feraligatr', level: 30 },
  sentret: { next: 'furret', level: 15 }, hoothoot: { next: 'noctowl', level: 20 },
  ledyba: { next: 'ledian', level: 18 }, spinarak: { next: 'ariados', level: 20 },
  mareep: { next: 'flaaffy', level: 15 }, flaaffy: { next: 'ampharos', level: 30 },
  marill: { next: 'azumarill', level: 18 }, hoppip: { next: 'skiploom', level: 18 },
  skiploom: { next: 'jumpluff', level: 27 }, togepi: { next: 'togetic', level: 10 },
  sunkern: { next: 'sunflora', item: 'Sun Stone' },
  wooper: { next: 'quagsire', level: 20 }, pineco: { next: 'forretress', level: 31 },
  snubbull: { next: 'granbull', level: 23 }, slugma: { next: 'magcargo', level: 38 },
  swinub: { next: 'piloswine', level: 33 }, remoraid: { next: 'octillery', level: 25 },
  houndour: { next: 'houndoom', level: 24 }, phanpy: { next: 'donphan', level: 25 },
  larvitar: { next: 'pupitar', level: 30 }, pupitar: { next: 'tyranitar', level: 55 },
  onix: { next: 'steelix', item: 'Metal Coat' },
  scyther: { next: 'scizor', item: 'Metal Coat' },
  seadra: { next: 'kingdra', item: 'Dragon Scale' },
  treecko: { next: 'grovyle', level: 16 }, grovyle: { next: 'sceptile', level: 36 },
  torchic: { next: 'combusken', level: 16 }, combusken: { next: 'blaziken', level: 36 },
  mudkip: { next: 'marshtomp', level: 16 }, marshtomp: { next: 'swampert', level: 36 },
  poochyena: { next: 'mightyena', level: 18 }, zigzagoon: { next: 'linoone', level: 20 },
  wurmple: [
      { next: 'silcoon', level: 7 },
      { next: 'cascoon', level: 7 }
  ],
  silcoon: { next: 'beautifly', level: 10 },
  cascoon: { next: 'dustox', level: 10 },
  lotad: { next: 'lombre', level: 14 }, lombre: { next: 'ludicolo', item: 'Water Stone' },
  seedot: { next: 'nuzleaf', level: 14 }, nuzleaf: { next: 'shiftry', item: 'Leaf Stone' },
  taillow: { next: 'swellow', level: 22 }, wingull: { next: 'pelipper', level: 25 },
  ralts: { next: 'kirlia', level: 20 }, kirlia: { next: 'gardevoir', level: 30 },
  surskit: { next: 'masquerain', level: 22 }, shroomish: { next: 'breloom', level: 23 },
  slakoth: { next: 'vigoroth', level: 18 }, vigoroth: { next: 'slaking', level: 36 },
  nincada: { next: 'ninjask', level: 20 }, whismur: { next: 'loudred', level: 20 },
  loudred: { next: 'exploud', level: 40 }, makuhita: { next: 'hariyama', level: 24 },
  skitty: { next: 'delcatty', item: 'Moon Stone' }, aron: { next: 'lairon', level: 32 },
  lairon: { next: 'aggron', level: 42 }, meditite: { next: 'medicham', level: 37 },
  electrike: { next: 'manectric', level: 26 }, gulpin: { next: 'swalot', level: 26 },
  carvanha: { next: 'sharpedo', level: 30 }, wailmer: { next: 'wailord', level: 40 },
  numel: { next: 'camerupt', level: 33 }, trapinch: { next: 'vibrava', level: 35 },
  vibrava: { next: 'flygon', level: 45 }, cacnea: { next: 'cacturne', level: 32 },
  swablu: { next: 'altaria', level: 35 }, barboach: { next: 'whiscash', level: 30 },
  corphish: { next: 'crawdaunt', level: 30 }, baltoy: { next: 'claydol', level: 36 },
  lileep: { next: 'cradily', level: 40 }, anorith: { next: 'armaldo', level: 40 },
  shuppet: { next: 'banette', level: 37 }, duskull: { next: 'dusclops', level: 37 },
  spheal: { next: 'sealeo', level: 32 }, sealeo: { next: 'walrein', level: 44 },
  bagon: { next: 'shelgon', level: 30 }, shelgon: { next: 'salamence', level: 50 },
  beldum: { next: 'metang', level: 20 }, metang: { next: 'metagross', level: 45 },
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

const ALL_POKEMON_LIST = Object.keys(POKE_IDS).sort((a, b) => POKE_IDS[a] - POKE_IDS[b]);
const KANTO = ALL_POKEMON_LIST.filter(p => POKE_IDS[p] <= 151);
const JOHTO = ALL_POKEMON_LIST.filter(p => POKE_IDS[p] > 151 && POKE_IDS[p] <= 251);
const HOENN = ALL_POKEMON_LIST.filter(p => POKE_IDS[p] > 251 && POKE_IDS[p] <= 386);

const LEGENDARY = ['articuno', 'zapdos', 'moltres', 'mewtwo', 'mew', 'raikou', 'entei', 'suicune', 'lugia', 'ho_oh', 'celebi', 'regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon', 'rayquaza', 'jirachi', 'deoxys'];

// Helper for evolution family checking
const getFamilyMembers = (base: string): string[] => {
    const members = [base];
    let current = base;
    while (EVO_MAP[current]) {
        current = EVO_MAP[current].next;
        members.push(current);
    }
    return members;
};

// Identify base Pokémon for each region (those that aren't the 'next' stage of something else)
const EVOLVED_NAMES = new Set(
  Object.entries(EVO_MAP).flatMap(([prev, evo]) => {
    const evos = Array.isArray(evo) ? evo : [evo];
    return evos
      .filter(e => POKE_IDS[prev] < POKE_IDS[e.next])
      .map(e => e.next);
  })
);
const KANTO_BASE = KANTO.filter(p => !EVOLVED_NAMES.has(p) && !LEGENDARY.includes(p));
const JOHTO_BASE = JOHTO.filter(p => !EVOLVED_NAMES.has(p) && !LEGENDARY.includes(p));
const HOENN_BASE = HOENN.filter(p => !EVOLVED_NAMES.has(p) && !LEGENDARY.includes(p));
const ALL_BASE = [...KANTO_BASE, ...JOHTO_BASE, ...HOENN_BASE];

const getIconUri = (name: string) => {
  if (!name) return "";
  const id = POKE_IDS[name.toLowerCase()] || 158;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${id}.png`;
};

const getAnimatedIconUri = (name: string) => {
  if (!name) return "";
  const lowerName = name.toLowerCase().replace(" ", "-");
  // Pokémon DB has a very reliable animated sprite set
  return `https://img.pokemondb.net/sprites/black-white/anim/normal/${lowerName}.gif`;
};

const ItemGridItem = React.memo(({ item, t }: { item: any, t: any }) => {
    return (
        <View style={styles.gridItem}>
            <Image source={ITEM_ICONS[item.name]} style={styles.gridIcon} resizeMode="contain" />
            <Text style={styles.gridName}>{t.items[item.name] || item.name}</Text>
            <View style={styles.itemCountBadge}>
                <Text style={styles.itemCountText}>x{item.count}</Text>
            </View>
        </View>
    );
});

const PokemonGridItem = React.memo(({ item, isOwned, isSelected, onPress, isEgg, isCurrentlyOwned }: { item: string | any; isOwned: boolean; isSelected: boolean; onPress: (name: string) => void; isEgg?: boolean, isCurrentlyOwned?: boolean }) => {
  const name = typeof item === 'string' ? item : item?.species;
  if (!name) return null;
  const displayName = isEgg ? "EGG" : (isOwned ? name.toUpperCase() : "???");

  return (
    <TouchableOpacity onPress={() => onPress(name)} style={[styles.gridItem, isSelected && styles.selectedItem]} disabled={!isOwned && !isEgg}>
      {isEgg ? (
        <Image source={ITEM_ICONS['Egg']} style={styles.eggIcon} resizeMode="contain" />
      ) : (
        <View>
            <Image
                source={{ uri: getIconUri(name) }}
                style={[styles.gridIcon, !isOwned && { opacity: 0.1, tintColor: '#000' }]}
                resizeMode="contain"
            />
            {isCurrentlyOwned && isOwned && (
                <View style={styles.ownedBadge}>
                    <Text style={styles.ownedBadgeText}>✔</Text>
                </View>
            )}
        </View>
      )}
      <Text style={styles.gridName} numberOfLines={1}>{displayName}</Text>
    </TouchableOpacity>
  );
});

const ItemShop = React.memo(({ candies, onBuy, t }: { candies: number, onBuy: (item: any) => void, t: any }) => (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.itemShop}
        contentContainerStyle={{ paddingRight: 20 }}
    >
        {ITEMS.map((item) => (
            <TouchableOpacity key={item.name} style={styles.itemBtn} onPress={() => onBuy(item)}>
                <Image source={ITEM_ICONS[item.name]} style={styles.shopItemIcon} resizeMode="contain" />
                <Text style={styles.itemBtnTitle}>{t.items[item.name] || item.name}</Text>
                <Text style={styles.itemBtnCost}>{item.cost} 🍬</Text>
            </TouchableOpacity>
        ))}
    </ScrollView>
));

const HeaderContent = React.memo(({
    stats, buyEgg, buyItem, levelUp, handleEvolve, activeTab, setActiveTab, canEvolve, alreadyHasEvo, evoInfo, lang, setLang, t,
    canShowShinyToggle, showShinies, setShowShinies, pokedexRegion, setPokedexRegion, ownedSet, pokedexSet, showTutorial, setShowTutorial
}: any) => {
    if (!t) return null;
    return (
        <View>
            <View style={styles.header}>
                <View style={styles.topRow}>
                    <Text style={styles.title}>{t.title || 'POKÉMON'}</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={() => setShowTutorial(!showTutorial)} style={styles.langBtn}>
                            <Text style={styles.langText}>?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setLang(lang === 'en' ? 'es' : 'en')} style={styles.langBtn}>
                            <Text style={styles.langText}>{lang?.toUpperCase()}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statBox}><Text style={styles.statValue}>{stats.candies || 0}</Text><Text style={styles.statLabel}>{t.candies}</Text></View>
                    <View style={styles.statBox}><Text style={styles.statValue}>{stats.steps || 0}</Text><Text style={styles.statLabel}>{t.steps}</Text></View>
                </View>
            </View>

            {showTutorial && (
                <View style={styles.tutorialBox}>
                    <Text style={styles.tutorialTitle}>{t.tutorial.title}</Text>
                    <Text style={styles.tutorialText}>{t.tutorial.steps}</Text>
                    <Text style={styles.tutorialText}>{t.tutorial.partner}</Text>
                    <Text style={styles.tutorialText}>{t.tutorial.actions}</Text>
                    <Text style={styles.tutorialText}>{t.tutorial.evolve}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            PokemonModule.addCandies(2);
                        }}
                        style={styles.cheatBtn}
                    >
                        <Text style={styles.cheatBtnText}>{t.tutorial.cheat}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowTutorial(false)} style={styles.closeTutorial}>
                        <Text style={styles.closeTutorialText}>OK</Text>
                    </TouchableOpacity>
                </View>
            )}

            {stats.selectedPokemon ? (
                <View style={styles.currentCard}>
                    <Text style={styles.cardTitle}>{t.partner}</Text>
                    {!stats.isHatched ? (
                        <Image source={ITEM_ICONS['Egg']} style={styles.mainEggIcon} resizeMode="contain" />
                    ) : (
                        <Image source={{ uri: getAnimatedIconUri(stats.selectedPokemon) }} style={styles.mainPokemonIcon} resizeMode="contain" />
                    )}
                    <Text style={styles.pokemonName}>{stats.isHatched ? stats.selectedPokemon.toUpperCase() : t.egg}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.levelText}>LV. {stats.level}</Text>
                        <TouchableOpacity onPress={() => PokemonModule.summon()} style={styles.summonBtn}><Text style={styles.summonBtnText}>{t.re_summon}</Text></TouchableOpacity>
                    </View>
                    {evoInfo && stats.isHatched && (
                        <Text style={styles.evoRequirement}>
                            {alreadyHasEvo ? t.owned :
                            `${evoInfo.level ? `LV. ${evoInfo.level}` : ''}${evoInfo.level && evoInfo.item ? ' + ' : ''}${evoInfo.item ? (t.items[evoInfo.item] || evoInfo.item) : ''}`}
                        </Text>
                    )}
                    <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: `${Math.min(100, (stats.steps % 100))}%` }]} /></View>
                </View>
            ) : (
                <View style={[styles.currentCard, { paddingVertical: 40 }]}>
                    <Text style={styles.pokemonName}>{t.no_partner}</Text>
                    <Text style={styles.evoRequirement}>{t.get_egg}</Text>
                </View>
            )}

            <View style={styles.shopContainer}>
                <View style={styles.shopGrid}>
                    <TouchableOpacity style={[styles.regionBtn, { minWidth: '100%', backgroundColor: '#334155' }]} onPress={() => Alert.alert("EPA!", t.ludopata_msg)}>
                        <Text style={styles.btnTitleSmall}>✨ {t.buy_candies} ✨</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.regionBtn} onPress={() => buyEgg('random')}>
                        <Image source={ITEM_ICONS['Egg']} style={styles.eggBtnIcon} resizeMode="contain" />
                        <Text style={styles.btnTitleSmall}>{t.buy_egg}</Text>
                        <Text style={styles.btnDescSmall}>{t.buy_desc}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.regionBtn} onPress={() => buyEgg('kanto')}>
                        <Image source={ITEM_ICONS['Egg']} style={styles.eggBtnIcon} resizeMode="contain" />
                        <Text style={styles.btnTitleSmall}>{t.buy_regional?.replace('%s', t.regions?.kanto)}</Text>
                        <Text style={styles.btnDescSmall}>{t.regional_desc}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.regionBtn} onPress={() => buyEgg('johto')}>
                        <Image source={ITEM_ICONS['Egg']} style={styles.eggBtnIcon} resizeMode="contain" />
                        <Text style={styles.btnTitleSmall}>{t.buy_regional?.replace('%s', t.regions?.johto)}</Text>
                        <Text style={styles.btnDescSmall}>{t.regional_desc}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.regionBtn} onPress={() => buyEgg('hoenn')}>
                        <Image source={ITEM_ICONS['Egg']} style={styles.eggBtnIcon} resizeMode="contain" />
                        <Text style={styles.btnTitleSmall}>{t.buy_regional?.replace('%s', t.regions?.hoenn)}</Text>
                        <Text style={styles.btnDescSmall}>{t.regional_desc}</Text>
                    </TouchableOpacity>
                </View>

                <ItemShop candies={stats.candies} onBuy={buyItem} t={t} />

                <View style={styles.dualActionRow}>
                    <TouchableOpacity style={[styles.miniActionBtn, (stats.candies < 5 || !stats.selectedPokemon || !stats.isHatched) && { opacity: 0.5 }]} onPress={levelUp} disabled={!stats.selectedPokemon || !stats.isHatched}>
                        <Text style={styles.btnTitle}>{t.level_up}</Text>
                        <Text style={styles.btnDesc}>5 🍬</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.miniActionBtn, (!canEvolve || !stats.selectedPokemon) && { opacity: 0.5, backgroundColor: '#334155' }]}
                        onPress={() => handleEvolve()}
                        disabled={!canEvolve}
                    >
                        <Text style={styles.btnTitle}>{alreadyHasEvo ? t.owned : (canEvolve ? t.evolve : t.locked)}</Text>
                        <Text style={styles.btnDesc}>{evoInfo ? (evoInfo.level ? `LV. ${evoInfo.level}` : (t.items[evoInfo.item] || evoInfo.item)) : t.max}</Text>
                    </TouchableOpacity>
                </View>
            </View>

                <View style={styles.tabBar}>
                    <TouchableOpacity style={[styles.tab, activeTab === 'eggs' && styles.activeTab]} onPress={() => setActiveTab('eggs')}>
                        <Text style={[styles.tabText, activeTab === 'eggs' && styles.activeTabText]}>{t.tabs?.eggs}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, activeTab === 'pokemon' && styles.activeTab]} onPress={() => setActiveTab('pokemon')}>
                        <Text style={[styles.tabText, activeTab === 'pokemon' && styles.activeTabText]}>{t.tabs?.pokemon}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, activeTab === 'bag' && styles.activeTab]} onPress={() => setActiveTab('bag')}>
                        <Text style={[styles.tabText, activeTab === 'bag' && styles.activeTabText]}>{t.tabs?.bag}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tab, activeTab === 'pokedex' && styles.activeTab]} onPress={() => setActiveTab('pokedex')}>
                        <Text style={[styles.tabText, activeTab === 'pokedex' && styles.activeTabText]}>{t.tabs?.pokedex}</Text>
                    </TouchableOpacity>
                </View>

            {activeTab === 'pokedex' && (
                <View style={styles.regionSelectorRow}>
                    <TouchableOpacity
                        style={[styles.regionSelectorBtn, pokedexRegion === 'kanto' && styles.regionSelectorBtnActive]}
                        onPress={() => setPokedexRegion('kanto')}
                    >
                        <Text style={[styles.regionSelectorText, pokedexRegion === 'kanto' && styles.regionSelectorTextActive]}>{t.regions.kanto}</Text>
                        <Text style={styles.regionSelectorCount}>{KANTO.filter(p => pokedexSet.has(p)).length}/{KANTO.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.regionSelectorBtn, pokedexRegion === 'johto' && styles.regionSelectorBtnActive]}
                        onPress={() => setPokedexRegion('johto')}
                    >
                        <Text style={[styles.regionSelectorText, pokedexRegion === 'johto' && styles.regionSelectorTextActive]}>{t.regions.johto}</Text>
                        <Text style={styles.regionSelectorCount}>{JOHTO.filter(p => pokedexSet.has(p)).length}/{JOHTO.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.regionSelectorBtn, pokedexRegion === 'hoenn' && styles.regionSelectorBtnActive]}
                        onPress={() => setPokedexRegion('hoenn')}
                    >
                        <Text style={[styles.regionSelectorText, pokedexRegion === 'hoenn' && styles.regionSelectorTextActive]}>{t.regions.hoenn}</Text>
                        <Text style={styles.regionSelectorCount}>{HOENN.filter(p => pokedexSet.has(p)).length}/{HOENN.length}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {canShowShinyToggle && (activeTab === 'pokedex') && (
                <TouchableOpacity
                    style={[styles.shinyToggle, showShinies && styles.shinyToggleActive]}
                    onPress={() => setShowShinies(!showShinies)}
                >
                    <Text style={[styles.shinyToggleText, showShinies && styles.shinyToggleTextActive]}>
                        ✨ {showShinies ? "SHINY MODE ON" : "SHINY MODE OFF"} ✨
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
});

export default function HomeScreen() {
  const [stats, setStats] = useState({ steps: 0, level: 1, isHatched: false, selectedPokemon: null, candies: 0, eggsBought: 0, ownedPokemon: [], eggs: [], inventory: [], pokedex: [] });
  const [activeTab, setActiveTab] = useState<'eggs' | 'pokemon' | 'pokedex' | 'bag'>('eggs');
  const [lang, setLang] = useState<'en' | 'es'>('es');
  const [showShinies, setShowShinies] = useState(false);
  const [pokedexRegion, setPokedexRegion] = useState<'kanto' | 'johto' | 'hoenn'>('kanto');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showEvoModal, setShowEvoModal] = useState(false);

  const t = I18N[lang];

  const fetchStats = async () => {
    try {
      const data = await PokemonModule.getStats();
      setStats({ ...data, ownedPokemon: data.ownedPokemon || [], eggs: data.eggs || [], inventory: data.inventory || [], pokedex: data.pokedex || [] });
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    const init = async () => { await PokemonModule.requestPermissions(); fetchStats(); };
    init();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Set of all species currently held in any stage
  const heldSpecies = useMemo(() => {
    const held = new Set<string>();
    [...stats.ownedPokemon, ...stats.eggs.map((e: any) => e.species)].forEach(s => held.add(s));
    return held;
  }, [stats.ownedPokemon, stats.eggs]);

  const ownedSet = useMemo(() => new Set(stats.ownedPokemon), [stats.ownedPokemon]);
  const pokedexSet = useMemo(() => new Set(stats.pokedex), [stats.pokedex]);

  const handleGridPress = useCallback((name: string) => {
    const isActuallyOwned = ownedSet.has(name);
    const isEgg = stats.eggs.some((e: any) => e.species === name);

    if (isActuallyOwned) PokemonModule.playCry(name);

    if (activeTab === 'pokedex') {
      if (!pokedexSet.has(name)) return;
      // Only allow switching if we currently possess it (as hatched or egg)
      if (!isActuallyOwned && !isEgg) return;
    }

    PokemonModule.switchPokemon(name);
  }, [stats.eggs, ownedSet, pokedexSet, activeTab]);

  const buyEgg = useCallback(async (type: 'random' | 'kanto' | 'johto' | 'hoenn') => {
    await PokemonModule.requestPermissions();
    const cost = type === 'random' ? 30 : 60;

    if (stats.candies >= cost) {
      let basePool = [];
      let legendaryPool = [];

      if (type === 'kanto') { basePool = KANTO_BASE; legendaryPool = KANTO.filter(p => LEGENDARY.includes(p)); }
      else if (type === 'johto') { basePool = JOHTO_BASE; legendaryPool = JOHTO.filter(p => LEGENDARY.includes(p)); }
      else if (type === 'hoenn') { basePool = HOENN_BASE; legendaryPool = HOENN.filter(p => LEGENDARY.includes(p)); }
      else { basePool = ALL_BASE; legendaryPool = ALL_POKEMON_LIST.filter(p => LEGENDARY.includes(p)); }

      const isLegendary = Math.random() * 100 < 1;
      let pool = isLegendary ? legendaryPool : basePool;

      pool = pool.filter(p => !heldSpecies.has(p));

      if (pool.length > 0) {
        const picked = pool[Math.floor(Math.random() * pool.length)];
        await PokemonModule.buyItem("Egg Charge", cost);
        PokemonModule.setPokemon(picked);
        fetchStats();
      } else {
        Alert.alert(t.title, t.empty_pool);
      }
    }
  }, [stats.candies, heldSpecies, t]);

  const handleEvolve = useCallback(async (forcedEvo?: any) => {
    if (!stats.selectedPokemon) return;

    if (!heldSpecies.has(stats.selectedPokemon)) {
        Alert.alert(t.title, "No tienes este Pokémon actualmente.");
        return;
    }

    const evoList = EVO_MAP[stats.selectedPokemon];
    if (!evoList) return;

    const options = Array.isArray(evoList) ? evoList : [evoList];

    // Check if it was called by the button (which passes an event) or manually
    const isManualSelection = forcedEvo && forcedEvo.next;

    // If we have multiple options and none was chosen yet, show modal
    if (options.length > 1 && !isManualSelection) {
        setShowEvoModal(true);
        return;
    }

    const possible = isManualSelection ? forcedEvo : options.find(evo => {
        const inventoryItem = stats.inventory.find((i: any) => i.name === evo.item);
        const hasItem = evo.item ? (inventoryItem && inventoryItem.count > 0) : true;
        const hasLevel = evo.level ? stats.level >= evo.level : true;
        return hasItem && hasLevel && !heldSpecies.has(evo.next);
    });

    if (possible) {
        // Double check requirements if forced
        const inventoryItem = stats.inventory.find((i: any) => i.name === possible.item);
        const hasItem = possible.item ? (inventoryItem && inventoryItem.count > 0) : true;
        const hasLevel = possible.level ? stats.level >= possible.level : true;

        if (!hasItem || !hasLevel) {
            const req = `${possible.level ? `LV. ${possible.level}` : ''}${possible.level && possible.item ? ' + ' : ''}${possible.item ? (t.items[possible.item] || possible.item) : ''}`;
            Alert.alert(t.title, `Requirements not met: ${req}`);
            return;
        }

        if (heldSpecies.has(possible.next)) {
            Alert.alert(t.title, t.already_evolved.replace('%s', possible.next.toUpperCase()));
            return;
        }

        await PokemonModule.evolve(stats.selectedPokemon, possible.next, possible.item || null);
        setShowEvoModal(false);
        fetchStats();
    } else {
        const alreadyHasAll = options.every(evo => heldSpecies.has(evo.next));
        if (alreadyHasAll) {
            Alert.alert(t.title, t.already_evolved.replace('%s', options[0].next.toUpperCase()));
        } else {
            const first = options[0];
            const req = `${first.level ? `LV. ${first.level}` : ''}${first.level && first.item ? ' + ' : ''}${first.item ? (t.items[first.item] || first.item) : ''}`;
            Alert.alert(t.title, `Requirements not met: ${req}`);
        }
    }
  }, [stats.selectedPokemon, stats.inventory, stats.level, heldSpecies, t]);

  const buyItem = useCallback(async (item: { name: string, cost: number }) => {
    if (stats.candies >= item.cost) {
        await PokemonModule.buyItem(item.name, item.cost);
        fetchStats();
    }
  }, [stats.candies]);

  const levelUp = useCallback(async () => {
    if (stats.candies >= 5 && stats.selectedPokemon) {
      await PokemonModule.addLevel(1);
      fetchStats();
    }
  }, [stats.candies, stats.selectedPokemon]);

  const evoInfo = useMemo(() => {
      if (!stats.selectedPokemon) return null;
      const evoList = EVO_MAP[stats.selectedPokemon];
      if (!evoList) return null;
      const options = Array.isArray(evoList) ? evoList : [evoList];
      // Return the first one that we don't have yet
      return options.find(evo => !heldSpecies.has(evo.next)) || options[0];
  }, [stats.selectedPokemon, heldSpecies]);

  const alreadyHasEvo = useMemo(() => {
      if (!stats.selectedPokemon) return false;
      const evoList = EVO_MAP[stats.selectedPokemon];
      if (!evoList) return false;
      const options = Array.isArray(evoList) ? evoList : [evoList];
      return options.every(evo => heldSpecies.has(evo.next));
  }, [stats.selectedPokemon, heldSpecies]);

  const canEvolve = useMemo(() => {
      if (!stats.selectedPokemon || !evoInfo || alreadyHasEvo) return false;
      // Verification: do we actually OWN the selected pokemon?
      if (!heldSpecies.has(stats.selectedPokemon)) return false;

      const inventoryItem = stats.inventory.find((i: any) => i.name === evoInfo.item);
      const hasItem = evoInfo.item ? (inventoryItem && inventoryItem.count > 0) : true;
      const hasLevel = evoInfo.level ? stats.level >= evoInfo.level : true;
      return hasItem && hasLevel;
  }, [stats.selectedPokemon, evoInfo, alreadyHasEvo, stats.inventory, stats.level, heldSpecies]);

  const isKantoComplete = useMemo(() => KANTO.length > 0 && KANTO.every(p => pokedexSet.has(p)), [pokedexSet]);
  const isJohtoComplete = useMemo(() => JOHTO.length > 0 && JOHTO.every(p => pokedexSet.has(p)), [pokedexSet]);
  const isHoennComplete = useMemo(() => HOENN.length > 0 && HOENN.every(p => pokedexSet.has(p)), [pokedexSet]);

  const canShowShinyToggle = (activeTab === 'pokedex') && (isKantoComplete || isJohtoComplete || isHoennComplete);

  const renderSingleItem = useCallback(({ item }: any) => {
    const isActuallyOwned = ownedSet.has(item);
    const isDiscovered = pokedexSet.has(item);
    const isEggInStats = stats.eggs.some((e: any) => e.species === item);
    const isCurrentlyHeld = isActuallyOwned || isEggInStats;

    const showAsUnlocked = activeTab === 'pokedex' ? isDiscovered : isActuallyOwned;

    let isSelected = stats.selectedPokemon === item;
    if (activeTab === 'pokedex' && !isCurrentlyHeld) {
      isSelected = false;
    }

    return (
      <PokemonGridItem
          item={item}
          isOwned={showAsUnlocked}
          isSelected={isSelected}
          onPress={handleGridPress}
          isEgg={activeTab === 'eggs'}
          isCurrentlyOwned={isCurrentlyHeld}
      />
    );
  }, [ownedSet, pokedexSet, stats.selectedPokemon, activeTab, handleGridPress, stats.eggs]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.bg}>
            <FlatList
                data={activeTab === 'pokedex' ? (pokedexRegion === 'kanto' ? KANTO : pokedexRegion === 'johto' ? JOHTO : HOENN) : (activeTab === 'eggs' ? stats.eggs : activeTab === 'bag' ? stats.inventory : stats.ownedPokemon)}
                keyExtractor={(item, index) => typeof item === 'string' ? item : `${activeTab}-${index}`}
                numColumns={4}
                key="stable-list"
                ListHeaderComponent={
                    <View>
                        <HeaderContent
                            stats={stats} buyEgg={buyEgg} buyItem={buyItem} levelUp={levelUp}
                            handleEvolve={handleEvolve} activeTab={activeTab} setActiveTab={setActiveTab}
                            canEvolve={canEvolve} alreadyHasEvo={alreadyHasEvo} evoInfo={evoInfo}
                            lang={lang} setLang={setLang} t={t} canShowShinyToggle={canShowShinyToggle}
                            showShinies={showShinies} setShowShinies={setShowShinies}
                            pokedexRegion={pokedexRegion} setPokedexRegion={setPokedexRegion}
                            ownedSet={ownedSet} pokedexSet={pokedexSet} showTutorial={showTutorial} setShowTutorial={setShowTutorial}
                        />
                    </View>
                }
                renderItem={({ item }) => {
                    if (activeTab === 'bag') return <ItemGridItem item={item} t={t} />;
                    const species = typeof item === 'string' ? item : item.species;
                    return renderSingleItem({ item: species });
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{activeTab === 'eggs' ? t.empty_eggs : activeTab === 'bag' ? "Your bag is empty!" : t.empty_pokemon}</Text>
                    </View>
                }
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            />

            <Modal visible={showEvoModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.evoModal}>
                        <Text style={styles.modalTitle}>{t.evolve}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15, paddingVertical: 10 }}>
                            {stats.selectedPokemon && Array.isArray(EVO_MAP[stats.selectedPokemon]) && EVO_MAP[stats.selectedPokemon].map((evo: any) => {
                                const hasReq = (evo.item ? stats.inventory.find((i: any) => i.name === evo.item)?.count > 0 : true) && (evo.level ? stats.level >= evo.level : true);
                                const isOwned = heldSpecies.has(evo.next);
                                return (
                                    <TouchableOpacity
                                        key={evo.next}
                                        style={[styles.evoOption, (!hasReq || isOwned) && { opacity: 0.5 }]}
                                        onPress={() => handleEvolve(evo)}
                                    >
                                        <Image source={{ uri: getIconUri(evo.next) }} style={styles.evoOptionIcon} />
                                        <Text style={styles.evoOptionName}>{evo.next.toUpperCase()}</Text>
                                        <Text style={styles.evoOptionReq}>
                                            {isOwned ? t.owned : (evo.item ? (t.items[evo.item] || evo.item) : `LV. ${evo.level}`)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setShowEvoModal(false)} style={styles.closeModal}>
                            <Text style={styles.closeModalText}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  bg: { flex: 1 },
  header: { marginTop: 10, marginBottom: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  langBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  langText: { color: '#38bdf8', fontSize: 12, fontWeight: '900' },
  title: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 4 },
  statsRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  statBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 15, alignItems: 'center', flex: 1 },
  statValue: { color: '#fbbf24', fontSize: 20, fontWeight: '900' },
  statLabel: { color: '#64748b', fontSize: 9, fontWeight: 'bold' },
  currentCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 25, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  mainPokemonIcon: { width: 100, height: 100, marginVertical: 10 },
  mainEggIcon: { width: 100, height: 100, marginBottom: 10 },
  eggIcon: { width: 50, height: 50, marginBottom: 5 },
  eggBtnIcon: { width: 45, height: 45, marginBottom: 2 },
  shopItemIcon: { width: 32, height: 32, marginBottom: 5 },
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
  shopGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  regionBtn: { flex: 1, minWidth: '45%', backgroundColor: '#1e293b', padding: 12, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', gap: 2 },
  itemShop: { flexDirection: 'row', marginVertical: 5 },
  itemBtn: { backgroundColor: '#1e293b', padding: 12, borderRadius: 15, marginRight: 10, alignItems: 'center', minWidth: 90, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  itemEmoji: { fontSize: 18, marginBottom: 4 },
  itemBtnTitle: { color: '#fff', fontSize: 9, fontWeight: 'bold', textAlign: 'center' },
  itemBtnCost: { color: '#fbbf24', fontSize: 9, fontWeight: '900' },
  dualActionRow: { flexDirection: 'row', gap: 10 },
  miniActionBtn: { flex: 1, backgroundColor: '#1e293b', padding: 15, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  btnEmoji: { fontSize: 20 },
  btnTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnTitleSmall: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  btnDescSmall: { color: '#fbbf24', fontSize: 10, fontWeight: '900' },
  btnDesc: { color: '#64748b', fontSize: 11 },
  tabBar: { flexDirection: 'row', marginTop: 30, marginBottom: 15, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 15, padding: 5 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#38bdf8' },
  tabText: { color: '#64748b', fontSize: 10, fontWeight: '900' },
  activeTabText: { color: '#000' },
  sectionHeader: { color: '#fbbf24', fontSize: 14, fontWeight: '900', marginTop: 30, marginBottom: 10, letterSpacing: 2, width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'flex-start' },
  gridItem: { width: (Dimensions.get('window').width - 70) / 4, aspectRatio: 0.9, margin: 4, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  gridIcon: { width: 35, height: 35 },
  eggIcon: { width: 35, height: 35, marginBottom: 5 },
  gridName: { color: '#64748b', fontSize: 6, fontWeight: 'bold', marginTop: 3, textAlign: 'center' },
  itemCountBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#fbbf24', borderRadius: 10, paddingHorizontal: 4, paddingVertical: 2 },
  itemCountText: { color: '#000', fontSize: 8, fontWeight: '900' },
  selectedItem: { borderColor: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.1)' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#64748b', textAlign: 'center', fontSize: 12 },
  regionSelectorRow: { flexDirection: 'row', gap: 8, marginBottom: 15 },
  regionSelectorBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', paddingVertical: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  regionSelectorBtnActive: { backgroundColor: 'rgba(56,189,248,0.1)', borderColor: '#38bdf8' },
  regionSelectorText: { color: '#64748b', fontSize: 10, fontWeight: '900' },
  regionSelectorTextActive: { color: '#38bdf8' },
  regionSelectorCount: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: 'bold', marginTop: 2 },
  shinyToggle: { backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 20, padding: 12, borderRadius: 15, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)' },
  shinyToggleActive: { backgroundColor: 'rgba(251,191,36,0.1)', borderColor: '#fbbf24' },
  shinyToggleText: { color: '#64748b', fontSize: 11, fontWeight: '900' },
  shinyToggleTextActive: { color: '#fbbf24' },
  regionGrid: { gap: 10, marginTop: 10 },
  bigRegionBtn: { borderRadius: 20, overflow: 'hidden' },
  regionGradient: { padding: 25, alignItems: 'center', justifyContent: 'center' },
  bigRegionText: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  regionCount: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 15, marginBottom: 15, alignSelf: 'flex-start' },
  backBtnText: { color: '#38bdf8', fontSize: 14, fontWeight: 'bold' },
  tutorialBox: { backgroundColor: 'rgba(56,189,248,0.1)', borderWith: 1, borderColor: '#38bdf8', borderRadius: 20, padding: 20, marginBottom: 20 },
  tutorialTitle: { color: '#38bdf8', fontSize: 18, fontWeight: '900', marginBottom: 15, letterSpacing: 1 },
  tutorialText: { color: '#fff', fontSize: 12, marginBottom: 10, lineHeight: 18 },
  closeTutorial: { backgroundColor: '#38bdf8', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10, alignSelf: 'flex-end', marginTop: 5 },
  closeTutorialText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  cheatBtn: { backgroundColor: 'rgba(251,191,36,0.1)', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, alignSelf: 'flex-start', marginTop: 10, borderWidth: 1, borderColor: '#fbbf24' },
  cheatBtnText: { color: '#fbbf24', fontWeight: '900', fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  evoModal: { backgroundColor: '#1e293b', padding: 25, borderRadius: 30, width: '90%', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { color: '#38bdf8', fontSize: 20, fontWeight: '900', marginBottom: 20, letterSpacing: 2 },
  evoOption: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 20, alignItems: 'center', minWidth: 100, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  evoOptionIcon: { width: 60, height: 60 },
  evoOptionName: { color: '#fff', fontSize: 10, fontWeight: '900', marginTop: 10 },
  evoOptionReq: { color: '#fbbf24', fontSize: 9, fontWeight: 'bold', marginTop: 5 },
  closeModal: { marginTop: 20, padding: 10 },
  closeModalText: { color: '#64748b', fontSize: 12, fontWeight: 'bold' },
  ownedBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#10b981', borderRadius: 8, width: 14, height: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#0f172a' },
  ownedBadgeText: { color: '#fff', fontSize: 8, fontWeight: '900' }
});
