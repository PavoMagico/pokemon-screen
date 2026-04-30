# Pokémon Screen

An Android overlay application that brings a Pokémon companion to your screen. Your Pokémon walks, reacts, and grows with you as you move in real life.

> Personal project. No commercial intent.

---

## 🌟 Features

- **Floating Pokémon Overlay**: Your partner stays with you across the home screen, lock screen, and even other apps.
- **Walking Mechanics**:
    - **Step Tracking**: Earn 1 🍬 (Candy) every 50 steps.
    - **Egg Hatching**: Start with an egg and walk 100 steps to hatch it.
- **Growth & Evolution**:
    - **Level Up**: Increase your Pokémon's level automatically through steps or manually using candies.
    - **Evolution System**: Evolve your team once they reach the required level or by using special items (Fire Stone, Water Stone, etc.).
    - **Regional Eggs**: Shop for specific eggs from Kanto, Johto, and Hoenn.
- **Interactions**:
    - **Cries**: Tap your Pokémon to hear its iconic cry.
    - **Physics**: Drag and throw your Pokémon around the screen, or let it walk and bounce smoothly.
    - **Summoning**: Long press or tap 5 times to unsummon; re-summon any time from the app.
- **Collection**:
    - **Pokédex**: Track your progress across generations 1 to 3 (386 Pokémon).
    - **Shiny Mode**: Complete a regional Pokédex to unlock the ability to see Shiny Pokémon!
    - **Bag**: Manage your evolution items and candies.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native (Expo Bare Workflow) |
| **Language** | TypeScript + Kotlin |
| **Backend/DB** | Supabase |
| **Android Service** | Kotlin Overlay Service (`WindowManager`) |
| **Animations** | Native GIF Rendering + Custom Physics Engine |
| **Sensors** | Android Step Detector & Accelerometer |

---

## 📱 Requirements

- **Android**: Supports Android 8.0 (Oreo) and above (API 26+).
- **Permissions**: Requires "Display over other apps" permission to function.

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Android Studio + JDK 17
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/pokemon-screen.git
cd pokemon-screen
```
2. Install dependencies:
```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the App

```bash
npx expo run:android
```
*Note: Due to custom native modules (Overlay Service), this app cannot be run in Expo Go.*

---

## 📊 Project Status

- [x] **Phase 1: Foundation**: Project setup, Supabase integration, and sprite rendering.
- [x] **Phase 2: Overlay Service**: Kotlin native module for system-wide floating Pokémon.
- [x] **Phase 3: Progression**: Egg hatching, step-to-candy conversion, leveling, and evolution.
- [x] **Phase 4: Content**: Full Pokédex (Kanto, Johto, Hoenn), items shop, and shiny mode.
- [ ] **Phase 5: Refinement**: Audio notifications, background sync improvements, and iOS port (Overlay not possible on iOS).

---

## ⚖️ License

Personal use only. Pokémon and related assets are trademarks of Nintendo, Game Freak, and Creatures.
