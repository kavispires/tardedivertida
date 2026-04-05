# Tarde Divertida — Changelog

A multiplayer party game platform built with React, Firebase, and TypeScript. Current version: **50.13.25**

Games are listed by their Portuguese names. Game folder keys used in commits are noted in parentheses where helpful.

---

## 2026

### March 2026

#### Game Updates

- **Adedanhx** — Version 3: answers auto-lock; all answers must be evaluated by all; fixed countdown time during evaluation
- **Medidas Não Exatas** — Fixed Pips functionality; added more initial password cards; fixed duplicated bracket when player changes too fast
- **Crimes Hediondos** — Fixed guessing completion function; alerts users for items in different quadrants
- **Ue Só Isso** — Updated function to include timer when "with hints" option is selected
- **Colegas de Quarto** — Fixed PT rules; added imageBackground; float submit button and other improvements
- **Senso Literário** — Updated game over gallery to wrap entries to fit the screen
- **Não Sou Robô** — Players now submit more than 1 card to get the captcha closer to 8 cards by the players and 1 card by the robot
- **Qual O Quesito?** — Cosmetic updates
- **Na Fila do Banco** — In-progress development; added missing logo files
- Refined and clarified game rules for 9 games
- **Phase Migration** — 25 games migrated: fixed Phases, PhaseProps, and added background support (Arte Ruim, Comunicação Alienigena, Comunicação Duo, Contadores Histórias, Crimes Hediondos, Cruza-Palavras, Duetos, Fileira de Fatos, Galeria de Sonhos, Labirinto Secreto, Medidas Não Exatas, Metalinguagem, Na Rua do Medo, Não Sou Robô, Planejamento Urbano, Polêmica da Vez, Porta dos Desesperados, Qual O Quesito?, Quem Sou Eu, Retrato Falado, Senso Literário, Teoria de Conjuntos, Testemunha Ocular, Ue Só Isso, Vamos ao Cinema, Vice-Campeão)

#### Daily Challenges

- **Daily Hub** — Added bottom margin to daily content
- **Foi um Pirralho** — Demo code added

#### Platform & Infrastructure

- **Vite v8** — Migration completed
- **Phase Delegator Migration** — Performed migration; created `nextPhaseDelegator` in functions to minimize code during `determineNextPhase`
- **ViewIf Migration** — Replaced ViewOr with ViewIf; migration bugs fixed
- **CSS Modules Migration** — Fixed issues created by CSS modules migration (batch 2); fixed SlideShow styles
- Simplified common types for UI and functions
- Updated games schema
- Created image background option for games via Session component
- Bumped dependencies multiple times (vite, firebase-functions, firebase-admin, biome, and other libraries)
- Reverted dependency bump for firebase-functions (caused issues)
- Security updates: bumped flatted (3.3.1 → 3.4.2), js-yaml (3.14.1 → 3.14.2), node-forge (1.3.3 → 1.4.0)
- Updated extract-game-metadata script
- Updated onboard script (added frontend setup and game-info creation)
- Updated checklist with better migration items; disabled every game until verified

#### UI/UX Improvements

- **Hub** — Updated CreateGameModal redirect flow; added way to refresh list of games; added filter for technical features (gear icon for features)
- **Components** — Step component updated to include `useTemporarilyHidePlayersBar` when needed via 'hidePlayersBar' prop; RuleInstruction now has solid color background; created SpaceFloat to fix floating viewport action buttons; added close button to RateGameWidget; moved TripleStateButton to /buttons; VideoBackground displays "coming soon" video when correct video is not available
- **Lobby** — Cleaned up components

#### Performance & Optimization

- Improved code splitting by making the list of games async
- Improved code splitting by moving `getToday` outside of daily

#### Bug Fixes

- Fixed ViewIf migration bugs
- Fixed issues created by CSS modules migration (multiple batches)
- Fixed SlideShow styles from CSS modules migration
- Fixed mismatched player count in games
- Fixed sorting import function in scripts

---

### February 2026

#### New Games

- **Senso Literário** — Released to stable; rounds 4/5 have 5 cards instead of the regular 4
- **Colegas de Quarto** — Released to stable; word pool always has 20 options; winning condition updated (if happiness is achieved everybody wins, otherwise it's individual)

#### Game Updates

- **Testemunha Ocular** — V6: final two suspects individually voted; non-selected questions stay in pool for max 4 rounds (oldest removed); added reason for the crime; improved elimination question wording
- **Labirinto Secreto** — Updated forest pathfinding algorithm
- **Planejamento Urbano** — City map updated for new GridMap toolkit; gallery shows adjacent wrong construction locations; fixed city map in gallery
- **Megamix** — Updated track shuffling for even distribution; party mode prompts updated; for 8+ players in party mode only the fun fact is asked; votes displayed by vote not by player; party mode component overhaul
- **Comunicação Duo** — Released to stable with support for contenders, suspects, and words
- **Cruza-Palavras** — Small typos fixed; rounds increased to 6; drag-and-drop on spreadsheet grid
- **Detetives Imaginativos** — Version 4: 6 fixed rounds, impostor becomes leader; achievements and RuleInstructions added
- **Porta dos Desesperados** — Version 5: new traps (Flip Book, Ordered Doors, Shuffled Doors); deprecated old traps; multiple bug fixes
- **Fofoca Quente** — Phase RUMOR and INTIMIDATION completed; BOARD\_SETUP phase cleaned up (still in progress)
- **Duetos** — Fixed round total during setup
- **Galeria de Sonhos** — Fixed round count when game is restarted
- **Espionagem (daily)** — Fixed result percentage for weekends
- **Bomba Relógio** — Updated rules and player count

#### Daily Challenges

- **Vitrais** — 2.0 update with improved scoring, puzzle persistence, endless "Vitrais Infinitos" mode (progressively harder, any deck)
- **Tá Na Cara** — Data saved per userId; ta-na-cara style variant options
- **Aqui Ó** — Added voice feature ("Go" voice on start); updated disc animation
- **Daily Hub** — Added sortBy (name or release date) to Hub; improved filters and game listing; added timer display for each game; carousel to NextGameSuggestion; fixed NewsLis and updated deck variety

#### Platform & Infrastructure

- **Assets Migration** — Migrated videos, strips, clouds, rules, and in-game images to use td-assets; added new assets URL; deleted binary files now in td-assets
- **Components** — Converted all components to CSS modules; added missing props descriptions; replaced ViewOr with ViewIf and deleted ViewOr
- `GridMap` toolkit updated to use `ZoomPanPinchContainer`
- `Session` component updated with new `setup` prop and provider for active phases
- `Window` component created (Modal with drag-and-drop capabilities)
- Re-sorted all imports; applied new Biome multiline attribute rules
- Bumped react-query, antd, lodash, biome, firebase, rollup, fast-xml-parser
- Replaced deprecated `Button.Group` with `Space.Compact`
- Updated games schema
- Updated common types in functions

#### UI/UX Improvements

- **Hub** — Added sortBy; improved game listing and filters
- **User page** — Game statistics updated for time-played; achievements card height improved; virtualization added to medals page; option to view games by release date
- **Lobby** — Added message for duplicated avatars; button to reload meta when game is restarted; fixed reload game flow; disabled neighboring avatar to prevent too many players with the same color
- **GameOver** — Fixed strip rendering
- Updated `MouseFollowingContent` to be more fluid

#### Performance & Optimization

- Improved code splitting by making the list of games async
- Improved code splitting by moving `getToday` outside of daily

#### Bug Fixes

- Fixed `Session` setup prop causing infinite loop (reverted then fixed)
- Fixed `ZoomPanPinchContainer` container size adaptation
- Fixed update commit script

---

### January 2026

#### New Games

- **Senso Literário** — Released in beta; backend and interface created
- **Colegas de Quarto** — Released in beta; backend created, achievements added
- **Bomba Relógio** — Backend created, UI developed, achievements added, beta release
- **Qual O Quesito?** — Backend completed, rules written, Game Over gallery, achievements added, stable release

#### Game Updates

- **Planejamento Urbano** — Gallery updated to show adjacent wrong construction locations; achievements added; converted to competitive game
- **Cruza-Palavras** — Replaced grid with `SpreadsheetGrid`; drag-and-drop added
- **Vice-Campeão** — UI tweaked
- **Ue Só Isso** — Cleaned up types

#### Daily Challenges

- **Vitrais** — Released (Christmas 2025); improved scoring; puzzle state persistence; 2.0 improvements
- **Aqui Ó** — Added voice ("Go" cue on start); updated disc animation
- **Daily Hub** — Added news entry system and release-date system; tadaa animation for entries \< 15 days old

#### Platform & Infrastructure

- Added `releaseDate` to all game-info files
- Added option to view games by release date in user profile
- Removed unused `rc-util` dependency
- Bumped firebase, react-query, antd, lodash
- Applied new Biome multiline attribute rules; re-sorted all imports

#### UI/UX Improvements

- **Lobby** — Fixed reload game flow; added message for duplicated avatars
- Updated videos for several games

#### Bug Fixes

- Fixed `PhaseTimerReset` triggering twice
- Fixed `ImageCardButton` double buttons
- Fixed lobby double key issue
- Fixed `FixedMenuButton` React 19 bug
- Fixed `useGameActionRequest` to use throttle instead of debounce
- Fixed `SendButton` from debounce to throttle; bumped debounce times to 1500ms

---

## 2025

### December 2025

#### Game Updates

- **Vitrais** — Christmas release; demo created; improved scoring and puzzle state persistence; released
- **Tá Na Cara (daily)** — Added style variant swapper; updated suspect selection; added NSFW toggle
- **Aqui Ó** — Updated disc animation; preload items with TD logo as first line
- **Daily Hub** — Thematic background effects; January fireworks theme; improved next game suggestion order; News modal with release notes

#### Platform & Infrastructure

- **Ant Design v6** — Migrated (November 2025\)
- Bumped firebase-functions, firebase-admin, libraries
- Christmas announcement added to platform
- Updated Suspect schema; bumped antd deprecations

#### UI/UX Improvements

- **Lobby** — Updated to show strip as blurry background; relabeled blur button
- `GameStatistics` — Game video plays on hover in user profile
- Fixed height of loading and error screens

---

### November 2025

#### Game Updates

- **Planejamento Urbano** — Achievements added; converted to competitive game; scoring updated
- **Testemunha Ocular** — Updated character pool to use only `gbExclusive` characters
- **Labirinto Secreto** — Forest map updated to circular 7×7 grid; game migrated to `PhaseProps`
- **Galeria de Sonhos** — `hardMode` renamed to `surpriseMode` (4–7 cards per round)
- **Cruza-Palavras** — Replaced grid with `SpreadsheetGrid`; increased rounds to 6; added drag-and-drop
- **Porta dos Desesperados** — Version 5 traps (Flip Book, Ordered Doors, Shuffled Doors); fixed trap descriptions
- **Fofoca Quente** — Started game development (partial backend and UI)
- **Organiku** — Added tracker feature; 6 items on weekends
- **Espionagem** — Prepared for release; updated logic, beta banner, added to News list

#### Platform & Infrastructure

- **Ant Design v6** — Migration completed
- Removed Showcase page (had been broken for months)
- Added video backgrounds to 9 games; setup phase shows video/background image
- `ZoomPanPinchContainer` layout component created
- Bumped libraries

#### UI/UX Improvements

- **Lobby** — Updated to show strip as blurry background; relabeled blur button
- Updated game banners, strips, and clouds throughout

---

### October 2025

#### New Games

- **Idade da Preda** — Frontend and backend created; released as beta

#### Game Updates

- **Testemunha Ocular** — Targeted Mode added (suspects similar by age, gender, build, or ethnicity); fixed question card color and history statement answers
- **Labirinto Secreto** — Forest map updated to circular 7×7 grid; migrated to `PhaseProps`
- **Galeria de Sonhos** — `hardMode` renamed to `surpriseMode` (4–7 cards per round)
- **Cruza-Palavras** — Replaced grid with `SpreadsheetGrid`; increased rounds to 6; drag-and-drop added
- **Porta dos Desesperados** — Version 5 traps; fixed trap descriptions
- **Comunicação Alienigena** — Added explicit indication of initial items to alien; fixed icons in reveal phase; fixed broken history during game over

#### Platform & Infrastructure

- **React 19 migration** stabilized
- **react-router-dom v7** migration applied
- Migrated all `Avatar` components with `Player-` prefix
- Migrated card components to use specific prop names (`cardId`, `itemId`, `glyphId`, etc.)
- Added `ErrorBoundary` component
- Bumped: biome, libraries

#### UI/UX Improvements

- **Home page** — Added video background; wrapped in `isIdle` to pause after 5 minutes; restored animated background for Safari/fallback
- **GameOver** — Updated with game strip display
- **Suspects** — Updated with new styles for Pixar and Fox variants
- `AnswerButtons` component created
- `PhaseProps` now contains user object; games migrated to new props structure

#### Bug Fixes

- Fixed `PhaseTimerReset` double-trigger
- Fixed `ImageCardButton` double buttons
- Fixed `FixedMenuButton` React 19 bug
- Fixed lobby double key issue
- Fixed `GameOver` strip

---

### September 2025

#### Game Updates

- **Comunicação Duo** — Fixed biome violation in hook usage; fixed history for multiple types; clarified board entry colors
- **Porta dos Desesperados** — Fixed sepia trap description
- **Testemunha Ocular** — Fixed answers for "já/never"; updated history and save data function; improved card table size; added throttle to `ImageCardButton`
- **Daily Espionagem** — Share results fixed; prepared for full release; added elimination order; added suspect name to culprit result
- **Daily Organiku** — Fixed prevent initial items from being clicked; disabled selection when complete; 6 items on weekends
- **Daily Aqui Ó** — Updated disc animation; items preload with TD logo on first line
- **Daily Portais Mágicos** — Fixed to count individual corridor moves; added goal to results

#### Platform & Infrastructure

- **React 19** — Migration applied
- **react-router-dom v7** — Migration applied
- `SendButton` changed from debounce to throttle; `useGameActionRequest` updated to throttle
- Bumped: firebase-admin, biome, vite, tanstack, motion, react-timer-hook, sass

#### Bug Fixes

- Fixed `PhaseTimerReset` triggering twice
- Fixed `ImageCardButton` double buttons
- Fixed `FixedMenuButton` React 19 bug
- Fixed lobby double key issue

---

### August 2025

#### Game Updates

- **Testemunha Ocular** — Fixed answers for "já/never"; improved card table size
- **Daily Comunicação Alienígena** — Fixed DailyItem long-press tooltip behavior; added news about long-press item name feature

#### Platform & Infrastructure

- **Firebase** bumped to v12 (client and functions)
- `getUnusedResources` cloud function created (fetches TDR data, filters used entries from Firestore, resets when needed)
- `modifySuspectIdsByOptions` moved to `tdr-utils`
- `getAnalyticsEventName` helper function created
- `DailyItem` created with long-press tooltip to show item names
- Firebase PLAYED localStorage flags refactored
- Bumped: firebase-admin, biome, vite, tanstack, motion, react-timer-hook, sass

---

### July 2025

#### New Games

- **Medidas Não Exatas** — Created (backend \+ frontend \+ rules with images)
- **Qual Quesito** — Partial backend added

#### Game Updates

- **Vice-Campeão** — Fixed button translation to select card; improved card text
- **Porta dos Desesperados** — Fixed sepia trap description
- **Daily Espionagem** — Updated logic, added beta banner, added to News list; 12 suspects; added feature translations

#### Platform & Infrastructure

- `DivButton` created for accessible div click handling
- Biome fixes throughout (hooks, accessibility, complexity rules)
- Bumped: form-data, libraries

---

### June 2025

#### New Games

- **Idade da Preda** — Backend \+ frontend created; released in beta

#### Game Updates

- **Detetives Imaginativos** — Version 4 preparations: 6 fixed rounds, impostor becomes leader; achievements added
- **Tá Na Cara (daily)** — Added style variant swapper and NSFW toggle
- **Daily Espionagem** — Pushed release date; added features translation; 12 suspects; added suspect description in release modal
- **Daily Organiku** — Disabled selection when complete; prevent initial items from being clicked; added to release preparation

#### Platform & Infrastructure

- Applied new Biome v2 rules
- `getAnalyticsEventName` analytics helper created
- Updated node version in cloud functions
- Bumped dependencies

#### UI/UX Improvements

- **User page** — Created achievements tab; fixed unplayed games color; added beta games

---

### May 2025

#### Game Updates

- **Fofoca Quente** — Data quotes fixed; Phase BOARD\_SETUP started
- **Crimes Hediondos** — Bot logic updated with likelihood fields
- **Vice-Campeão** — Improved card text
- **Daily Espionagem** — Demo added; prepared for release; added banner, rules, and suspect description in release modal
- **Daily Organiku** — Demo created; improved rules; added hearts to Quarteto result; 6 items on weekends
- **Daily Palavreado** — Fixed rules typo; updated result content; colorized previous correct attempts
- **Daily Teoria de Conjuntos** — Fixed result screen; weekend special added

#### Platform & Infrastructure

- Bumped firebase-admin, biome, vite, dependencies
- Removed plublic connect items json

---

### April 2025

#### New Games

- **Vice-Campeão** — Backend created, UI developed (including race replay in Game Over), achievements added, rules with images, released stable
- **Metalinguagem** — Backend \+ UI created; achievements, gallery, Game Over screen; released stable

#### Game Updates

- **Crimes Hediondos** — Added locations and victims options; fixed crime setup function; refactored `CrimeItemCard` design
- **Fofoca Quente** — Started game development (BOARD\_SETUP phase started)
- **Teoria de Conjuntos** — Enable option for double or triple diagram; bumped judge items to always 10; added letter counting (daily)
- **Super Campeonato** — Updated contenders selection UI; updated achievement icons; added descriptions to contenders
- **Metalinguagem** — Pronunciation button in game over; rules with images; achievements and gallery
- **Daily Portais Mágicos** — Prepared for April 12 release; demo created; sound effects added; fixed error when passcode changes length
- **Daily Quartetos** — Fixed validation; fixed shake trigger; fixed repeated guesses; fixed grid render on reopen

#### Platform & Infrastructure

- Migrated deprecated sass `@import` to `@use`; constants file replaced with CSS variables
- `vite-plugin-checker` added for TypeScript checks during dev
- **Rules phase retired** — In-lobby rules confirmed via confirm button replace the standalone Rules phase
- `ZoomPanPinchContainer` layout component created
- `ModalOverlay` component created
- Bumped dependencies

#### UI/UX Improvements

- **Lobby** — Updated to confirm rules in lobby; updated greetings
- **Game banners** — Replaced banners with nameless images; updated game images throughout
- `CloudBackground` — Added different types; new clouds added
- `StepTitle` component applied across all steps

#### Bug Fixes

- Fixed `SignCard` SVG bug
- Fixed `ItemCard` text prop style
- Fixed vite base config
- Fixed sass deprecations
- Fixed audio imports

---

### March 2025

#### New Games

- **Metalinguagem** — Backend and game entry added; UI, achievements, gallery, Game Over screen completed; released stable

#### Game Updates

- **Comunicação Alienigena** — Version 5: better alien bot, human ask suggestions, alien answer suggestions; updated with alien-attributes toolkit; fixed sprite sizes
- **Labirinto Secreto** — Migrated buttons to `SendButton`; added clouds
- **Comunicação Duo** — Added image-cards option with text input; achievements fixed; Cover cards added; history component improved
- **Onda Telepatica** — Fixed types; SendButton added; Needle choice in waiting room
- **Daily Tá Na Cara** — Created as contribution game; added to rotation; added NSFW toggle; testimony-specific suspects
- **Daily Quartetos** — Demo, validation fixes, and prepared for release
- **Daily Aqui Ó** — 9 items on weekends

#### Platform & Infrastructure

- **Vite** — Migrated from Create React App / Webpack to Vite (PR \#175)
- **React hooks global state** → migrated to `@tanstack/store`
- Upgraded CSS: `sass @import` deprecated in favor of `@use`
- Biome v2 adopted
- `getAnimation` helper created for motion/framer-motion migration
- Bumped firebase (functions \+ client), biome, typescript, react-timer-hook

#### Bug Fixes

- Fixed `SignCard` SVG bug
- Fixed `ItemCard` text prop style
- Fixed vite base config
- Fixed sass deprecations
- Fixed `speech Flaviane` special check

---

### February 2025

#### Game Updates

- **Galeria de Sonhos** — Fixed round count for when the game is restarted; fixed card selection count; fixed scss
- **Comunicação Duo** — Fixed history for multiple types; clarified board entry colors; added support for contenders, suspects, and words
- **Megamix** — Fixed seeds title color scheme
- **Teoria de Conjuntos** — Added ability to change previous evaluation
- **Daily Tá Na Cara** — Created as contribution game (added to rotation); removed duplicated suspects; updated interface with testimony-specific suspects
- **Daily Portais Mágicos** — Demo created; sound effects added
- **Daily Quartetos** — Demo added; validation fixes; fixed grid render on reopen
- **Daily Aqui Ó** — Fixed in-game disc set title; 9 items on weekends
- **Daily Hub** — Added news entry system; release-date system; tadaa animation for entries \< 15 days old; updated icon for Tá Na Cara

#### Platform & Infrastructure

- Replaced deprecated `Button.Group` with `Space.Compact`
- Updated dependencies

---

### January 2025

#### New Games

- **Esquiadores** (previously Dilema dos Esquiadores) — Game engine and UI created; achievements added; rules with images; released stable
- **Comunicação Duo** — UI created; achievements and history component added (backend created December 2024\)

#### Game Updates

- **Comunicação Alienigena** — Version 5: better alien bot, human ask suggestions, alien answer suggestions; alien-attributes toolkit integrated
- **Nao Sou Robo** — Added gallery; `warehouse-good` as captcha type; rules images added
- **Vamos Ao Cinema** — Fixed types; removed text-highlight library; achievements added
- **Ue Só Isso** — Fixed types; timer and hints added
- **Onda Telepatica** — Fixed types; SendButton added; Needle choice shown in waiting room
- **Retrato Falado** — Fixed types; SendButton added
- **Mesmice** — Fixed logo and types; SendButton added
- **Na Rua do Medo** — Fixed types; prevented Jackpot/iPad from being first card
- **Polemica da Vez** — Fixed types; SendButton added
- **Mente Coletiva** — Fixed types; SendButton applied; answers added to waiting room
- **Galeria de Sonhos** — Fixed types; motion animation added; `SendButton` applied
- **Contadores de Histórias** — Fixed payload types; improved engine actions
- **Cruza-Palavras** — Fixed cell distribution, grid size, types
- **Fileira de Fatos** — Updated types; NSFW work added
- **Duetos** — Added Game Over gallery; fixed emoji item type; rules images added
- **Linhas Cruzadas** — Updated rules to `RuleInstruction`
- **Sinais de Alerta** — Fixed types; added SlideShow composable components; SendButton
- **Quem Sou Eu** — Fixed types; SlideShow composable components; SendButton
- **Testemunha Ocular** — Fixed types; SendButton
- **Arte Ruim** — Created SlideShow composable components for gallery; fixed game options
- **Adedanhx** — Improved evaluation rejections; improved selection and sorting of cards for grid
- **Super Campeonato** — Updated contenders selection UI; types and SendButton updated
- **Daily Comunicação Alienígena** — Released (November 2024 launch, stabilized Jan 2025\)
- **Daily Aqui Ó** — 9 items on weekends

#### Platform & Infrastructure

- **Biome** — Replaced ESLint and Prettier with Biome (December 2024); enabled in `/functions`; fixed unused imports and variables
- **Motion/Framer Motion** — Added; animated page transitions
- `SendButton` created with debounce and `HostTimeButton`
- `StepTitle` component created and applied across all steps
- `SpaceContainer` moved to `/layout`; `Container` and `PageLayout` moved to `/layout`
- `isEverybodyReady` helper function created
- Functions: deprecated `deepCopy` in favor of `lodash.cloneDeep`; deprecated `orderBy` in favor of lodash; merged `buildIdDictionary` into `buildBooleanDictionary`
- All games re-enabled after verification pass
- Updated copilot-instructions

#### UI/UX Improvements

- **GameOver screen** — Improved with game strip; User Profile button added
- **Lobby** — Redesigned; OTP-style game ID input on home page
- **Game banners and strips** — Updated game banners, strips, and logos throughout
- **Achievements** — Improved animation; guard added when no medals awarded
- **PhaseRules** — Uses custom game background color
- **CloudBackground** — Added different types and new clouds
- New avatars added
- Deck selection added to games that use Contenders/Characters deck
- Game tabs added to Lobby Rules

#### Bug Fixes

- Fixed `RedirectSession` loading state and image
- Fixed `SignInAsGuest`
- Fixed infinite loading screens during auth
- Fixed `PhaseAnnouncement` timer
- Fixed `FloatingHand` drawer component

---

## 2024

### December 2024

#### New Games

- **Comunicação Duo** — Backend created; UI developed; history component added
- **Planejamento Urbano** — Beta released; GridMap toolkit; competitive game structure

#### Game Updates

- **Megamix** — Party Mode where players input personal data; tracks include "who-said-this"; updated for 25 players; migrated to color scheme
- **Contadores de Histórias** — Shortened game; gallery added; hand size increased; UI tweaks
- **Super Campeonato** — Updated contenders selection UI
- **Galeria de Sonhos** — Fireworks during Super Spark; migrated to color scheme
- **Porta dos Desesperados** — Version 4 new traps; rules images added; blur button for book images; migrated to color scheme
- **Daily Comunicação Alienígena** — Created and released
- **Arte Ruim** — Migrated to color scheme
- Several games migrated to color scheme

#### Platform & Infrastructure

- **Biome** — Adopted (December 2024); replaced ESLint and Prettier
- `getAnimation` helper for motion migration
- Motion/framer-motion added; animated page transitions
- Added OTP-style game ID input on home page
- Redesigned Lobby
- Added `/images` logos and strips
- Bumped: firebase, biome, all dependencies

#### UI/UX Improvements

- **GameInfoContext** — Easy access to static game info across components
- **GameOver** — Updated with game strip display
- **Lobby** — Redesigned; OTP-style game ID input
- **SlideShow** — Refactored to use a config; fixed controls and active slide index
- `FloatingHandDrawer` component added

#### Bug Fixes

- Fixed `mesmice` and `sinais-de-alerta` saveGameToUsers
- Fixed `testemunha-ocular` players ready on SelectWitness phase
- Fixed `mente-coletiva` unready during compare phase
- Fixed `duetos` data save
- Fixed user page
- Fixed speech Flaviane special check
- Fixed sass deprecations
- Fixed audio imports

---

### November 2024

#### Game Updates

- **Adedanhx** — Options for game length and grid size; answers shown with evaluations in Results phase
- **Testemunha Ocular** — Achievements added; hard mode added; players unreadied in passive phases
- **Nao Sou Robo** — Summary updated to use `StatusBar` component
- **Vamos Ao Cinema** — Migrated to color scheme
- **Retrato Falado** — Migrated to color scheme
- **Na Rua do Medo** — Migrated to color scheme
- **Teste de Elenco** — Migrated to color scheme; movie title and props shown during genre selection
- **Super Campeonato** — Migrated to color scheme
- **Polemica da Vez** — Migrated to color scheme; `RuleInstruction` migration
- **Ue Só Isso** — Migrated to color scheme
- **Teoria de Conjuntos** — Migrated to color scheme
- **Sinais de Alerta** — Migrated to color scheme; sound timer added; written rules; achievements; saveGameToUsers fixed
- **Onda Telepatica** — Migrated to color scheme; migrated instructions to `RuleInstruction`
- **Porta dos Desesperados** — Migrated to color scheme; cache use fixed
- **Mente Coletiva** — Migrated to color scheme; unready player during compare phase
- **Linhas Cruzadas** — Migrated to color scheme
- **Labirinto Secreto** — Migrated to color scheme; achievements added; zoomable forest; diagonal/cross paths
- **Nao Sou Robo** — Migrated to color scheme
- **Mesmice** — Migrated to color scheme; saveGameToUsers fixed
- **Fileira de Fatos** — Migrated to color scheme
- **Duetos** — Migrated to color scheme
- **Cruza-Palavras** — Migrated to color scheme; result table sorting fixed; disabled own cell selection
- **Contadores de Histórias** — Migrated to color scheme
- **Comunicação Alienígena** — Migrated to color scheme; different alien icons in reveal phase; fixed white screen on GameOver entry
- **Megamix** — Migrated to color scheme; fixed seeds title color scheme
- **Planejamento Urbano** — Beta released; GridMap toolkit; competitive game structure

#### Platform & Infrastructure

- **Color scheme system** — `colorScheme`, `primaryColor`, and `surfaceColor` added to game-info schema; `GameInfoContext` created; `useGameAppearance` hook applied to common components
- `SubmitButton` with debounce created
- `StatusBar` component created
- Shorthand CSS classes added (inspired by Tailwind CSS)
- `sort-imports` script added to pre-commit hook; imports sorted across entire codebase
- Bumped: firebase, husky, biome, libraries

#### UI/UX Improvements

- **GameInfoContext** — Easy access to static game info across components
- **SlideShow** — Refactored to use a config
- New clouds added
- `TimedButton` CSS fixed
- `FloatingHandDrawer` component added
- `useScreenWidth` refactored to `useScreenSize`
- **Hub** — Fixed `GameCard` width; message shown when filters return no results
- Game banners updated; AI-generated strips and logos

#### Bug Fixes

- Fixed `testemunha-ocular` players ready on SelectWitness phase
- Fixed `mente-coletiva` unready during compare phase
- Fixed speech Flaviane special check

---

### October 2024

#### Game Updates

- **Adedanhx** — Display answers with evaluations in Results phase; options for game length and grid size
- **Testemunha Ocular** — Achievements added; hard mode added
- **Nao Sou Robo** — Summary updated to use `StatusBar` component
- **Sinais de Alerta** — Fixed saveGameToUsers
- **Mesmice** — Fixed saveGameToUsers
- **Duetos** — Fixed data save

#### Bug Fixes

- Fixed `testemunha-ocular` players ready on SelectWitness phase
- Fixed `mente-coletiva` unready during compare phase
- Fixed user page
- Fixed speech Flaviane special check

---

### September 2024

#### New Games

- **Sinais de Alerta** — Backend created, UI created, achievements added, beta release
- **Controle de Estoque** — Backend (Phase 1\) and daily version created; released

#### Game Updates

- **Labirinto Secreto** — Added option to use items instead of trees; icon to goal in library; achievements added; diagonal/cross paths; zoomable forest area
- **Comunicação Alienigena** — Added explicit indication of initial items to alien; fixed bugs; added 3 new alien signs
- **Cruza-Palavras** — Fixed result table sorting; disabled own-cell selection
- **Teoria de Conjuntos** — Fixed game over check; judge always places one item per round; daily demo added
- **Arte Ruim** — Fixed auto-select own drawing; added Basic (1,2,3) levels only; filtered out daily-used cards
- **Polemica da Vez** — Renamed "topics" to "tweets"
- Several games — Players unreadied in resolution/results phases
- **Daily Controle de Estoque** — Beta release; localStorage; improvements
- **Daily Teoria de Conjuntos** — Demo, rules hints modal, localStorage; released
- **Daily Palavreado** — 5×5 grid support; localStorage fixed; hint on letters tested on specific cell
- **Daily Aqui Ó** — Fixed win logic; attempts shown in result
- **Daily Hub** — Added suggestion rotation for unplayed games

#### Platform & Infrastructure

- **Firebase Cloud Functions v2** — Migrated daily, user, and all game engines (September 2024\)
- **localStorage service** — Revamped; blurred cards moved to global localStorage; deprecated old service
- **Resource sources** — Updated sources for TDI/TDR resources; removed original suspect/image deck options
- `getUnusedResources` function created
- Added `AutoNextPhase` to `Session`
- `sort-imports` script added to pre-commit hook
- Bumped: firebase, antd, dependencies

#### UI/UX Improvements

- `WaitingTime` animated bar indicator created for non-host players
- `StepSelectPlayer` created (shared step for games where one player has a special role)
- Updated game-info schema with release values
- Updated icon names and organization

#### Bug Fixes

- Fixed `useCache`
- Fixed `GlyphCard` padding
- Fixed `useRedirectToNewGame`
- Fixed multiple scss warnings

---

### August 2024

#### Daily Challenges

- **Controle de Estoque** — Released (beta); localStorage added; debug page; individual LS reset per game
- **Arte Ruim (daily)** — Updated to use `useDailyLocalToday`; organized files; added Drawing instructions for Evaluation phase
- **Aqui Ó** — Added attempts to result; fixed max progress share/display
- **Daily Teoria de Conjuntos** — Demo created; rules hints modal; added to menu

#### Platform & Infrastructure

- **Firebase Cloud Functions v2** — Began migration; migrated daily and user engines
- Revamp localStorage service
- Bumped: firebase, libraries

---

### July 2024

#### Game Updates

- **Labirinto Secreto** — Added option to use items instead of trees; added icon to goal; achievements added; fixed inability to unskip a tree; diagonal/cross paths; zoomable forest
- **Comunicação Alienigena** — Added explicit indication of initial items to alien
- **Daily Palavreado** — Submit guess check fixed

#### Platform & Infrastructure

- **localStorage service** — Revamped; blurred cards moved to global localStorage
- **Resource sources** — Updated sources for TDI/TDR; removed original suspect/image deck options
- `getUnusedResources` function created
- Fixed Firebase deploy and type issues
- Disabled emulator UI (not working on M3)

---

### June 2024

#### Game Updates

- **Labirinto Secreto** — Added option to use items; zoomable forest; achievements
- **Cruza-Palavras** — Added `items` as gridType; fixed options
- **Teste de Elenco** — Added movie title and movie props during genre selection
- **Daily Filmaço** — Demo added; removed demo data; added delay to local storage applier
- **Daily Palavreado** — Added hint on letters already tested on specific cell; revamped

#### Platform & Infrastructure

- **React Query v5** — Migrated
- **Firebase Functions v12** — Bumped dependencies
- TDR types updated: `.decks` instead of `.categories`; `mesmice` renamed to `manufactured`
- TDI sprites migrated: `GlyphCard`, `ItemCard`, and `SignCard` now use TDI Sprites
- `useDailyLocalToday` hook (V2 renamed without suffix)
- Removed original suspect deck option; only MJ decks available
- Removed original image decks option; only TD decks available
- Bumped antd, firebase, and other dependencies

#### Bug Fixes

- Fixed `SignInAsGuest`
- Fixed firebase deploy and type issues
- Fixed `GlyphCard` padding
- Fixed overflow in daily localStorage hook

---

### May 2024

#### Daily Challenges

- **Picaço (Artista)** — Created drawing database population game; renamed to Picaço
- **Filmaço** — Demo added; removed demo data; added delay to local storage applier
- **Controle de Estoque** — Beta released
- **Palavreado** — Created game; added to daily rotation with localStorage; revamped; added swaps count
- **Aqui Ó (hard mode)** — Improved fail experience; prevented double matching; 9 items on weekends

#### Platform & Infrastructure

- Global keyboard created for daily; Error page created for daily
- `CopyToClipboardButton` created in Daily
- Debug page added for daily games
- Bumped ejs, libraries

---

### April 2024

#### Daily Challenges

- **Arte Ruim (daily)** — Updated to use `useDailyLocalToday`; organized files; added Drawing instructions for Evaluation phase
- **Palavreado** — Added swaps count; revamped; in-progress
- **Aqui Ó** — Implemented Hard mode; improved fail experience; 9 items on weekends
- Global keyboard created for daily

#### Game Updates

- **Nao Sou Robo** — Capped at 8 players; 9 captcha cards always; variable robot revolution threshold; final outcome in Game Over
- **Teoria de Conjuntos** — Improvements to Venn diagram placement; display count of items; result for last round
- **Labirinto Secreto** — Added clouds
- **Megamix** — Fixed options schema

#### Bug Fixes

- Fixed `SignInAsGuest`

---

### March 2024

#### New Games

- **Teoria de Conjuntos** — Backend and game entry added; beta released; achievements, round time fixes, UI improvements

#### Game Updates

- **Quem Sou Eu** — Added Image Cards mode
- **Duetos** — Added blur button for image cards; save data for all pairs
- **Mesmice** — Fixed scoring, history, gallery, and game over screen; feature icons updated to flat design; fixed ComplexityMode
- **Megamix** — Tweaked Porta dos Desesperados track; fixed options schema
- **Onda Telepatica** — Migrated instructions to `RuleInstruction`; Needle choice shown in waiting room
- **Teoria de Conjuntos** — Clarified instructions; beta release

#### Platform & Infrastructure

- `WaitingTime` component created
- `SlideShow` composable components created
- `StepSelectPlayer` created
- Bumped: firebase, express, dependencies

---

### February 2024

#### Game Updates

- **Arte Ruim** — Added Basic (1,2,3) levels only; filter cards used in Daily
- **Cruza-Palavras** — Added properties grid option that uses things-qualities data set
- **Galeria de Sonhos** — Don't show danger if player used all its cards

#### Platform & Infrastructure

- TDI sprites migrated: `GlyphCard`, `ItemCard`, and `SignCard` to use TDI Sprites
- `useDailyLocalToday` hook created
- Updated resource names and types (TDR refactor)
- Bumped: `ip`, `follow-redirects`, libraries

---

### January 2024

#### New Games

- **Mesmice** — Backend created, UI developed, pre-release; features: complexity mode, history, gallery

#### Game Updates

- **Comunicação Alienigena** — Ensured cache is cleared before game starts; replaced `inside` attribute with `construction`; tweaked bot algorithm; added `holdable` and `personal` attributes; added 3 new alien signs; 512 alien items total
- **Crimes Hediondos** — Made alien-items usable as weapons and evidence
- **Duetos** — Added more avatars and sprites as round options; fixed `super-hero` option type

#### Platform & Infrastructure

- **Type system refactoring** — Game types, GameInfo types, and User types separated into own files; generics added; all games' types files converted to named exports
- Alien items expanded to 1,280+ entries
- TDI/TDR resources updated and renamed; sprites split into smaller files for lazy loading
- `getAlienItems` updated to accept more comprehensive filters
- Bumped: firebase, antd, gh-pages, lint-staged, lodash types

#### UI/UX Improvements

- `DevButton` to trigger mock and dev events created
- Added dream as item category
- Cards: `ImageCard` `imageId` prop renamed to `id`
- Improved mock players function

#### Bug Fixes

- Fixed `comunicacao-alienigena` cache clearing
- Fixed `super-campeonato` data bug
- Fixed `quem-sou-eu` broken phase
- Fixed `labirinto-secreto` negated card bug
- Fixed `nao-sou-robo` typos
- Security: Bump `follow-redirects`, `ip`, `protobufjs`

---

## 2023

### December 2023

#### Game Updates

- **Cruza-Palavras** — Added image cards grid option; added Words Selection phase for too-difficult words; fixed contenders mode; each player gets 2 cells at a time
- **Megamix** — Party Mode created (players input personal data for this-that, best-of-3, and who-said-this tracks); updated UI for up to 25 players
- **Porta dos Desesperados** — Version 4 new traps; rules images added; fixed door preview; fixed achievement time-based counts
- **Ue Só Isso** — Added guesses to waiting room; fixed `RuleInstructions` in phase announcements
- **Quem Sou Eu** — Added badge count to submit button; added glyph choices to waiting room; fixed broken phase
- **Super Campeonato** — Fixed brackets not having enough candidates due to `getData` bug
- **Mente Coletiva** — Fixed sheep faces during animation; fixed ranking animation; disabled question buttons during loading
- **Mesmice** — Backend started; pre-release work begun
- **Daily** — Daily release numbering system; anti-cheat localStorage; percentage shown in result; URL added to daily

#### Platform & Infrastructure

- **React 18** — Migrated from `@tanstack/react-query`; `useDimensions` deprecated in favor of `useWindowSize`
- Migrated `react-query` → `@tanstack/react-query`
- TDI/TDR resources updated and renamed; sprites split into smaller files for lazy loading
- Libraries bumped: firebase, antd, gh-pages, lint-staged, lodash types

#### Bug Fixes

- Fixed `comunicacao-alienigena` cache clearing
- Fixed `super-campeonato` data bug
- Fixed `quem-sou-eu` broken phase
- Fixed `labirinto-secreto` negated card bug
- Fixed `nao-sou-robo` typos
- Security: Bump `follow-redirects`, `ip`, `protobufjs`

---

### November 2023

#### New Games

- **Nao Sou Robo** — Created and released (1.0.0); backend created; beta released
- **Duetos** — Created and released (1.0.0); backend created; achievements added; rules images
- **Teste de Elenco** — Released 1.0.0; more specific roles; ChatGPT prompt added to game over screen

#### Game Updates

- **Megamix** — Achievements added; multiple bug fixes; all 20+ tracks enabled; "who-said-this" track; Ta Na Cara, mente-coletiva, quem-nao-mata tracks refactored; 6 additional tracks refactored
- **Retrato Falado** — Witness name added to composite sketch; achievements added; scoring bugs fixed
- **Porta dos Desesperados** — New traps (Version 4); rules images; blur button for book images; instructions updated with `RuleInstruction`
- **Comunicação Alienigena** — Added new Signs; NSFW option; improved alien seeding; alien bot improvements; alien items categorized; 512 total alien items assembled
- **Detetives Imaginativos** — Increased hand size to 8; removed duplicated "Your Turn" popups; timed play-card phase
- **Crimes Hediondos** — Fixed achievements bug; improved text and highlights
- **Arte Ruim** — Fixed auto-select own drawing
- **Daily** — Anti-cheat localStorage; Google Sign-In enabled; URL added to daily; percentage shown in result

#### Platform & Infrastructure

- **Daily system launched** (October 2023, PR \#119) — Full daily challenge infrastructure including setup page, user saving/loading, URL routing, auth integration
- Cloud functions grouped: daily, user, admin, and game functions each into a single `httpsCallable`
- Migrated message and notification to use `antd` App
- Bumped antd, firebase, and sass
- `PhaseAnnouncement` props updated with `block` or `overlay` exclusivity
- `RuleInstruction` component created
- `update-commit` script added

#### UI/UX Improvements

- `ImageCardButton` created; image-cards components moved to own folder
- `SpeechBubble` component created
- `SuspectCard` component created
- `CharacterCard` refactored from `ContenderCard`
- New icons: Captcha, Fire, Heart, Socks

#### Bug Fixes

- Fixed infinite loading during auth and sign-in
- Fixed logout button state
- Fixed contadores-historias bug
- Fixed megamix achievement for "longest loser"
- Fixed megamix ta-na-cara track and round number

---

### October 2023

#### New Games

- **Adedanhx** — Created and released (PR \#116); achievements, round announcement, Stop functionality, accent matching
- **Teste de Elenco** — Created; more specific roles; ChatGPT prompt

#### Game Updates

- **Megamix** — Achievements added; "who-said-this" track added; Party Mode begun
- **Retrato Falado** — Achievements added; scoring bug fixes
- **Super Campeonato** — Achievements added
- **Polemica da Vez** — Achievements added; `antd-compatible` library removed
- **Comunicação Alienigena** — New Signs; NSFW option; improved alien seeding; 512 alien items total
- **Arte Ruim** — Fixed auto-select own drawing

#### Platform & Infrastructure

- **Daily system launched** (PR \#119) — Full daily challenge infrastructure
- `husky` pre-commit script automated game versioning
- `GAME_CHECKLIST` file created; updated `ONBOARD_GAME` guide
- Firebase analytics started
- `@babel/traverse` security bumps

#### Bug Fixes

- Fixed infinite loading during auth and sign-in
- Fixed logout button state

---

### September 2023

#### New Games

- **Adedanhx** — Created (PR \#116)

#### Game Updates

- **Megamix** — Refactored with all 20+ mini-game tracks; fixed achievement for longest loser; fixed Ta Na Cara track
- **Retrato Falado** — Added witness name; achievements; scoring improvements
- **Super Campeonato** — Achievements added
- **Detetives Imaginativos** — Increased hand size to 8; timed play-card phase
- **Porta dos Desesperados** — Blur button for book images
- **Mente Coletiva** — Fixed `QuestionSelection` styling
- **Polemica da Vez** — Renamed "topics" to "tweets"

#### Backend/Functions

- `tdr-utils` created with `alienItems` getter, `saveUsed`, `contenders` getter, `single-words` getter
- Cloud functions grouped: daily, user, admin, and game functions into single `httpsCallable`
- Adapters' `httpsCallable` moved to individual game API files

#### Developer Experience

- `MouseFollowingContent` component created
- `Container` component created
- `AnimationClass` options object refactored
- `AvatarGroup` component created
- Security: Bump `tough-cookie`, `semver`, `word-wrap`

---

### August 2023

#### Game Updates

- **Comunicação Alienigena** — New phase: players help seed the alien bot; added history for empty messages; added explanation for erasing attributes; `AlienWritingBoard` always shows controls; used/asked item counts shown; alternating/reversed human order each round; 100 new alien items added; intention prop added to inquiries
- **Linhas Cruzadas** — Bravest achievement added; achievement icons fixed
- **Arte Ruim** — Updated rules with images

#### Developer Experience

- `update-commit` script added
- `useCardWidth` refactored to use options object
- `getAnimationClass` updated to use options object

---

### July 2023

#### New Games

- **Fileira de Fatos** — Backend created, game UI created, achievements added, beta released then changed to pre-release v0.9
- **Labirinto Secreto** (renamed from Caminhos Mágicos) — Released (v40) with history of paths, improved GameOver, hints on opponent trees, mock map

#### Game Updates

- **Comunicação Alienigena** — New seeding phase; alternating human order; 100 new alien items; intention prop
- **Labirinto Secreto** — Pre-released; general improvements; mock map added
- **Detetives Imaginativos** — Rules images added
- **Ue Só Isso** — Rules images added

#### Backend/Functions

- Firebase analytics started
- `tdr-utils` created

#### Developer Experience

- `update-commit` script added
- `MouseFollowingContent` component created
- `AvatarGroup` component created
- Security: Bump `tough-cookie`, `semver`, `word-wrap`

---

### June 2023

#### New Games

- **Labirinto Secreto** — Backend preliminary development (renamed from caminhos-magicos)

#### Game Updates

- **Comunicação Alienigena** — Added achievements; completed players migration; alien bot added
- **Crimes Hediondos** — Added achievements; completed players migration
- **Ue Só Isso** — Fixed achievement calculation bug; fixed title when player has passed their turn
- **Galeria de Sonhos** — Selected dreams shown in waiting room; updated announcement during hard mode

#### UI/UX Improvements

- **Lobby** — Dropdown of previously used names; favorite avatars shown for logged-in users
- **Hub** — New game redirect feature (VIP/Host triggers redirect alert)
- Password Reset functionality added

---

### May 2023

#### Game Updates

- **Arte Ruim** — New version: randomizable round level order; default 5 levels; special level options; dynamic point threshold by player count
- **Ue Só Isso** — New edition: hard goal (7 points, up to 10 rounds), hard failure (game over at 3 mistakes); achievements added
- **Porta dos Desesperados** — Gallery in GameOver with visited doors; achievements; data save refactored
- **Cruza-Palavras** — Achievements added; player clue in waiting room; data save refactored
- **Testemunha Ocular** — Overlay announcements; data save refactored; NSFW option
- **Retrato Falado** — Updated to use overlay announcements; data save refactored
- **Galeria de Sonhos** — Implemented Hard Mode
- **Comunicação Alienigena** — Achievements started; completed players migration

#### Backend/Functions

- `saveGameToUsers` implemented in every `prepareGameOver`
- `storeCleanup` and `stateCleanup` added to `saveGame`
- Firebase data save with retry (up to 5 times)
- User endpoint created; `preferredLanguage` added to DB schema

---

### April 2023

#### Game Updates

- **Comunicação Alienigena** — Competitive mode released (v1.0.0); bot for solo play added; alien item grid sorted; history; all 230 items displayed; sign grid on GameOver; bot algorithm tweaked; NSFW filter option added; starting known attributes added
- **Ue Só Isso** — New edition with hard goal and hard failure
- **Onda Telepatica** — Increased player count to 20; improved text; phase announcement overlays
- **Megamix** — Max players bumped from 10 to 16
- **Cruza-Palavras** — Achievements added; player clue in waiting room
- **Testemunha Ocular** — Overlay announcements; NSFW option

#### Platform & Infrastructure

- **React Query migration** (PR \#102) — Replaced `react-firebase-hooks` with React Query; global error handling
- **Players migration** — All engines migrated; players now stored inside `state`; `stateCleanup` and `storeCleanup` added
- **Authentication** — `AuthProvider` created; `SignIn` and `Signup` components; guest user tracking; VIP renamed to Host
- **User page** — Created (`/me`); games, sections, achievements visible; achievements SVG sprite
- **Firebase** bumped to v11

#### UI/UX Improvements

- **Lobby** — Username/avatar auto-load; previously used names dropdown; favorite avatars for logged-in users
- **Hub** — New game redirect feature; auto-copy game URL to clipboard
- `RuleInstruction` component created
- `TimerClock` reusable component created
- Overlay announcements adopted across most games

---

### March 2023

#### New Games

- **Tá Na Cara** — Created and released (PR \#97); Game Over gallery with all character answers

#### Game Updates

- **Mente Coletiva** — Added timed answering Phase option; fixed custom question
- **Onda Telepatica** — Increased player count to 20; phase announcement overlays

#### Developer Experience

- **Husky pre-commit** — Script to automate game versioning
- `GAME_CHECKLIST` file created; updated `ONBOARD_GAME` guide

---

### February 2023

#### Game Updates

- **Comunicação Alienigena** — v2.0 with bot for competitive/solo play (PR \#96); 230 alien items; sorted signs boards; history; GameOver sign grid; colored items instead of glyphs
- **Onda Telepatica** — Increased player count to 20 (PR \#95); phase announcement overlays

#### Platform & Infrastructure

- `Sprites page` created (PR \#93)
- `Alien Item Classifier` page created
- Firebase functions downgraded temporarily after `FieldValue.delete` breakage

---

### January 2023

#### New Games

- **Quem Sou Eu** — Beta released then stable (PR \#92); character glyphs, gallery with all characters, rules images, scoring improvements
- **Vamos Ao Cinema** — Released (PR \#91); movie posters, player icons during reveal, 5 rounds, movie review cards, Achievements added

#### Game Updates

- **Megamix** — Party Mode prepared; improvements after beta; `who-voted-for-what` bar added
- **Testemunha Ocular** — Alternative suspect decks added
- **Galeria de Sonhos** — Original image decks option added
- **Mente Coletiva** — Improved custom question; ranking animation fixed

#### Platform & Infrastructure

- `GlyphCard` component created
- `MovieReviewCard` component created; `MovieCard` moved to `/cards`
- `ListOfPlayers` component created
- New icons: Applause, Earth, FilmReel, Popcorn, Tomato, Yes, No
- `forceLastRound` refactored into Round object
- AI-generated images added as game banners

---

## 2022

### December 2022

#### New Games

- **Megamix** — v0.1 released (PR \#88); complete party mode mini-game with multiple tracks including Arte Ruim, Onda Telepatica, Comunicação Alienigena, and more
- **Vamos Ao Cinema** — Entry renamed from `vamos-no-cinema` to `vamos-ao-cinema`

#### Game Updates

- **Megamix** — Improvements after beta with new minigames and variants; who voted for what bar; complete game created
- **Comunicação Alienigena** — Development primarily October–December 2022

#### Platform & Infrastructure

- **Ant Design v5** — Migrated to AntD v5 (PR \#87); CSS modularized in all games; custom themes per game
- **CSS modularization** — All games and components converted to `@use` / `@forward` SCSS modules
- Firebase-functions updated to v4
- Overlaid `PhaseAnnouncement` — Modified to work as overlay on blurred content
- `useSpeak` hook created (native browser speech)
- `DualTranslate` component improvements
- `NewScores` changed to use class instance
- Organized game constants (keys, codes, collections)

---

### November 2022

#### Bug Fixes

- Fixed `Cruza-Palavras` round duration for half-time trap

---

### October 2022

#### New Games

- **Porta dos Desesperados** — Released and stable (PR \#78)

#### Game Updates

- **Na Rua do Medo** — V3 revamp: less Phase Announcements, more intuitive actions; Achievements; improved GameOver
- **Crimes Hediondos** — Bot algorithm: intelligently selects marks by tags; bots generate random crimes; Tags organized into `GameTags` component; Achievements
- **Trevo da Sorte** — Rules and rules images; clover cloud; custom background; beta release; turns changed to per-clover; reinvented mechanics
- **Contadores de Historias** — Achievements added; MetricHighlights
- **Galeria de Sonhos** — Achievements; bot C; MetricHighlights added
- **Arte Ruim** — Achievements; MetricHighlights in text blobs; fixed Level 5 final grade
- **Ue Só Isso** — Achievements added
- **Sonhos e Pesadelos** — Achievements
- **Detetives Imaginativos** — Achievements; timing defense button
- **Mente Coletiva** — Achievements; 3.0 release; custom questions; timed answering phase option

#### Platform & Infrastructure

- `Achievements` component created to display player achievements during game over; animations
- `MetricHighlight` component created
- `TableOrder` — Circular turn order created
- `FixedMenuButton` — Created; used by PopoverRule, CanvasResizer, AdminMenu
- `DualTranslate` component created
- Function action types refactored across all games (PR \#77)
- Added `best` field to game-info; `json-schema` added to game-info files
- `audiencee-mode` (viewer mode) introduced
- Improved color scheme: hardcoded light/medium/dark values for each basic color
- A new font for cards; improved Lato font weight
- Moving gradient background color per game

#### UI/UX Improvements

- **Hub** — Filters added; duration placeholder; "Games in Development" section; auto-copy URL on game create
- `DualTranslate` component created
- `GameOver` — Auto-swap title for banner after 15 seconds for screenshots
- Custom primary colors per game introduced

#### Bug Fixes

- Fixed `quem-sou-eu` broken phase
- Fixed timer double-trigger issues

---

### September 2022

#### New Games

- **Trevo da Sorte** — Development started (PR \#73)

#### Game Updates

- **Arte Ruim** — Version 3.0: Level 5 introduced; Achievements icons updated
- **Mente Coletiva** — Release 3.0: Achievements introduced; fixed duplicated entry
- **Super Campeonato** — Smart betting options; bracket tracking; all player bets shown during Ranking; 10+ player mode
- **Vendaval de Palpite** — Improved clue evaluation; auto-resolution GameOver; Master renamed to Boss; Blur Button for images
- **Galeria de Sonhos** — Auto-next between last player phases; rules (v1.0); bots added
- **Detetives Imaginativos** — Player order shown when defending; time defense button

#### Platform & Infrastructure

- **`PlayersStatusBar`** — Floating sidebar showing who's ready
- Custom Ant Design themes per game — Enabled
- `TimedTimerBar` created
- `useCountdown` hook created
- `AdminNextPhaseButton` (renamed); timer feature added
- `Icon` refactoring — All icons made independent exports (PR \#67)
- Storybook removed (PR \#61)
- Security bumps: `terser`, `path-parse`, `follow-redirects`, etc.

---

### August 2022

#### New Games

- **Super Campeonato** — Released (PR \#70); full tournament bracket game with betting, animations, 5-round structure

#### Game Updates

- **Super Campeonato** — Released; smart betting; bracket tracking; all player bets shown during Ranking
- **Vendaval de Palpite** — Blur Button feature to images; contender hand button improved
- **Galeria de Sonhos** — Rules (v1.0) added; bots added; purple primary color

#### Platform & Infrastructure

- `PlayersStatusBar` — Created; floating sidebar showing who's ready
- Custom Ant Design themes per game enabled
- `TimedTimerBar` created; monospace font
- `useCountdown` hook created
- `AdminNextPhaseButton` (renamed from `AdminNextRoundButton`); timer feature added

#### UI/UX Improvements

- Custom primary colors per game introduced
- `AnimatedGearIcon` for Setup screen
- `FloatingHand` improved: custom icons and titles
- `RankingBoard` improved for smaller screens
- `GameInfoDrawer` Settings secondary drawer added
- Mute/unmute user settings added
- Speech added to PhaseRules and Join

---

### July 2022

#### Game Updates

- **Arte Ruim** — Version 3.0.0 — introduced Level 5; organized game into sorted cards by theme
- **Testemunha Ocular** — Shows suspect image in preview even when eliminated; history when there are answers
- **Detetives Imaginativos** — Time defense button added
- **Onda Telepatica** — Showed clue to the psychic

#### Platform & Infrastructure

- Game info split into individual game files
- Refactor icons to be independent exports to reduce bundle size (PR \#67)
- Storybook removed (PR \#61)
- `node-sass-chokidar` removed in favor of `sass`
- Security bumps: many packages
- Multiple speech options during PhaseLobby and PhaseRules; ability to mute game
- TDR type names updated; `type` keyword for every type import

---

### June 2022

#### New Games

- **Galeria de Sonhos** — Completed (PR \#51); v1.0 released; rules added

#### Game Updates

- **Vendaval de Palpite** — Improved clue evaluation; auto-resolution GameOver; "Master" renamed to "Boss"
- **Arte Ruim** — RoundAnnouncement timer fixed; GalleryWindow replaced with SlideShow; sound updated
- **Ue Só Isso** — `ControlledInputWriting` created; Witness Selection moved to Step component
- **Galeria de Sonhos** — Unskippable CardPlay phase announcement; ReadyPlayersBar during DreamSelection; ImageCard preview group for Tables

#### Platform & Infrastructure

- **React 18** — Upgraded (PR \#56); briefly reverted and re-applied
- `use-sound` dependency removed in favor of `react-use` audio
- `useEffectOnce` — Replaced all empty-dep `useEffect` calls
- `useIdleRedirect` hook — Redirects user to home after 15 minutes of inactivity
- `SlideShow` component created; `useSlideShow` hook; Gallery replaced by SlideShow across games
- `RulesList` component for bullet-point rules
- `DevEmulatorAlert` added
- `useMock` hook created for development

#### UI/UX Improvements

- **Lobby** — Clouds redesigned per game; notification of new avatars
- 5 new avatars added
- `RankingBoardStep` (renamed `StepRankingWrapper`) — Description of gained points in tooltips
- Animate.css added; PhaseAnnouncement and RoundAnnouncement animations

#### Bug Fixes

- Fixed `ControlledInputWriting` not erasing values
- Fixed crown not showing in `RankingBoard`

---

### May 2022

#### New Games

- **Vendaval de Palpite** — Created (PR \#52)

#### Game Updates

- **Galeria de Sonhos** — Completed phases; unskippable CardPlay announcement; ReadyPlayersBar during DreamSelection
- **Na Rua do Medo** — Costumes added to players
- **Onda Telepatica** — Clue exposed to psychic; ReadyPlayerBar during guessing; game options for fixed rounds
- **Detetives Imaginativos** — FloatingHand added; TurnOrder; English rules; improved Impostor own cards during Defense
- **Contadores de Histórias** — Fixed rounds option; album strips in GameOver; phone clouds

#### Platform & Infrastructure

- `Gallery` component created for timed slide-show content
- `PlayerStrip` component created
- 5 new avatars added
- `ImageCardSelectButton` created

---

### April 2022

#### Platform & Infrastructure

- `prop-types` removed (PR \#46)
- All game folders reorganized
- Responsive design applied to various games
- Mobile-friendly flag added to GameInfo

#### UI/UX Improvements

- **Hub** — Game card "Best with" and "Duration" fields
- **Lobby** — Input field on homepage; Go button added
- `TransparentButton` created
- `Gallery` component for timed content with controls
- `RibbonGroup` created

#### Bug Fixes

- Fixed `Na Rua do Medo` candy-remainder bug
- Fixed `Linhas Cruzadas` odd-player-count end bug

---

### March 2022

#### New Games

- **Crimes Hediondos** — Full alpha completed (PR \#40)

#### Game Updates

- **Sonhos e Pesadelos** — Revamped logic and UI (PR \#44); `RankingBoardStep` applied; `Gallery` component
- **Na Rua do Medo** — Complete game added (PR \#35); rules images
- **Arte Ruim** — Gallery fixed for 6+ players; gallery auto-slide controls removed first run; English Level 4 added
- **Mente Coletiva** — 3 pasture options; UI improvements; fixed sheep animation
- **Onda Telepatica** — Fixed round options; improved UI and rules
- **Contadores de Histórias** — Back/forth buttons through solution and ranking

#### Platform & Infrastructure

- `Showcase` route created (`/vitrine`)
- `Resources` route created
- `useStep` hook created for `StepSwitcher` functionality; integrated in all games
- Relative imports path added; all files updated
- `/components` reorganized — phases, steps, buttons, text, ribbons, players, layout
- Removed `/components/index` barrel files in favor of direct imports
- `Gallery` component created for timed slide-show content
- `RankingBoardStep` created (renamed `StepRankingWrapper`)

---

### February 2022

#### New Games

- **Na Rua do Medo** — Complete game added (PR \#35); Halloween trick-or-treat theme; responsive design; rules images
- **Linhas Cruzadas** — Created (PR \#37); ARPD drawing cards; 2-minute drawing time; album strips in GameOver

#### Game Updates

- **Galeria de Sonhos** — Pre-alpha; multiple phases and bots
- **Espiao Entre Nos** — Refactored and migrated to new functions convention and TypeScript
- **Onda Telepatica** — Fixed round options; improved UI and rules
- **Retrato Falado** — Orientation action added; past-sketch store size fixed
- **Contadores de Histórias** — Back/forth buttons through solution and ranking; improvements

#### Platform & Infrastructure

- **react-router-dom v6** — Upgraded
- **Firebase v9 API** — Updated
- Code split by game; lazy-loaded routes
- `useBooleanDictionary` hook created
- `DebugOnly` component created
- `AdminMenu` improved with new options

---

### January 2022

#### New Games

- **Galeria de Sonhos** — Pre-alpha started; phases and bots added (February–March)

#### Game Updates

- **Arte Ruim** — Gallery auto-slide controls removed first run; English Level 4 added; 50-point threshold fixed for short games
- **Mente Coletiva** — UI improvements; fixed AddAnswers bug

#### Platform & Infrastructure

- **react-router-dom v6** — Upgraded
- `AvatarIcon` created (Avatar-shaped icon display)
- `FloatingHand` improvements
- `TurnOrder` improvements
- New icons: Boss, ColorPalette, ColorWheel, Controls, Filter, Pencil, Robot, SealOfApproval, Selectlist, Target
- `AnimatedLoader` icon added; Spin component replaced
- Game cards updated with version ribbons
- Added multiple new icons; updated game banners

#### Bug Fixes

- Fixed `ArteRuim` 50-point threshold bug in short games
- Fixed `Mente Coletiva` AddAnswers bug
- Fixed `PhaseAnnouncement` default multitask icon
- Fixed `Card` random color assignment
- Fixed duplicate keys in Hub

---

## 2021

### December 2021

#### New Games

- **Cruza-Palavras** — Created (PR \#29); UI and functions built; crossword-style mechanics
- **Retrato Falado** — Added (PR \#29); composite sketch game; API functions created; TypeScript conversion

#### Game Updates

- **Arte Ruim** — Level 4 added (themed groups); cards re-leveled; level order instruction added; new PT and EN cards added
- **Onda Telepatica** — Revamped into competitive game without teams; functions refactored; temporarily disabled
- **Crimes Hediondos** — Functions skeleton added

#### Platform & Infrastructure

- **TypeScript migration** (PR \#30) — Full migration of the entire codebase to TypeScript:
  - All shared components, hooks, adapters, services, and utilities converted
  - All game files converted
  - `tsconfig` rules added; lodash added; PropTypes removed
- `validateSubmitActionProperties` — Created; applied to all games
- `fetchResource` — Helper function for external JSON files
- `getDefaultInitialState`, `getStateAndStoreReferences`, `updateState`, `updatePlayer`, `updateStore` — New utility functions to reduce boilerplate
- `buildGameOrder` helper function added
- `getNextPhase` renamed from `nextPhase` in all engines
- Firebase updated; firebase-functions bumped
- `PopoverRules` created
- `TimeBar` component created
- Ratings widget added to Game Over screen (October)

#### UI/UX Improvements

- `AdminMenu` — New admin panel with game-specific admin actions
- `CanvasResizer` moved to the right
- `DrawingCanvas` — Controls added; dots accepted; hide controls by default
- Split dev logging for Players and State
- Icons expanded significantly

#### Developer Experience

- `Testing` branch established with unit tests for helper and engine functions
- `jest` added to cloud functions; unit tests for `generateGameId`, `image-cards`, and `game-utils`
- Code split for games (lazy loading preparations)

---

### November 2021

#### Game Updates

- **Arte Ruim** — Level 4 added (themed groups); cards re-leveled
- **Onda Telepatica** — Revamped into competitive game without teams (November); functions refactored; temporarily disabled
- **Ue Só Isso** — Max player count bumped to 10; `validateSubmitActionProperties` applied
- Several games — `getWords` migrated to external resource

#### Platform & Infrastructure

- `validateSubmitActionProperties` — Created; applied to all games
- `fetchResource` — Helper function for external JSON files
- New utility functions: `getDefaultInitialState`, `getStateAndStoreReferences`, `updateState`, `updatePlayer`, `updateStore`
- `getNextPhase` renamed in all engines; functions reorganized

---

### October 2021

#### Game Updates

- **Instrumentos Codificados** — Marked as not available

#### Platform & Infrastructure

- Rating widget added to Game Over screen
- Rebuilt CSS

---

### September 2021

#### New Games

- **Sonhos e Pesadelos** — Created and completed (PR \#23); DreamBoards, VotingMatch hook, theme objects; winning condition
- **Contadores de Histórias** — Completed (PR \#22); full game UI; cloud functions
- **Instrumentos Codificados** — Placeholder and basic engine

#### Game Updates

- **Arte Ruim** — 50-point threshold; ranking bugs fixed; 15 new PT cards; English Level 4 cards; gallery spread to grid
- **Ue Só Isso** — Player names on suggestion cards; improved components

#### Platform & Infrastructure

- `ImageCard` component expanded; image card libraries expanded (dx-od, dx-rv, dc-b1, dc-b2, dx-mr, dx-hm, my-bs)
- `useCardWidth` hook created
- `useBlurCards` hook created
- Custom per-game cloud backgrounds added to Lobby

#### UI/UX Improvements

- `CollapsibleRule` component created
- `RoundsLeftInstruction` component created
- `SetupScreen` added to all games
- Phase icons added to all games
- `ImageCardBack` component created
- Rules images added for all games

#### Bug Fixes

- Fixed `pastDrawings` being overwritten
- Fixed `sonhos-pesadelos` winning condition
- Fixed `arte-ruim` round bug

---

### August 2021

#### New Games

- **Polemica da Vez** — Created (PR \#20); full game UI and functions

#### Game Updates

- **Arte Ruim** — Dual language; new folder structure; round format; save drawings to public folder; Level 4 cards; 50-point threshold
- **Ue Só Isso** — Renamed from Um Só; dual language; English rules; max players to 10
- **Testemunha Ocular** — New cards; actions and remaining setup; popconfirm before eliminating a suspect
- **Contadores de Histórias** — Full game UI; cloud functions; English rules added
- **Mente Coletiva** — Sheep dying animation; phase icons; background image; dynamic faces; AddAnswers bug fixes

#### Platform & Infrastructure

- Dual language / i18n system continued
- Player ID refactor applied across all games
- `TitleHighlight` component created
- `FloatingHand` component created
- `ImageCardHand` component created

#### Bug Fixes

- Fixed `mente-coletiva` fix key bug and questions
- Fixed `arte-ruim` cards level type

---

### July 2021

#### New Games

- **Detetives Imaginativos** (formerly Clube dos Detetives) — Renamed and full game created (PR \#7–\#14); dual language; phase icon illustrations; TurnOrder; TitleHighlight
- **Testemunha Ocular** — Created; QuestionSelection, WitnessSelection, Trial, GameOver phases; cloud functions

#### Game Updates

- **Arte Ruim** — Dual language; migrated to new folder structure; new round format
- **Espiao Entre Nos** — Added messages for voting; ResolutionPhase player roles; emergency icon on accusation
- **Onda Telepatica** — New cards; updated wording and instructions

#### Platform & Infrastructure

- **Dual language / i18n system** — Full internationalization with `useLanguage` hook, `<Translate>` component, `LanguageSwitch` toggle
- **Phase Announcement** component created
- **Player ID refactor** (PR \#8) — All games migrated from player names to player IDs
- `FloatingHand` component created
- `TurnOrder` component created
- `AvatarCard` component created
- Storybook added (PR \#14) — Onboarded Lobby, Drawers, Errors, Loaders, PhaseContainer components
- Unit tests added for helper functions in cloud functions

#### Bug Fixes

- Fixed spy win condition by bad voting
- Fixed `arte-ruim` round bug
- Fixed `clube-detetives` → `detetives-imaginativos` scoring
- Fixed timer for Round Announcement and Emergency Alert
- Fixed `Slider` not following Dial value

---

### June 2021

#### Game Updates

- **Arte Ruim** — Minor fixes and component refactors
- **Espiao Entre Nos** — Fixed starting player popup; improved modals/alerts; `FinalAssessment` logic
- **Onda Telepatica** — Confirmation modals; Dial clickable; clue writing rules in popover; updated component structure

#### Platform & Infrastructure

- `ViewIf` and `ViewOr` component created
- Various component refactors and conversions to named exports
- Ordered admin games by availability

---

### May 2021

#### New Games

- **Ue Só Isso** (then "Um Só") — Created (PR \#1); WordSelection, Suggest, Compare, Guess, GameOver phases; full cloud functions
- **Espiao Entre Nos** — Created (PR \#5); player roles; voting; location list; AccusationAlert; cloud functions
- **Onda Telepatica** — Created (PR \#4); Dial component; team-based guessing; full cloud functions

#### Game Updates

- **Arte Ruim** — Draw, Evaluation, Gallery, Ranking, GameOver phases completed; canvas drawing; voting system; cloud functions

#### Platform & Infrastructure

- `Session` component created (shared logic across all game sessions)
- `StepSwitcher` created to swap between phase steps
- `PhaseContainer` component created
- `RoundAnnouncement` component created
- `GameOver` shared component created
- `ReadyPlayersBar` component created
- `Avatars` object with id, color, and descriptions
- `ButtonContainer`, `Instruction`, `Title`, `AvatarName` components created
- `useAPICall` hook created
- Game session hooks: `useIsUserReady`, `useIsUser`, `useUser`
- Unit tests added to cloud functions

#### UI/UX Improvements

- **Lobby** — Animated clouds; cleaned up components; player names in ReadyPlayersBar
- **Canvas drawing** — Touch events added; `CanvasResizer` for user control; SVG-based
- `Ribbon` and `CanvasSVG` components created
- `StarPoints` component created
- `RankingBoard` component created with animation
- Rules images added for Arte Ruim, Onda Telepatica, Ue Só Isso

#### Bug Fixes

- Fixed `arte-ruim` past drawings bug
- Fixed Gallery progress bar for 6+ players
- Fixed `goToNextPhase` cloud function bug
- Fixed `arte-ruim` evaluation: cleared `currentVoting` between rounds
- Fixed blank screens when all players are ready

---

### April 2021

#### New Games

- **Arte Ruim** — Foundation started; Lobby, Draw, Evaluation, Gallery, Ranking, GameOver phases; `submitDrawing`, `submitVoting`, `goToNextPhase` cloud functions

#### Platform & Infrastructure

- **Initialize project using Create React App** (April 2021\)
- Firebase cloud functions started
- Firebase service updated to accept cloud functions and local emulator
- Authentication: Login page and basic auth/session states
- Private and Public routes; placeholder page components
- `localStorage` service created
- `useLoading` hook and global loading bar
- `useIsGameStale` hook to detect expired games
- `PageError` component created
- `WaitingRoom` component created; Admin lock game flow
- Admin hub page with game selection cards
- Games list with descriptive tags

---

*This changelog covers all meaningful commits from April 2021 through February 2026\. Routine dependency bumps, formatting-only commits, and merge commits have been omitted or consolidated.*
