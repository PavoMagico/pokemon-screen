# Requirements Document

## Introduction

This feature adds Pokémon cry (sound) playback to the app. When a user taps a Pokémon — in the HomeScreen grid, on CryScreen, or on LockScreen — the corresponding `.ogg` cry audio file plays. The overlay service (`PokemonOverlayService`) already has a working `playCry()` method using Android `MediaPlayer` that resolves `{pokemon}_cry` from `res/raw/`. This feature extends that capability to the React Native layer by exposing a `playCry` method on the existing `PokemonModule` Kotlin native module, and wiring it into all tap interactions across the app's screens.

## Glossary

- **PokemonModule**: The existing custom Kotlin native module (`NativeModules.PokemonModule`) that bridges Android native functionality to React Native. Handles stats, permissions, switching, evolution, and overlay summoning.
- **PokemonOverlayService**: The Android foreground service that renders the walking Pokémon sprite overlay on the home/lock screen. Already contains a working `playCry()` method using `MediaPlayer`.
- **Cry_File**: An `.ogg` audio file stored in `pokemon-screen/android/app/src/main/res/raw/` following the naming convention `{pokemon_name}_cry.ogg` (e.g., `charmander_cry.ogg`). All project resources live under the `pokemon-screen/` directory — the root-level `android/` folder is not used.
- **MediaPlayer**: Android's `android.media.MediaPlayer` class used to play audio resources.
- **HomeScreen**: The main React Native screen displaying the Pokémon grid, shop, and evolution system.
- **CryScreen**: The React Native screen showing the current partner Pokémon with ripple animations and cry visual effects.
- **LockScreen**: The React Native screen displaying a lock screen mockup with a walking Pokémon sprite.
- **Cry_Resource_Identifier**: The Android resource identifier resolved via `resources.getIdentifier("{pokemon}_cry", "raw", packageName)`.

## Requirements

### Requirement 1: Expose Cry Playback via Native Module

**User Story:** As a developer, I want a `playCry` method on the PokemonModule native module, so that React Native screens can trigger cry audio playback for any Pokémon.

#### Acceptance Criteria

1. WHEN the `playCry` method is called with a valid Pokémon name, THE PokemonModule SHALL resolve the Cry_Resource_Identifier `{pokemon_name}_cry` from `res/raw/` and play the corresponding Cry_File using MediaPlayer.
2. WHEN the `playCry` method is called while a previous cry is still playing, THE PokemonModule SHALL stop and release the previous MediaPlayer instance before playing the new cry.
3. WHEN the `playCry` method is called with a Pokémon name that has no matching Cry_File in `res/raw/`, THE PokemonModule SHALL resolve the Promise with a `false` value and produce no audio output.
4. WHEN the `playCry` method is called with a valid Pokémon name and the Cry_File exists, THE PokemonModule SHALL resolve the Promise with a `true` value after playback starts.
5. THE PokemonModule SHALL release the MediaPlayer resources after cry playback completes.

### Requirement 2: Cry Playback on HomeScreen Grid Tap

**User Story:** As a user, I want to hear a Pokémon's cry when I tap its icon in the HomeScreen grid, so that I get audio feedback for my owned Pokémon.

#### Acceptance Criteria

1. WHEN an owned Pokémon is tapped in the HomeScreen grid, THE HomeScreen SHALL call `PokemonModule.playCry` with the tapped Pokémon's name.
2. WHEN an unowned Pokémon is tapped in the HomeScreen grid, THE HomeScreen SHALL produce no audio output.
3. WHEN an owned Pokémon is tapped in the HomeScreen grid, THE HomeScreen SHALL continue to call `PokemonModule.switchPokemon` to switch the active partner in addition to playing the cry.

### Requirement 3: Cry Playback on CryScreen

**User Story:** As a user, I want to hear my partner Pokémon's cry on the CryScreen, so that the cry visual effects are accompanied by actual audio.

#### Acceptance Criteria

1. WHEN the CryScreen is displayed and the partner Pokémon is hatched, THE CryScreen SHALL call `PokemonModule.playCry` with the current partner Pokémon's name.
2. WHILE the partner Pokémon is not hatched (still an egg), THE CryScreen SHALL produce no cry audio.

### Requirement 4: Cry Playback on LockScreen Tap

**User Story:** As a user, I want to hear the Pokémon's cry when I tap the walking sprite on the LockScreen, so that the interaction feels alive.

#### Acceptance Criteria

1. WHEN the walking Pokémon sprite is tapped on the LockScreen, THE LockScreen SHALL call `PokemonModule.playCry` with the current Pokémon's name.

### Requirement 5: Cry File Name Resolution

**User Story:** As a developer, I want Pokémon names to be correctly mapped to their cry file resource identifiers, so that all 251 Pokémon (Gen 1 + Gen 2) can have their cries played.

#### Acceptance Criteria

1. THE PokemonModule SHALL derive the Cry_Resource_Identifier by converting the Pokémon name to lowercase and appending `_cry` (e.g., `"charmander"` resolves to `"charmander_cry"`).
2. WHEN a Pokémon name contains special characters (e.g., `mr_mime`, `nidoran_f`, `ho_oh`), THE PokemonModule SHALL use the name as-is for resource resolution, matching the existing file naming convention in `res/raw/`.
3. FOR ALL Pokémon names present in the POKE_IDS mapping (251 entries), THE PokemonModule SHALL resolve a valid Cry_Resource_Identifier if the corresponding Cry_File exists in `res/raw/`.

### Requirement 6: Graceful Error Handling

**User Story:** As a user, I want the app to continue working normally even if a cry file is missing or audio playback fails, so that errors do not disrupt my experience.

#### Acceptance Criteria

1. IF MediaPlayer initialization fails for a Cry_File, THEN THE PokemonModule SHALL catch the exception, release any partially initialized resources, and resolve the Promise with `false`.
2. IF the `playCry` method receives a null or empty Pokémon name, THEN THE PokemonModule SHALL resolve the Promise with `false` without attempting audio playback.
3. IF an audio playback error occurs during cry playback, THEN THE PokemonModule SHALL release the MediaPlayer resources and not crash the application.
