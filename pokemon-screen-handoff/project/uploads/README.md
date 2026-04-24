# Pokémon Screen

Android live wallpaper app — a Pokémon sprite walks across your home screen and lock screen.

> Personal project. No commercial intent.

---

## Features

- 🐣 Start with an egg — hatch and raise your Pokémon
- 🚶 Sprite walks continuously across home screen and lock screen
- 💬 Cry animation triggered randomly or on tap
- ⬆️ Level up via time, steps, and taps
- 🔄 Evolves at standard Pokémon evolution thresholds
- ⚙️ Toggle wallpaper: both screens / home only / lock only / off

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo bare |
| Language | TypeScript + React Native |
| Backend/DB | Supabase |
| Animations | React Native Reanimated |
| Pedometer | Expo Pedometer |
| Native module | Kotlin (Android Live Wallpaper Service) |
| Build | EAS Build |

---

## Platform

- **Android** (primary) — Samsung Galaxy S23 Ultra
- **iOS** (planned)

---

## Project Status

| Phase | Description | Status |
|---|---|---|
| 1 | Foundation — project setup, Supabase, Pokémon selection, sprite animation | 🟡 In progress |
| 2 | Live Wallpaper — Kotlin native module, home/lock screen rendering | ⬜ Pending |
| 3 | Progression — egg hatch, XP system, level up, evolution | ⬜ Pending |
| 4 | Polish — full Pokédex, cry audio, notifications, iOS port | ⬜ Pending |

---

## Getting Started

### Prerequisites

- Node.js
- Android Studio + JDK 17
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Supabase project

### Install

```bash
git clone https://github.com/YOUR_USERNAME/pokemon-screen.git
cd pokemon-screen
npm install
```

### Run (development)

```bash
npx expo run:android
```

> Expo Go not supported — requires custom native module.

---

## Environment Variables

Create a `.env` file at the root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## License

Personal use only. Pokémon sprites © Nintendo / Game Freak.
