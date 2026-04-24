# Implementation Plan: Pokemon Cry Playback

## Overview

Add `playCry` `@ReactMethod` to `PokemonModule.kt` with its own `MediaPlayer` instance, then wire it into HomeScreen grid tap, CryScreen on-mount, and LockScreen sprite tap via the Totodile component's new `onPress` prop. All 251 `.ogg` cry files already exist in `res/raw/`. No new libraries needed on the JS side — playback is fully native.

## Tasks

- [x] 1. Add `playCry` method to PokemonModule
  - [x] 1.1 Add `MediaPlayer` import and private field to `PokemonModule.kt`
    - Add `import android.media.MediaPlayer` to the imports in `pokemon-screen/android/app/src/main/java/com/pokemonscreen/PokemonModule.kt`
    - Add `private var mediaPlayer: MediaPlayer? = null` field to the `PokemonModule` class
    - _Requirements: 1.1, 1.2, 1.5_

  - [x] 1.2 Implement the `playCry` `@ReactMethod`
    - Add the `playCry(pokemonName: String?, promise: Promise)` method to `PokemonModule.kt`
    - Validate input: if `pokemonName` is null or blank, resolve promise with `false` and return
    - Build resource identifier: `"${pokemonName.lowercase()}_cry"` via `resources.getIdentifier`
    - If resource ID is 0 (missing file), resolve promise with `false`
    - Release any existing `mediaPlayer` instance before creating a new one
    - Create `MediaPlayer.create(reactApplicationContext, resId)`, set `onCompletionListener` to release, call `start()`, resolve promise with `true`
    - Wrap creation/playback in try-catch: on exception, release partial resources and resolve `false`
    - Follow the exact implementation from the design document
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 6.1, 6.2, 6.3_

  - [ ]* 1.3 Write property test: valid name resolves correct resource and returns true
    - **Property 1: Valid name resolves correct resource and returns true**
    - Add Kotest property-testing dependencies (`io.kotest:kotest-runner-junit5`, `io.kotest:kotest-property`) and `mockk` to `pokemon-screen/android/app/build.gradle` `testImplementation`
    - Create test file at `pokemon-screen/android/app/src/test/java/com/pokemonscreen/PlayCryPropertyTest.kt`
    - Generate random names from the POKE_IDS key set, mock `resources.getIdentifier` to return non-zero, mock `MediaPlayer.create` to return a mock player, verify promise resolves `true` and resource ID is `"${name}_cry"`
    - **Validates: Requirements 1.1, 1.4, 5.1, 5.2, 5.3**

  - [ ]* 1.4 Write property test: sequential cries release previous MediaPlayer
    - **Property 2: Sequential cries release previous MediaPlayer**
    - Generate random pairs of valid Pokémon names, call `playCry(A)` then `playCry(B)`, verify `release()` was called on A's MediaPlayer before B's MediaPlayer is created
    - **Validates: Requirements 1.2**

  - [ ]* 1.5 Write property test: missing resource resolves false with no audio
    - **Property 3: Missing resource resolves false with no audio**
    - Generate random strings NOT in POKE_IDS, mock `resources.getIdentifier` to return 0, verify promise resolves `false` and `MediaPlayer.create` is never called
    - **Validates: Requirements 1.3**

  - [ ]* 1.6 Write property test: completion releases MediaPlayer resources
    - **Property 4: Completion releases MediaPlayer resources**
    - Generate random valid names, capture the `onCompletionListener`, invoke it, verify `release()` is called and internal `mediaPlayer` reference is nulled
    - **Validates: Requirements 1.5**

  - [ ]* 1.7 Write property test: null or blank input resolves false without playback
    - **Property 5: Null or blank input resolves false without playback**
    - Generate null, empty, and whitespace-only strings, verify promise resolves `false` without any `getIdentifier` or `MediaPlayer.create` calls
    - **Validates: Requirements 6.2**

  - [ ]* 1.8 Write property test: errors during playback result in graceful cleanup
    - **Property 6: Errors during playback result in graceful cleanup**
    - Generate valid names, mock `MediaPlayer.create` or `start()` to throw exceptions, verify exception is caught, partial resources released, and promise resolves `false`
    - **Validates: Requirements 6.1, 6.3**

- [x] 2. Checkpoint — Verify native module compiles
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Wire cry playback into HomeScreen grid tap
  - [x] 3.1 Add `playCry` call to HomeScreen grid item press
    - In `pokemon-screen/src/screens/HomeScreen.tsx`, modify the grid item `onPress` handler
    - When `isOwned` is true: call `PokemonModule.playCry(item)` alongside the existing `PokemonModule.switchPokemon(item)`
    - When `isOwned` is false: no change (no cry, no switch — same as current behavior)
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 3.2 Write unit tests for HomeScreen cry integration
    - Verify: tap owned Pokémon → both `playCry` and `switchPokemon` called with correct name
    - Verify: tap unowned Pokémon → `playCry` NOT called
    - _Requirements: 2.1, 2.2, 2.3_

- [x] 4. Wire cry playback into CryScreen on mount
  - [x] 4.1 Add `playCry` call to CryScreen mount effect
    - In `pokemon-screen/src/screens/CryScreen.tsx`, add a `useEffect` (or extend the existing one) that calls `PokemonModule.playCry(stats.selectedPokemon)` when `stats.isHatched` is `true`
    - When `stats.isHatched` is `false` (egg), do NOT call `playCry`
    - _Requirements: 3.1, 3.2_

  - [ ]* 4.2 Write unit tests for CryScreen cry integration
    - Verify: mount with hatched Pokémon → `playCry` called with `selectedPokemon`
    - Verify: mount with egg (not hatched) → `playCry` NOT called
    - _Requirements: 3.1, 3.2_

- [x] 5. Wire cry playback into LockScreen via Totodile tap
  - [x] 5.1 Add `onPress` prop to Totodile component
    - In `pokemon-screen/src/components/shared/Totodile.tsx`, add `onPress?: () => void` to `TotodileProps`
    - Wrap the `Animated.View` content in a `TouchableOpacity` (or `Pressable`) that calls `onPress` when tapped
    - Ensure the walking/bobbing animations are not disrupted by the touchable wrapper
    - _Requirements: 4.1_

  - [x] 5.2 Pass cry callback from LockScreen to Totodile
    - In `pokemon-screen/src/screens/LockScreen.tsx`, import `NativeModules` and get `PokemonModule`
    - Determine the current Pokémon name (from stats or hardcoded `"totodile"` matching current behavior)
    - Pass `onPress={() => PokemonModule.playCry(currentPokemon)}` to the `<Totodile>` component
    - _Requirements: 4.1_

  - [ ]* 5.3 Write unit tests for LockScreen cry integration
    - Verify: tap Totodile sprite → `playCry` called with current Pokémon name
    - _Requirements: 4.1_

- [x] 6. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The `PokemonOverlayService.playCry()` is NOT modified — the new `PokemonModule.playCry()` is independent with its own `MediaPlayer` instance
- All 251 `.ogg` cry files already exist in `pokemon-screen/android/app/src/main/res/raw/`
- Property tests use Kotest (`kotest-property`) with `mockk` for Android mocking
- No JS audio library needed — playback is fully native via `MediaPlayer`
- The LockScreen currently hardcodes "totodile" references — the `playCry` wiring should match whatever Pokémon the Totodile component represents
