# Adding a custom Megamix track

This guide describes how to add a new track to Megamix. A track is a minigame
that is selected by the Megamix backend, optionally receives player-generated
seed data, and then uses the normal Megamix majority-vote scoring system.

## Before you start

Decide which of these applies:

- **Existing game ID:** the track is another Megamix presentation of a game
  that already exists. Reuse its game ID, resource types, and generic vote or
  result components where possible.
- **New game ID:** the track needs a new game identifier, title, instructions,
  game banner, and possibly a new game folder/metadata entry.

Also decide whether the track needs **seeding**. A seeded track collects input
from players before the track rounds begin; an unseeded track can use only
backend-generated data or shared resources.

## Track lifecycle

The backend flow is:

1. `getData()` selects candidates from the enabled category and builds the
	serializable `Track` object.
2. `prepareSetupPhase()` stores the tracks and sets the round count.
3. `prepareSeedingPhase()` calls `distributeSeeds()` for tracks that need
	player input.
4. `prepareTrackPhase()` calls `handleSeedingData()` after seeding and exposes
	one track to the client.
5. The client renders the track through `StepTrack`.
6. Each player submits `{ data: { value } }` through
	`SUBMIT_TRACK_ANSWER`.
7. `prepareResultPhase()` calls `getMostVotes(players, 'value')`; generic
	scoring assigns the majority to the VIP area.

The normal scoring rules therefore apply automatically: joining the VIP area
earns 1 point, staying earns 2 points, and catch-up bonuses/penalties are
handled by `getRanking()`.

## Backend changes

All paths below are relative to `functions/src`.

### 1. Register the game ID, if it is new

Update `constants/games.ts`, adding an entry to `GAMES` with:

- a unique kebab-case `name` (for example, `my-new-track`),
- a `code`, and
- a unique `key` (for example, `MY_NEW_TRACK`).

This makes `GAME_NAMES.MY_NEW_TRACK` available to the Megamix engine. If the
track uses an existing game, do not add another game entry.

### 2. Add the candidate to a category

Update `games/megamix/constants.ts`:

1. Add the candidate to the appropriate array (`IMAGES_TRACKS`,
	`CHARACTERS_TRACKS`, `DRAWING_TRACKS`, `PEOPLE_TRACKS`, `ICONS_TRACKS`,
	`WORDS_TRACKS`, `PATTERN_TRACKS`, `CONSENSUS_TRACKS`, `INPUT_TRACKS`,
	`OPINIONS_TRACKS`, `SPECIAL_TRACKS`, or `OTHER_TRACKS`).
2. Set `game`, `type`, `nsfw`, `variant`, and `weight` (`1` or `2`).
3. Set `needsSeeding: true` only when player input is required.
4. Do not set `disabled` for a live track.

The category must also be present in the Megamix `tracks` options in
`src/games/megamix/game-info.json`; existing categories already are.

**Selection gotcha:** the current `getRandomTrackGame()` implementation in
`games/megamix/data.ts` skips candidates when `disabled` **or** `verified` is
`true`. Do not add `verified: true` expecting it to enable a track; with the
current code it prevents selection. If that flag is meant to represent
production verification, fix that predicate separately and test the change.

### 3. Build the track data

Update `games/megamix/data.ts`:

1. Import any resource types, resource identifiers, or helper functions needed.
2. Add a `getCandidateOnList(customTrackCandidates, GAME_NAMES.X)` block.
3. Load data with `fetchResource()` or an existing resource helper, apply the
	language and NSFW filters, and sample only the amount of data the UI needs.
4. Push a track with the exact game ID and the data shape expected by the
	client:

```ts
{
  game: GAME_NAMES.MY_NEW_TRACK,
  variant: 'default',
  data: {
	 // serializable data consumed by the client
  },
}
```

Keep `data` JSON/Firebase serializable. If multiple variants share one game
ID, branch on `candidate.variant` and include the same variant in the output.
If a new resource library is required, add its identifier to
`constants/resources.ts` and follow the existing resource conventions.

### 4. Add backend seeding, when needed

For `needsSeeding: true`, update all of the following:

- `games/megamix/helpers.ts` — add a case in `distributeSeeds()` to create
  individual or group seed entries, and a case in `handleSeedingData()` to
  turn submitted player data into the final track data.
- `games/megamix/types.d.ts` — add the candidate's seed data shape if a more
  specific type is useful. The existing types are permissive, but matching the
  actual payload makes integration safer.
- The client seed types and components listed below.

Do not add a seeding case for an unseeded track. It will otherwise create seed
steps that players cannot complete.

### 5. Confirm action and scoring compatibility

No backend action change is normally needed: `actions.ts` already accepts the
track answer and `index.ts` already routes `SUBMIT_TRACK_ANSWER`.

The client must submit a value under `data.value`, because
`prepareResultPhase()` counts `player.data.value`. The value should be a stable
string or number shared by all players. If the track needs a scoring rule other
than majority voting, it is not a standard custom Megamix track and requires
changes to `getMostVotes()`/`getRanking()` plus corresponding result UI.

## Client changes

All paths below are relative to `src/games/megamix`.

### 6. Add title and instruction text

Update `utils/constants.ts` in both `TITLES` and `INSTRUCTIONS` using the exact
game ID. Provide both `pt` and `en` strings. These maps are used by
`TrackTitle` and `TrackInstructions`; missing entries fall back to generic
text.

### 7. Add the track component

Create `components/Tracks/Track{Name}.tsx` and export a named component that
matches `TrackProps`. The component should:

- read only from `track.data` and its declared props,
- render the challenge and bilingual instructions,
- disable submission while loading or after the user is ready,
- submit exactly `{ data: { value } }`, and
- use `useMock()` and `mockSelection()` so the track can be tested in dev mode.

Copy the closest existing track component rather than creating a new layout
pattern. `TrackMenteColetiva`, `TrackVamosAoCinema`, and the other files in
`components/Tracks/` demonstrate the expected structure.

Register the component in the mapping in `StepTrack.tsx`:

```ts
'my-new-track': TrackMyNewTrack,
```

### 8. Add vote and result rendering

Choose existing generic components whenever possible. Add the game ID to:

- `components/VotesDelegator.tsx` — for example, `VoteValue` when the values
  can be displayed as text, or `VoteImagesTrack` for image-card choices.
- `components/ResultValueDelegator.tsx` — for example, `ResultText`,
  `ResultImage`, or another compatible result component.

If no existing component fits, create a component under `components/Votes/` or
`components/Results/` and register it in the corresponding delegator. Both
delegators must understand the same `track.game` ID, or the fallback component
will be shown.

### 9. Add the track icon

Update `components/TrackIcon.tsx`:

- add the ID to the vinyl list for normal Tarde Divertida game tracks,
- use the cassette list for Megamix choice tracks, or
- use the microphone list for “Who Said This?”-style party tracks.

For a new game ID, `GameBanner` also needs to be able to resolve that game’s
banner/metadata.

### 10. Add client seeding, when needed

For a seeded track, update:

- `utils/types.ts` — add a `SeedEntry{Name}` type and include it in
  `SeedEntry`;
- `StepSeeding.tsx` — import the seed component and render it for the new
  `currentSeed.type`;
- `utils/helpers.ts` — add the seed’s title/content in `buildSeedingSteps()`;
- `utils/mock.ts` — add mock input in `mockSeeding()`;
- `components/Seeds/` — create the `Seed{Name}` component and call
  `updateData()` with the payload expected by backend `handleSeedingData()`.

For an unseeded track, none of these changes are required.

## New game metadata and assets

When the track uses a **new game ID**, also complete the normal game
registration work:

1. Create `src/games/{game-id}/game-info.json` if this is a standalone game
	that should appear outside Megamix.
2. Add the ID to `src/utils/info.ts` if its metadata must be loaded by the UI.
3. Add the game/banner assets required by `GameBanner` using the repository’s
	existing naming and image locations.
4. Add the game to any generated metadata through the project’s metadata
	workflow; do not hand-edit generated output unless the project workflow
	requires it.

If the track is only a new variant of an already registered game, reuse that
game’s metadata and assets. A new standalone `Session` is not needed merely
to make an existing game playable inside Megamix.

## Verification checklist

Run the checks from the repository root:

- format/import checks: `yarn sort-imports` and `yarn lint`;
- client type/build check: `yarn build`;
- Cloud Functions type/build check: from `functions/`, run `yarn build`;
- icon validation: `yarn check:icons`.

Then test with the local app/emulator setup:

1. Start a Megamix game with the track’s category enabled.
2. Confirm the candidate is selected and the track appears in a non-reserved
	round. Megamix reserves rounds 1, 8, and 15 (zero-based positions 0, 7,
	and 14) for choice tracks.
3. Confirm the track data renders in both languages.
4. Submit answers from at least three players and verify the majority enters or
	stays in the VIP area.
5. Verify tie and all-different answers, if the track supports them.
6. For seeded tracks, verify every player receives and completes the seed step,
	and that the resulting options are available in the track phase.
7. Check the result animation, ranking, final winners, and achievements.
8. Test NSFW filtering, player counts, and party mode when relevant.

## Files at a glance

### Always consider

- `functions/src/constants/games.ts` — only for a new game ID
- `functions/src/games/megamix/constants.ts`
- `functions/src/games/megamix/data.ts`
- `src/games/megamix/utils/constants.ts`
- `src/games/megamix/components/Tracks/Track{Name}.tsx`
- `src/games/megamix/StepTrack.tsx`
- `src/games/megamix/components/TrackIcon.tsx`
- `src/games/megamix/components/VotesDelegator.tsx`
- `src/games/megamix/components/ResultValueDelegator.tsx`

### Only for seeded tracks

- `functions/src/games/megamix/helpers.ts`
- `functions/src/games/megamix/types.d.ts`
- `src/games/megamix/utils/types.ts`
- `src/games/megamix/StepSeeding.tsx`
- `src/games/megamix/utils/helpers.ts`
- `src/games/megamix/utils/mock.ts`
- `src/games/megamix/components/Seeds/Seed{Name}.tsx`
