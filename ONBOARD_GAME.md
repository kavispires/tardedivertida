# ONBOARD GAME

## Cloud functions

All file paths here are relative to `/functions/src`.

### Constants

- Update `GAME_CODES` in `/functions/src/utils/constants.ts`.
- Update `GAME_KEYS` in `/functions/src/utils/constants.ts`.
- Update `GAME_COLLECTIONS` in `/functions/src/utils/constants.ts`.

### Create engine

- Create a folder with the game name under `functions/src/engine/`.
- Create the files: `touch actions.ts constants.ts data.ts helpers.ts index.ts setup.ts types.d.ts`
- Add `<game-name>_PHASES` in `/.../constants.ts`.
- In `index.ts`, create a function that will output the initial state called `getInitialState`
- In `index.ts`, create a function named `next<game-name>Phase`
- Use a single `submitAction` function for the game if needed.

### Update delegators in `functions/src/utils/delegators.ts`

- Add entry to `getCollectionNameByGameCode`.
- Add entry to `getCollectionKeyByGameCode`.
- Add entry to `getEngine`.

### Add submitAction to `functions/src/index.ts`

- Add the action there

## UI Setup

All file paths here are relative to `/src`.

### Constants

- Add your game to `/assets/data/games.json`, make sure to use an unique game code letter and the available flag.
- Update `GAME_COLLECTION` in `/utils/constants.ts`.
- Update `PHASES` in `/utils/phases.ts`.

### Banner

- Add a banner image for your game in `../public/images/banners/`.
- The naming convention is `game-image-<game-name>-<language>.jpg`.

### Setup Basic Game files

- Create a folder with the game name under `/games/`.
- Create a session file `Session<game-name>.tsx` with basic placeholder stuff.
- Create a api file `api-requests.ts` for api calls for the game.
- Create a `<game-name>.d.ts` for game specific types.
- Update `/games/index.ts` to include the new game.
- Update `/pages/Game.tsx` to include the new Game Session.

# Add cloud functions Adapter

- Update `/adapters/index.ts` with the new cloud functions

# Customize the Lobby "clouds" background

- By changing the settings here: `src/components/lobby/_internal/CloudBackground.tsx`

### Rules Images

- Add rules images in `../public/images/rules/` following the same array of rules in games.json.
- The naming convention is `game-rule-<game-name>-<rule-index>.jpg`.
