# ONBOARD DAILY GAME

This guide provides comprehensive instructions for creating new Daily games following established patterns and conventions used across existing Daily games.

**Note**: Backend data generation is handled by the `td-admin` tool. This document focuses on frontend implementation requirements.

## Table of Contents

1. [Common Patterns](#common-patterns)
2. [Resource Dependencies Guide](#resource-dependencies-guide)
3. [Game Requirements Reference](#game-requirements-reference)
4. [Integration Checklist](#integration-checklist)

---

## Common Patterns

All Daily games follow consistent patterns for folder structure, state management, and integration.

### Standard Folder Structure

```
src/pages/Daily/games/{GameName}/
├── Daily{GameName}Game.tsx          # Entry point wrapper
├── components/
│   ├── Daily{GameName}.tsx          # Main game component
│   ├── Rules.tsx                    # Game rules display
│   └── ResultsModalContent.tsx      # Results modal content
└── utils/
    ├── types.ts                     # Type definitions
    ├── settings.ts                  # Game settings constants
    ├── helpers.ts                   # Helper functions
    ├── use{GameName}Engine.ts       # Game logic hook
    └── styles.scss                  # (Optional) Game styles
```

### Entry Point Pattern

**File**: `Daily{GameName}Game.tsx`

```typescript
// Pages
import { DailyGame } from 'pages/Daily/components/DailyGame';
// Internal
import { Daily{GameName} } from './components/Daily{GameName}';
// Sass
import './utils/styles.scss'; // Optional

export function Daily{GameName}Game() {
  return (
    <DailyGame
      gameName="{game-route-name}"
      GameComponent={Daily{GameName}}
    />
  );
}
```

### Type Definitions Pattern

**File**: `utils/types.ts`

```typescript
// Pages
import type { DateKey } from 'pages/Daily/utils/types';

export type Daily{GameName}Entry = {
  id: DateKey;
  number: number;
  type: '{game-type-name}';
  // Game-specific fields...
};

export type GameState = {
  id: DateKey;
  number: number;
  hearts: number;
  status: string;
  // Game-specific state...
};

export type SessionState = {
  // Temporary UI state (not persisted)
};
```

### Settings Pattern

**File**: `utils/settings.ts`

```typescript
// Icons
import { Daily{Type}GameIcon } from 'icons/Daily{Type}GameIcon';
// Pages
import type { GameSettings } from 'pages/Daily/utils/types';

export const SETTINGS: GameSettings = {
  KEY: '{GAME_KEY}',                    // All caps, used for localStorage
  ROUTE: '{game-route}',                 // URL route name
  TYPE: 'game',
  RELEASE_DATE: 'YYYY-MM-DD',
  COLOR: 'rgba(R, G, B, 0.85)',
  EMOJI: '🎮',
  HUB_ICON: Daily{Type}GameIcon,
  NAME: { pt: 'Nome', en: 'Name' },
  TAGLINE: {
    pt: 'Descrição em português',
    en: 'Description in English',
  },
  // Custom settings
  HEARTS: 4,                              // Number of hearts/lives
};
```

### Helpers Pattern

**File**: `utils/helpers.ts`

**Note**: Game-specific helpers remain in each game's folder and are NOT exported to a central aggregator. Import them directly when needed.

```typescript
import { cloneDeep } from 'lodash';
// Pages
import { generateShareableResult, loadLocalToday } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import type { BasicResultsOptions } from 'pages/Daily/utils/types';
// Internal
import { SETTINGS } from './settings';
import type { Daily{GameName}Entry, GameState } from './types';

const DEFAULT_LOCAL_TODAY: GameState = {
  id: '',
  number: 0,
  status: STATUSES.IN_PROGRESS,
  hearts: SETTINGS.HEARTS,
  // Game-specific defaults...
};

export const getInitialState = (data: Daily{GameName}Entry): GameState => {
  const localToday = loadLocalToday({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: cloneDeep(DEFAULT_LOCAL_TODAY),
  });

  const state: GameState = {
    id: data.id,
    number: data.number,
    status: localToday.status,
    hearts: localToday.hearts,
    // Merge with local storage and data...
  };

  return state;
};

export const getResultsText = (state: GameState, options: BasicResultsOptions): string => {
  return generateShareableResult({
    ...options,
    // Custom result generation...
  });
};
```

### Engine Hook Pattern

**File**: `utils/use{GameName}Engine.ts`

```typescript
import { useEffect } from 'react';
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { logAnalyticsEvent } from 'services/firebase';
// Pages
import { useDailyGameState, useDailySessionState } from 'pages/Daily/hooks/useDailyGameState';
import { useDailyLocalToday } from 'pages/Daily/hooks/useDailyLocalToday';
import { getAnalyticsEventName } from 'pages/Daily/utils';
import { STATUSES } from 'pages/Daily/utils/constants';
import { playSFX } from 'pages/Daily/utils/soundEffects';
// Internal
import { SETTINGS } from './settings';
import type { Daily{GameName}Entry, GameState, SessionState } from './types';

export function use{GameName}Engine(data: Daily{GameName}Entry, initialState: GameState) {
  const { message } = App.useApp();
  const { translate } = useLanguage();
  const { state, setState, updateState } = useDailyGameState<GameState>(initialState);
  const { session, setSession, updateSession } = useDailySessionState<SessionState>({
    // Initial session state...
  });

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: SETTINGS.KEY,
    gameId: data.id,
    defaultValue: initialState,
  });

  // Auto-save on state changes
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  // Game actions
  const onSomeAction = () => {
    if (state.status !== STATUSES.IN_PROGRESS) {
      return;
    }

    // Action logic...
    playSFX('action');
    updateState({ /* ... */ });
  };

  // Win/lose detection
  useEffect(() => {
    if (state.status === STATUSES.WIN) {
      logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'win'));
      playSFX('win');
    } else if (state.status === STATUSES.LOSE) {
      logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'lose'));
      playSFX('lose');
    }
  }, [state.status]);

  return {
    state,
    session,
    actions: {
      onSomeAction,
      // ... other actions
    },
  };
}
```

### Main Component Pattern

**File**: `components/Daily{GameName}.tsx`

```typescript
import { App } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language/Translate';
// Pages
import { DailyContent } from 'pages/Daily/components/DailyContent';
import { Header } from 'pages/Daily/components/Header';
import { Menu } from 'pages/Daily/components/Menu';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { ShowResultsButton } from 'pages/Daily/components/ShowResultsButton';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { Daily{GameName}Entry } from '../utils/types';
import { use{GameName}Engine } from '../utils/use{GameName}Engine';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type Daily{GameName}Props = {
  data: Daily{GameName}Entry;
  currentUser: Me;
};

export function Daily{GameName}({ data }: Daily{GameName}Props) {
  const { modal } = App.useApp();
  const { translate } = useLanguage();

  const initialState = getInitialState(data);
  const { state, session, actions } = use{GameName}Engine(data, initialState);

  return (
    <DailyContent difficulty={/* difficulty logic */}>
      <Header
        title={<Translate pt={SETTINGS.NAME.pt} en={SETTINGS.NAME.en} />}
        hearts={state.hearts}
        icon={SETTINGS.HUB_ICON}
        backgroundColor={SETTINGS.COLOR}
      >
        <Menu>
          <Rules />
          <ShowResultsButton state={state}>
            <ResultsModalContent result={state} number={data.number} />
          </ShowResultsButton>
        </Menu>
      </Header>

      {/* Game UI */}

      <NextGameSuggestion />
    </DailyContent>
  );
}
```

---

## Resource Dependencies Guide

Daily games use different types of external resources. Choose based on your game's needs.

### TDR Items

**Use when**: Game needs item cards (objects, characters, concepts)

**Components**:
```typescript
import { DailyItem } from 'pages/Daily/components/DailyItem';

// Usage
<DailyItem id={itemId} />
<DailyItem id={itemId} width={100} />
```

**Data Access**:
```typescript
// Items dictionary is available from useDailyChallenge context
const { items } = useDailyChallenge();
const item = items[itemId]; // { id, name: { en, pt } }
```

**Games using Items**: Alienado, AquiO, Conjuntos, Estoquista, Filmaco, Organiku, Quartetos

### TDR Sprites

**Use when**: Game needs sprite/sign cards (visual symbols)

**Components**:
```typescript
import { SignCard } from 'components/cards/SignCard';

// Usage
<SignCard id={spriteId} width={100} />
```

**Games using Sprites**: Alienado, Quartetos

### Image Cards

**Use when**: Game needs photograph-style image cards

**Components**:
```typescript
import { ImageCard } from 'components/image-cards/ImageCard';
import { useTDImageCardUrl } from 'hooks/useTDImageCardUrl';

// For suspect images
import { getSuspectImageId } from 'pages/Daily/utils';

// Usage
<ImageCard id={imageId} />
<ImageCard imageId={imageId} />

// For single card URL
const imageUrl = useTDImageCardUrl(cardId);
```

**Games using Image Cards**: Investigacao, Portais, Vitral

### Drawings

**Use when**: Game needs user-generated drawing images

**Data Structure**:
```typescript
{
  drawings: string[]; // Array of image URLs/paths
}
```

**Games using Drawings**: ArteRuim

### No External Resources

**Use when**: Game is self-contained (word puzzles, logic games)

**Games**: Palavreado

---

## Game Requirements Reference

### Alienado (Alien Communication)

**Type**: `'comunicacao-alienigena' | 'alienado'`

**Data Entry Structure**:
```typescript
type DailyAlienadoEntry = {
  id: DateKey;
  setId: string;
  number: number;
  type: 'comunicacao-alienigena' | 'alienado';
  attributes: Array<{
    id: string;
    name: string;
    description: string;
    spriteId: string;        // Alien symbol sprite
    itemsIds: string[];      // Items matching this attribute
  }>;
  requests: Array<{
    spritesIds: string[];    // 3 sprite clues
    itemId: string;          // Target item to find
  }>;
  solution: string;          // Item IDs joined by '-'
  itemsIds: string[];        // All available items
  valid: boolean;
};
```

**Resource Dependencies**:
- TDR Sprites (alien symbols via `SignCard`)
- TDR Items (via `DailyItem` component)
- Items dictionary from `useDailyChallenge`

**Settings**:
- Hearts: 4
- Route: `alienado`
- Key: `ALIENADO`

**Special Considerations**:
- Solution format: item IDs concatenated with hyphens

---

### AquiO (Find This)

**Type**: `'aqui-o'`

**Data Entry Structure**:
```typescript
type DailyAquiOEntry = {
  id: DateKey;
  number: number;
  type: 'aqui-o';
  setId: string;
  title: DualLanguageValue;
  itemsIds: string[];        // Items to arrange in discs
};

// Generated dynamically
type AquiODisc = {
  id: string;
  target: string;            // Item to find
  items: string[];           // All items in this disc
  angle: number;             // Rotation angle
};
```

**Resource Dependencies**:
- TDR Items (via `DailyItem` component)
- Item dictionary from `useDailyChallenge`
- Optional: Web Speech API for voice callouts

**Settings**:
- Hearts: 3
- Goal: 15 discs to match
- Duration: 60 seconds per attempt
- Route: `aqui-o`
- Key: `AQUI_O`

**Additional Storage**:
- `TD_AQUI_DAILY_O_MODE`: `'normal' | 'challenge'`
- `TD_AQUI_DAILY_O_VOICE`: `'on' | 'off'`

**Special Considerations**:
- Time-based gameplay (60-second countdown)
- Cards positioned on concentric circles with rotation
- Voice mode for accessibility

---

### ArteRuim (Is It Art?)

**Type**: `'arte-ruim'`

**Data Entry Structure**:
```typescript
type DailyArteRuimEntry = {
  id: DateKey;
  number: number;
  type: 'arte-ruim';
  text: string;              // Expression/title to guess
  drawings: string[];        // Drawing image URLs
  cardId: string;            // Reference to source card
  dataIds: string[];         // Alternative data sources
  language: Language;
};
```

**Resource Dependencies**:
- Drawing images (carousel display)
- Card metadata via `cardId`
- Custom keyboard component for letter input

**Settings**:
- Hearts: 3
- Route: `arte-ruim`
- Key: `ARTE_RUIM`

**Special Considerations**:
- Hangman-style letter guessing
- Letters extracted and accents removed from solution
- Multiple drawings shown in carousel
- Custom keyboard for letter selection

---

### Conjuntos (Set Theory)

**Type**: `'teoria-de-conjuntos' | 'conjuntos'`

**Data Entry Structure**:
```typescript
type DailyConjuntosEntry = {
  id: DateKey;
  number: number;
  type: 'teoria-de-conjuntos' | 'conjuntos';
  title: string;
  level: number;
  rule1: {
    id: string;
    text: string;
    level: number;
    thing: { id: string; name: string };
  };
  rule2: {
    id: string;
    text: string;
    level: number;
    thing: { id: string; name: string };
  };
  intersectingThing: { id: string; name: string };
  things: Array<{ id: string; name: string }>;
};
```

**Resource Dependencies**:
- TDR Items (via `DailyItem` component)
- Custom diagram visualization (SVG)

**Settings**:
- Hearts: 4 (5 on weekends)
- Route: `conjuntos`
- Key: `CONJUNTOS`

**Special Considerations**:
- Weekend mode: +1 heart, 5 items instead of 4 in hand
- Venn diagram visualization
- Three sections: Rule1 only, Rule2 only, Intersection

---

### Estoquista (Warehouse Manager)

**Type**: `'controle-de-estoque' | 'estoquista'`

**Data Entry Structure**:
```typescript
type DailyEstoquistaEntry = {
  id: DateKey;
  number: number;
  type: 'controle-de-estoque' | 'estoquista';
  title: DualLanguageValue;
  language: 'en' | 'pt';
  goods: string[];           // Good IDs to stock
  orders: string[];          // Order IDs to fulfill
};
```

**Resource Dependencies**:
- `WarehouseGoodCard` component for goods
- `PreloadItems` component for performance

**Settings**:
- Hearts: 4
- Route: `estoquista`
- Key: `ESTOQUISTA`

**Special Considerations**:
- Three phases: STOCKING → FULFILLING → DELIVERING
- Warehouse size determined by goods count

---

### Filmaco (Movie Clues)

**Type**: `'filmaco'`

**Data Entry Structure**:
```typescript
type DailyFilmacoEntry = {
  id: DateKey;
  number: number;
  type: 'filmaco';
  itemsIds: string[];        // Clue items/images
  setId: string;
  title: string;             // Movie title (solution)
  year: number;              // Release year
  isDoubleFeature?: boolean; // Optional
};
```

**Resource Dependencies**:
- TDR Items (clue sprites via `DailyItem`)

**Settings**:
- Hearts: 3
- Route: `filmaco`
- Key: `FILMACO`

**Special Considerations**:
- Hangman-style letter guessing
- Multiple clue images
- Solution includes alphanumeric characters
- Diacritics removed from title

---

### Investigacao (Investigation)

**Type**: `'espionagem' | 'investigacao'`

**Data Entry Structure**:
```typescript
type DailyInvestigacaoEntry = {
  id: DateKey;
  number: number;
  type: 'espionagem' | 'investigacao';
  setId: string;
  suspects: Array<{
    id: string;
    name: string;
    gender: string;
    features: string[];
  }>;
  statements: Array<{
    key: string;
    text: DualLanguageValue;
    excludes: string[];
    type: 'testimony' | 'feature' | 'grid';
  }>;
  additionalStatements: Array<{...}>; // Same structure
  culpritId: string;
  reason: DualLanguageValue;
  isNsfw: boolean;
  level: number;
};
```

**Resource Dependencies**:
- Image Cards (suspect portraits via `getSuspectImageId()` and `ImageCard`)

**Settings**:
- Hearts: 2
- Route: `investigacao`
- Key: `INVESTIGACAO`

**Special Considerations**:
- Progressive clue revelation
- Suspect elimination mechanics

---

### Organiku (Memory Grid)

**Type**: `'organiku'`

**Data Entry Structure**:
```typescript
type DailyOrganikuEntry = {
  id: DateKey;
  number: number;
  type: 'organiku';
  title: DualLanguageValue;
  itemsIds: string[];                // Unique items to match
  grid: string[];                    // Flat array of item positions
  defaultRevealedIndexes: number[];  // Pre-revealed tiles
};
```

**Resource Dependencies**:
- TDR Items (via `DailyItem` component)

**Settings**:
- Hearts: 5
- Route: `organiku`
- Key: `ORGANIKU`

**Special Considerations**:
- Grid size: `sqrt(grid.length)`
- Memory matching game
- Default revealed tiles for difficulty adjustment
- Tracks flips and found pairs

---

### Palavreado (Word Scramble)

**Type**: `'palavreado'`

**Data Entry Structure**:
```typescript
type DailyPalavreadoEntry = {
  id: DateKey;
  number: number;
  type: 'palavreado';
  keyword: string;           // Target word (4-5 letters)
  letters: string[];         // Shuffled letters
  words: string[];           // All valid words to find
  language: Language;
};
```

**Resource Dependencies**:
- None (self-contained word puzzle)
- Uses `stringRemoveAccents()` utility

**Settings**:
- Hearts: `max(4, keyword.length)`
- Route: `palavreado`
- Key: `PALAVREADO`

**Special Considerations**:
- No external resource dependencies
- Letter grid manipulation
- Smart shuffle feature
- Tracks swaps and guesses

---

### Portais (Portals)

**Type**: `'portais-magicos' | 'portais'`

**Data Entry Structure**:
```typescript
type DailyPortaisEntry = {
  id: DateKey;
  setId: string;
  number: number;
  type: 'portais-magicos' | 'portais';
  goal: number;              // Total moves target
  corridors: Array<{
    passcode: string;        // Solution passcode
    imagesIds: string[];     // Image clues
    words: string[];         // Shuffled words for passcode
    goal: number;            // Moves for this corridor
  }>;
};
```

**Resource Dependencies**:
- Image Cards (via `ImageCard` component)
- `DoorFrame` component for animations

**Settings**:
- Hearts: 4
- Route: `portais`
- Key: `PORTAIS`

**Special Considerations**:
- Three corridors with word assembly
- Passcode construction from shuffled words

---

### Quartetos (Quartets)

**Type**: `'quartetos'`

**Data Entry Structure**:
```typescript
type DailyQuartetosEntry = {
  id: DateKey;
  setId: string;
  number: number;
  type: 'quartetos';
  grid: string[];            // 4x4 grid of item IDs
  difficulty: number;
  sets: Array<{
    id: string;
    title: string;
    itemsIds: string[];      // 4 items in this set
    level: number;           // Difficulty level
  }>;
};
```

**Resource Dependencies**:
- TDR Items/Sprites (via item dictionary from `useDailyChallenge`)
- `DailyItem` component for rendering

**Settings**:
- Hearts: 4
- Route: `quartetos`
- Key: `QUARTETOS`

**Special Considerations**:
- 4x4 grid (16 items total)
- Find 4 sets of 4 related items
- Difficulty-based color coding
- Selection validation with screen shake feedback

---

### Vitral (Stained Glass)

**Type**: `'vitrais' | 'vitral'`

**Data Entry Structure**:
```typescript
type DailyVitralEntry = {
  id: DateKey;
  number: number;
  type: 'vitrais' | 'vitral';
  title: DualLanguageValue;
  cardId: string;            // Image card for puzzle
  pieces: number[];          // Shuffled piece indices
};
```

**Resource Dependencies**:
- Single Image Card (via `useTDImageCardUrl` hook)
- DND Kit for drag-and-drop
- ResizeObserver for responsive grid
- react-timer-hook for timing

**Settings**:
- Hearts: 5
- Heart loss: 1 heart every 20 seconds of active play
- Route: `vitral`
- Key: `VITRAL`

**Special Considerations**:
- Jigsaw puzzle mechanics
- Time-based heart depletion
- Scoring based on time and swaps
- Piece count determines grid dimensions (aspect ratio 2:3)
- Connection validation for adjacent pieces

---

## Integration Checklist

Follow these steps to add a new Daily game to the platform.

### 1. Create Game Folder Structure

```bash
mkdir -p src/pages/Daily/games/{GameName}/{components,utils}
cd src/pages/Daily/games/{GameName}
touch Daily{GameName}Game.tsx
touch components/Daily{GameName}.tsx
touch components/Rules.tsx
touch components/ResultsModalContent.tsx
touch utils/types.ts
touch utils/settings.ts
touch utils/helpers.ts
touch utils/use{GameName}Engine.ts
```

### 2. Implement Core Files

- [ ] Define types in `utils/types.ts` (Daily{GameName}Entry, GameState, SessionState)
- [ ] Configure settings in `utils/settings.ts` (KEY, HEARTS, ROUTE, etc.)
- [ ] Implement `getInitialState()` in `utils/helpers.ts`
- [ ] Create game engine hook in `utils/use{GameName}Engine.ts`
- [ ] Build main game component in `components/Daily{GameName}.tsx`
- [ ] Create entry wrapper in `Daily{GameName}Game.tsx`

### 3. Update Daily Router

**File**: `src/pages/Daily/Daily.tsx`

```typescript
// Add import
import { Daily{GameName}Game } from './games/{GameName}/Daily{GameName}Game';

// Add route in Outlet object
const Outlet = {
  // ... existing routes
  '{game-route}': Daily{GameName}Game,
}?.[subPath] ?? Hub;
```

### 4. Update Type System

**File**: `src/pages/Daily/utils/types.ts`

```typescript
// Import type
import type { Daily{GameName}Entry } from '../games/{GameName}/utils/types';

// Add to DailyResponse type
export type DailyResponse = {
  id: string;
  // ... existing games
  '{game-route}': Daily{GameName}Entry;
  // ...
};
```

### 5. Update Settings Aggregator

**File**: `src/pages/Daily/utils/settings.ts`

```typescript
// Import settings
import { SETTINGS as {GAME_KEY} } from '../games/{GameName}/utils/settings';

// Add to ALL_SETTINGS object
export const ALL_SETTINGS = {
  // ... existing games
  {GAME_KEY},
};
```

This makes your game's settings accessible throughout the Daily framework via `getSettings('{game-route}')`.

### 6. Implement Components

- [ ] Rules component with game instructions
- [ ] ResultsModalContent with shareable results
- [ ] Any game-specific UI components

### 7. Add Resource Dependencies

Choose based on game needs:

- [ ] **For Items**: Use `DailyItem` component, access `items` from `useDailyChallenge`
- [ ] **For Sprites**: Use `SignCard` component
- [ ] **For Images**: Use `ImageCard` component, `getSuspectImageId()` if needed
- [ ] **For Drawings**: Display image URLs directly

### 8. Implement Game Logic

- [ ] State management with `useDailyGameState` and `useDailySessionState`
- [ ] Local storage persistence with `useDailyLocalToday`
- [ ] Win/lose detection and status updates
- [ ] Heart/lives management
- [ ] Action handlers and game mechanics

### 9. Add Analytics

- [ ] Fire win event: `logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'win'))`
- [ ] Fire lose event: `logAnalyticsEvent(getAnalyticsEventName(SETTINGS.KEY, 'lose'))`
- [ ] Add custom events for significant game actions

### 10. Implement Sound & Feedback

- [ ] Use `playSFX('action')` for game actions
- [ ] Use `playSFX('win')` for victory
- [ ] Use `playSFX('lose')` for defeat
- [ ] Use `playSFX('correct')` / `playSFX('error')` for feedback
- [ ] Use `vibrate()` for haptic feedback

### 11. Test Integration

- [ ] Game loads from Daily hub
- [ ] Data structure matches backend format
- [ ] State persists in localStorage
- [ ] Win/lose conditions work correctly
- [ ] Results modal displays correctly
- [ ] Share functionality works
- [ ] Hearts/lives system functions
- [ ] Analytics events fire properly
- [ ] Sound effects play appropriately

### 12. Backend Setup (via td-admin)

Backend data generation is handled by the `td-admin` tool. Ensure:

- [ ] Daily data document contains game entry for each date
- [ ] Document field name matches `type` field in entry
- [ ] Data structure matches `Daily{GameName}Entry` type
- [ ] All required resource IDs exist (items, sprites, images)

### 13. Final Checks

- [ ] Game appears in Daily hub
- [ ] Route works correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessibility features work
- [ ] Results are shareable
- [ ] Local storage cleanup works

---

## Best Practices

### State Management

- Use `useDailyGameState` for persistent game state
- Use `useDailySessionState` for temporary UI state (selections, animations)
- Auto-save state changes with `useEffect` watching state
- Use `STATUSES` constants for status tracking

### Performance

- Preload resources when possible (see Estoquista's `PreloadItems`)
- Use `useMemo` for expensive calculations
- Use `useCallback` for action handlers passed as props
- Optimize re-renders with proper dependency arrays

### User Experience

- Provide clear feedback for all actions (SFX, vibration, messages)
- Show loading states for async operations
- Display helpful error messages
- Implement responsive design for all screen sizes
- Add keyboard shortcuts where appropriate

### Code Quality

- Follow TypeScript strict mode
- Add JSDoc comments for complex functions
- Use proper prop types with comments
- Extract reusable logic to helpers
- Keep components focused and single-purpose
- Use consistent naming conventions

---

## Resources

### Daily Framework Files

- **Daily Framework**: `src/pages/Daily/`
- **Common Components**: `src/pages/Daily/components/`
- **Common Hooks**: `src/pages/Daily/hooks/`
- **Common Utils**: `src/pages/Daily/utils/`
- **Type Definitions**: `src/pages/Daily/utils/types.ts`
- **Settings Aggregator**: `src/pages/Daily/utils/settings.ts`
- **Constants**: `src/pages/Daily/utils/constants.ts`

### Available Utility Functions

**Note**: Unlike settings, helpers are NOT aggregated. Game-specific helpers stay in each game's `utils/helpers.ts` and are not exported centrally.

#### From `src/utils/helpers.ts` (Global Utilities)

- **String manipulation**: `stringRemoveAccents()` - Remove accents from strings
- **Date utilities**: `getToday()` - Get current date in YYYY-MM-DD format
- **Array utilities**: `shuffle()`, `removeDuplicates()`, `makeArray()`, `getRandomItem()`
- **Text formatting**: `pluralize()` - Handle singular/plural forms
- **Animation**: `getAnimationClass()` - Get animate.css classes
- **Time formatting**: `formatTime()` - Format seconds as mm:ss
- **Color utilities**: `getContrastColor()` - Determine white/black for contrast

#### From `src/pages/Daily/utils/index.ts` (Daily Framework Utilities)

- **Date helpers**: `checkWeekend()`, `getDayOfYear()`, `hasBeenReleased()`, `daysSinceRelease()`
- **Local storage**: `loadLocalToday()`, `composeLocalTodayKey()`, `checkWasPlayedToday()`
- **Analytics**: `getAnalyticsEventName()` - Compose event names
- **Formatting**: `getDailyName()`, `getSourceName()` - Get localized names
- **Results**: `generateShareableResult()` - Generate shareable result text
- **Other**: `wait()` - Async delay helper

#### From `lodash` (Commonly Used)

- `cloneDeep()` - Deep copy objects
- `merge()` - Deep merge objects
- `shuffle()` - Randomize array order
- `sampleSize()` - Get random sample from array
- `orderBy()` - Sort arrays by multiple criteria
- `chain()` - Chain multiple operations

## Reference Games

For implementation examples, refer to:

- **Simple game**: Palavreado (no external resources)
- **Item-based**: Quartetos (grid matching with items)
- **Image-based**: Vitral (puzzle with single image)
- **Complex logic**: Conjuntos (set theory with rules)
- **Time-based**: AquiO (timed matching game)
- **Multi-phase**: Estoquista (stocking, fulfilling, delivering)

---

**Last Updated**: 2026-05-09
