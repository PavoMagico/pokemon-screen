# Pokémon Screen — Project Context

## Overview
Personal app for user and friends. Displays a chosen Pokémon sprite that walks across the Android home screen and lock screen as a live wallpaper. No commercial intent.

## Status
🟡 Planning phase — not started

---

## Platform
- **Primary:** Android (Samsung Galaxy S23 Ultra)
- **Secondary:** iOS (later, if Android succeeds)

---

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Expo bare (create-expo-app) |
| Language | TypeScript + React Native |
| Backend/DB | Supabase |
| Animations | React Native Reanimated |
| Pedometer | Expo Pedometer |
| Native module | Kotlin custom module (Android Live Wallpaper Service) |
| Build | EAS Build (APK/AAB) |
| IDE | Kiro IDE |
| AI assistants | Claude Code CLI / Kiro AI CLI / Claude.ai |
| Runtime | NOT Expo Go — requires custom native module |

---

## Core Features

### Pokémon Selection
- User picks Pokémon from full database
- Sprites: official sprites (personal/non-commercial use)
- Sprite set per Pokémon:
  - 2× idle
  - 2–3× walk cycle
  - 2× cry/shout

### Sprite Behavior
- Walks across screen continuously
- Cry triggered: randomly (infrequent) OR on tap
- Idle animation when not walking

### Screen Presence
- Android Live Wallpaper on home screen
- Android Live Wallpaper on lock screen
- User can toggle: both / home only / lock only / off

### Progression System
XP accumulates from three sources:
| Source | Mechanic |
|---|---|
| Time | Real time elapsed since egg hatch |
| Steps | Device pedometer via Expo Pedometer |
| Taps | User taps on Pokémon |

- Pokémon starts as egg, hatches after threshold
- Levels up as XP grows
- Evolves at evolution thresholds (standard Pokémon levels)

---

## Architecture Notes

### Live Wallpaper (Android)
- Requires `android.service.wallpaper.WallpaperService` Kotlin module
- No Expo/RN library covers this — must be custom native module
- `WallpaperManager` to set programmatically
- Canvas or OpenGL surface for rendering sprite

### Database (Supabase)
Tables needed (draft):
- `pokemon` — id, name, sprites URLs, evolution_chain
- `user_pokemon` — user_id, pokemon_id, xp, level, hatch_date
- `user_settings` — wallpaper_mode (both/home/lock/off)

### Sprites
- Source: official Pokémon sprites (PokéAPI or similar)
- Stored: Supabase storage or CDN URLs in DB
- Format: PNG with transparency

---

## Prerequisites (dev environment)
- [ ] Android Studio installed
- [ ] JDK 17
- [ ] Node.js (already installed)
- [ ] EAS CLI: `npm install -g eas-cli`
- [ ] Expo CLI: `npm install -g expo-cli`
- [ ] Supabase project created
- [ ] EAS account

---

## Project Phases

### Phase 1 — Foundation
- Expo bare project setup
- Supabase schema + connection
- Basic Pokémon selection UI
- Sprite rendering + walk animation on screen

### Phase 2 — Live Wallpaper
- Kotlin native module scaffold
- Render sprite on wallpaper canvas
- Toggle home/lock/both/off

### Phase 3 — Progression
- Egg hatch flow
- XP system (time + steps + taps)
- Level up logic
- Evolution trigger

### Phase 4 — Polish
- Full Pokédex in DB
- Cry audio
- Notifications on level up / evolution
- iOS port (TBD)

---

## Open Questions
- Sprite storage: PokéAPI CDN URLs vs download to Supabase Storage?
- Cry audio: PokéAPI audio files or custom?
- Multiplayer/social features in future?

---

## Last Updated
2026-04-15
