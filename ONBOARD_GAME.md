# ONBOARD GAME

## Cloud functions

All file paths here are relative to `functions/src`.

### Constants

- Update `GAMES` in `functions/src/utils/constants.ts`.

### Create engine

- Create a folder with the game name under `functions/src/engine/`.
- Create the files: `touch actions.ts constants.ts data.ts helpers.ts index.ts setup.ts types.d.ts`
- Add `<game-name>_PHASES` in `/.../constants.ts`.
- In `index.ts`, create a function that will output the initial state called `getInitialState`
- In `index.ts`, create a function named `next<game-name>Phase`
- Use a single `submitAction` function for the game if needed.

### Update delegators in `functions/src/utils/delegators.ts`

- Add entry to `getEngine`.

### Add submitAction to `functions/src/index.ts`

- Add the action there

## UI Setup

All file paths here are relative to `/src`.

### Constants

- Update `GAME_COLLECTION` in `/utils/constants.ts`.
- Update `PHASES` in `/utils/phases.ts`.

### Banner

- Add a banner image for your game in `../public/images/banners/`.
- The naming convention is `<game-name>-<language>.jpg`.

### Setup Basic Game files

- Create a folder with the game name under `/games/`. You may duplicate the folder `_template` there
- Create a session file `Session<game-name>.tsx` with basic placeholder stuff.
- Create a api file `utils/api-requests.ts` for api calls for the game.
- Create a `<game-name>.d.ts` for game specific types.
- Create a `game-info.json` for game info object.
- Update `pages/Game.tsx` to include the new Game Session.

# Add game to the list

- Update `src/utils/info.ts` with the game entry for its game-info

# Customize the Lobby "clouds" background

- By changing the settings here: `src/components/lobby/_internal/CloudBackground.tsx`

### Rules Images

- Add rules images in `../public/images/rules/` following the same array of rules in games.json.
- The naming convention is `game-rule-<game-name>-<rule-index>.jpg`.

## Achievements

- Add achievements titles in `functions/src/engine/<>/constants.ts`
- Add the type `export type ArteRuimAchievement = keyof typeof ARTE_RUIM_ACHIEVEMENTS;`
- In the prepareSetupPhase add `utils.achievements.setup` with key trackers for each category
- Add adders everywhere is necessary with the use of ''
- Create a function getAchievements to read the store and generate the achievements properly with the help of the `utils.achievements` functions
- Use the component `<Achievements />` in the GameOverPhase padding a reference for all the icons in the game. See type `AchievementReference`
- Update `ACHIEVEMENTS_DICT` in `src/utils/achievements.ts` so it is available in the User page
