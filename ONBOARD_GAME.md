# ONBOARD GAME

> Use `yarn onboard` as the source of truth for onboarding. Select the required step from its four-step CLI; this document supplements the CLI with the files and manual follow-up work involved.

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

- Add entry to `engines`.

## UI Setup

All file paths here are relative to `/src`.

### Constants

- Update `GAME_COLLECTION` in `/utils/constants.ts`.

### Banner

- Add a banner image for your game in `../public/images/banners/`.
- The naming convention is `<game-name>-<language>.jpg`.

### Setup Basic Game files

- Create a folder with the game name under `/games/`. You may duplicate the folder `_template` there
- Create a session file `Session<game-name>.tsx` with basic placeholder stuff.
- Create a api file `utils/api-requests.ts` for api calls for the game.
- Create a `utils/types.ts` for game specific types.
- Create a `game-info.json` for game info object.
- Update `src/games/gameLoader.ts` to include the new Game Session.

# Add game to the list

- Update `src/utils/info.ts` with the game entry for its game-info

# Customize the Lobby "clouds" background

- By changing the settings here: `src/components/lobby/_internal/CloudBackground.tsx`

### Rules Images

- Add rules images in `../public/images/rules/` following the same array of rules in games.json.
- The naming convention is `game-rule-<game-name>-<rule-index>.jpg`.

## Achievements

### Backend Setup (Cloud Functions)

1. **Create `achievements.ts` file** in your game's engine folder (`functions/src/engine/<game-name>/`)
   ```typescript
   import { achievementBuilder } from '../../utils/tool-kits';

   const achievements = achievementBuilder('GAME_NAME')
     .counter('propertyName', {
       doc: 'Description of what this tracks',
       most: 'ACHIEVEMENT_ID',
       least: 'OTHER_ACHIEVEMENT_ID', // optional
     })
     .build();

   export const {
     constants,
     setup: setupAchievements,
     increase: increaseAchievement,
     calculate: getAchievements,
   } = achievements;
   ```

   **Note:** Use simple `achievements` variable name since it's only used internally and not exported.

   const achievements = setupAchievements(Object.keys(players));
   ```

3. **Track achievements** during gameplay in `helpers.ts`, `actions.ts`
   ```typescript
   import { increaseAchievement } from './achievements';

   increaseAchievement(store.achievements, playerId, 'propertyName', value);
   ```

4. **Calculate at game over** in `setup.ts` - `prepareGameOverPhase`
   ```typescript
   import { getAchievements } from './achievements';

   const achievements = getAchievements(store.achievements, players);
   ```

**Note:** Use direct string literals for achievement IDs. Don't import from `constants.ts`. The toolkit auto-generates constants if needed.

### Frontend Setup (UI)

- Use the component `<Achievements />` in the GameOverPhase, passing a reference for all the icons in the game (see type `AchievementReference`)
- Update `ACHIEVEMENTS_DICT` in `src/utils/achievements.ts` so achievements are available in the User page
