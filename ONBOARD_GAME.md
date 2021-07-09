# ONBOARD GAME

## Cloud functions

All file paths here are related to `/functions/src`.

### Constants

- Update `GAME_CODES` in `/utils/constants.ts`.
- Update `GAME_KEYS` in `/utils/constants.ts`.
- Update `GAME_COLLECTIONS` in `/utils/constants.ts`.
- Update `GAME_PLAYERS_LIMIT` in `/utils/constants.ts`
- Update `PHASES` in `/utils/constants.ts`.

### Create engine

- Create an engine file with the name convention `<game-name>.ts` in `/engine/`.
- Create a function that will output the initial state called `getInitialState`

### Update /utils/index.ts

- Add entry to `getCollectionNameByGameCode`.
- Add entry to `getCollectionKeyByGameCode`.
- Add entry to `getInitialStateForCollection`.

## UI Setup

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

- Create a folder with the game name under `/components/games/`.
- Create a session file `Session<game-name>.jsx` with basic placeholder stuff.
- Update `/components/games/index.jsx` to include the new game.
- Update `/components/Game.jsx` to include the new Game Session.

# Add cloud functions Adapter

- Update `/adapters/index.js` with the new cloud functions
- Update the getAPI function as well
