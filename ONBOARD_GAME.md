# ONBOARD GAME

## Cloud functions

All file paths here are relative to `/functions/src`.

### Constants

- Update `GAME_CODES` in `/utils/constants.ts`.
- Update `GAME_KEYS` in `/utils/constants.ts`.
- Update `GAME_COLLECTIONS` in `/utils/constants.ts`.
- Update `GAME_PLAYERS_LIMIT` in `/utils/constants.ts`.
- Update `DEV_GAME_IDS` in `/utils/constants.ts`.

### Create engine

- Create a folder with the game name under `/engine/`.
- Create the files: `touch actions.ts constants.ts data.ts helpers.ts index.ts interfaces.ts setup.ts`
- Add `<game-name>_PHASES` in `/.../constants.ts`.
- In `index.ts`, create a function that will output the initial state called `getInitialState`
- In `index.ts`, create a function named `next<game-name>Phase`
- Use a single `submitAction` function for the game if needed.

### Update delegators in `/utils/delegators.ts`

- Add entry to `getCollectionNameByGameCode`.
- Add entry to `getCollectionKeyByGameCode`.
- Add entry to `getInitialStateForCollection`.
- Add entry to `getNextPhaseForCollection`.

## UI Setup

All file paths here are relative to `/src`.

### Constants

- Add your game to `/resources/games.json`, make sure to use an unique game code letter and the available flag.
- Update `GAME_COLLECTION` in `/utils/constants.js`.
- Update `PHASES` in `/utils/constants.js`.

### Banner

- Add a banner image for your game in `../public/images/banners/`.
- The naming convention is `game-image-<game-name>.jpg`.

### Rules Images

- Add rules images in `../public/images/rules/` following the same array of rules in games.json.
- The naming convention is `game-rule-<game-name>-<rule-index>.jpg`.

### Setup Basic Game files

- Create a folder with the game name under `/games/`.
- Create a session file `Session<game-name>.jsx` with basic placeholder stuff.
- Update `/games/index.js` to include the new game.
- Update `/routes/Game.jsx` to include the new Game Session.

# Add cloud functions Adapter

- Update `/adapters/index.js` with the new cloud functions
