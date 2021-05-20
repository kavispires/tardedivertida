# ONBOARD GAME

## Basic

### Constants

- Add your game to `/resources/games.json`, make sure to use an unique game code letter.
- Update `GAME_COLLECTION` in `/utils/constants.js`.
- Update `PHASES` in `/utils/constants.js`.

### Banner

- Add a banner image for your game in `../public/images/banners/`.
- The naming convention is `game-image-<game-name>.jpg`.

### Rules Images

- Add rules images in `../public/images/rules/` following the same array of rules in games.json.
- The naming convention is `game-rule-<game-name>-<rule-index>.jpg`.

## Cloud functions

All file paths here are related to `/functions/src`.

### Constants

- Update `GAME_CODES` in `/utils/constants.ts`.
- Update `GAME_COLLECTIONS` in `/utils/constants.ts`.
- Update `PHASES` in `/utils/constants.ts`.

### Create engine

- Create an engine file with the name convention `<game-name>.ts` in `/engine/`.
- Create an object with the name name as the game that contains the methods `getInitialSession`, `lockGame`

### Update /utils/index.ts

- Add entry to `getCollectionNameByGameCode`.
- Add entry to `getGameMethodsByCollection`.
