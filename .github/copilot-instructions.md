# GitHub Copilot Instructions - Tarde Divertida

**Project Structure:**
- `src/` - React TypeScript application (game client)
- `functions/` - Firebase Cloud Functions (game engine)

---

## 🚨 Critical Import Rules

### Icons (Bundle Size)
**NEVER import from `@pages/Dev/utils/iconsCollection** except in `src/pages/Dev/**` and `src/icons/iconsCollectionByGame.tsx`

```typescript
// ❌ BAD - Creates 1.8MB bundle
import { MyIcon } from '`@pages/Dev/utils/iconsCollection';

// ✅ GOOD - Tree-shakeable
import { MyIcon } from '@icons/MyIcon';
```

### Components (No Barrel Exports)
**NEVER use barrel exports (index.ts)** in `src/components/`

```typescript
// ❌ BAD
import { Button } from '@components/buttons';

// ✅ GOOD
import { Button } from '@components/buttons/Button';
```

### Lodash (Tree-Shaking)
**NEVER use default import** for lodash

```typescript
// ❌ BAD - Bundles entire library
import _ from 'lodash';
_.orderBy(...);

// ✅ GOOD - Tree-shakeable
import { orderBy, sortBy } from 'lodash';
```

---

## 📦 TypeScript & Type System

### Type Preferences
```typescript
// ✅ Use 'type' instead of 'interface'
export type PlayerProps = { ... };

// ✅ Use Dictionary<T> for UID-keyed objects
type Players = Dictionary<GamePlayer>;  // NOT Record<string, GamePlayer>

// ✅ Use 'as const' for constants
export const PHASES = {
  SETUP: 'SETUP',
  DRAW: 'DRAW'
} as const;

// ✅ Export types explicitly
export type { GameState, GamePlayer };

// ❌ Avoid 'any' - infer types where possible
```

### Type Organization
- **Global types**: `src/types/` (common.d.ts, game.ts, tdr.ts, user.ts)
- **Game types**: `src/games/{game-name}/utils/types.ts`
- **Component props**: `{ComponentName}Props` in same file as component

### JSDoc on Types
**Always document type properties**, even if self-explanatory

```typescript
export type PlayerAvatarProps = {
  /**
   * The id of the player avatar
   */
  avatarId: string;
  /**
   * Optional custom className
   */
  className?: string;
};
```

---

## 📁 File Organization

### Import Order (Automated)
Import order is **automatically sorted by a script** (`yarn sort-imports`) - don't worry about manual ordering during development. The script organizes imports with comment separators in this order (no blank lines between groups):

```typescript
// React imports (if needed)
import { useState, useMemo } from 'react';
// Types (always use 'import type')
import type { PhaseProps } from 'types/game';
import type { GamePlayers } from 'types/game';
// Hooks
import { useStep } from '@hooks/useStep';
import { useLanguage } from '@hooks/useLanguage';
// Icons
import { HieroglyphIcon } from '@icons/HieroglyphIcon';
// Ant Design Resources
import { Button, Space } from 'antd';
// Components
import { Translate } from '@components/language/Translate';
import { PhaseContainer } from '@components/phases/PhaseContainer';
// Utils (optional)
import { SEPARATOR } from '@utils/constants';
// Images (optional)
import avatars from '@assets/images/avatars.svg?url';
// Services (optional)
// Sass (if using CSS modules)
import styles from './Component.module.scss';
// Internal (game-specific imports - ALWAYS LAST)
import { GAME_PHASES } from './utils/constants';
import type { PhaseState } from './utils/types';
```

**Just use the comment separators** (`// Types`, `// Hooks`, etc.) and the script will handle the rest.

### Game Folder Structure
```
src/games/{game-name}/
├── Session{GameName}.tsx          # Main (default export)
├── Phase{PhaseName}.tsx           # Phase components
├── Step{StepName}.tsx             # Step components
├── components/                    # Game-specific components
│   └── ComponentName.tsx
├── game-info.json                 # Game metadata
└── utils/
    ├── achievements.ts            # Achievement definitions
    ├── api-requests.ts            # API request hooks
    ├── constants.ts               # PHASES, ACTIONS, config
    ├── types.ts                   # Game-specific types
    ├── helpers.ts                 # Utility functions (optional)
    ├── styles.scss                # Game styles (optional)
    └── {GameName}Context.tsx      # Context (if needed)
```

### Naming Conventions
- **Files**: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- **Types/Constants files**: `types.ts`, `constants.ts` (lowercase)
- **Phase Components**: `Phase{PhaseName}` (e.g., `PhaseAlienAnswer`)
- **Step Components**: `Step{StepName}` (e.g., `StepAlienAnswers`)
- **Session Components**: `Session{GameName}` (default export)
- **Props**: `{ComponentName}Props`
- **Constants**: `UPPER_SNAKE_CASE`

---

## ⚛️ Component Patterns

### Component Structure
```typescript
import { ... }; // See import order above

type ComponentNameProps = {
  /**
   * Description of prop
   */
  propName: string;
  /**
   * Optional description
   */
  className?: string;
};

/**
 * Component description (for complex components)
 */
export function ComponentName({ propName, className }: ComponentNameProps) {
  // 1. Hooks at the top
  const [state, setState] = useState();
  const value = useMemo(() => { ... }, [deps]);

  // 2. Handlers
  const handleClick = useCallback(() => { ... }, [deps]);

  // 3. Complex logic extracted to helpers
  const computed = computeValue(state);

  // 4. Render
  return (
    <div className={clsx(styles.container, className)}>
      {/* ... */}
    </div>
  );
}
```

### Export Style
```typescript
// ✅ Named exports (preferred)
export function MyComponent() { ... }

// ✅ Default export (ONLY for Session components)
function SessionGameName() { ... }
export default SessionGameName;

// ❌ Avoid default exports elsewhere
```

### forwardRef (When Needed)
```typescript
export const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ children, announcement }, ref) => {
    return <div ref={ref}>{children}</div>;
  }
);
```

### Phase Component Pattern
```typescript
export function PhaseXyz({ players, state, user }: PhaseProps<PhaseXyzState>) {
  const { step } = useStep();

  const announcement = (
    <PhaseAnnouncement
      icon={<IconName />}
      title={<Translate pt="Título" en="Title" />}
      currentRound={state?.round?.current}
      type="overlay"
    />
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={GAME_PHASES.XYZ}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepComponentA announcement={announcement} />
        {/* Step 1 */}
        <StepComponentB />
      </StepSwitcher>
    </PhaseContainer>
  );
}
```

---

## 🏪 State Management

### Persistent State (Survives Reload)
**`useGlobalLocalStorage(key)`** - Syncs with localStorage
- username, avatarId, language, volume
- cache, cacheAlternative (game state)
- UI preferences (blurEnabled, canvasSize)

```typescript
const [username, setUsername] = useGlobalLocalStorage('username');
```

### Session State (Cleared on Reload)
**`useGlobalState(key)`** - In-memory only
- userId, user object
- Runtime app state

### Game-Specific Cache
**`useCacheV2<T>(initialValue)`** - Preferred over deprecated `useCache`
- Auto-syncs with localStorage per gameId
- Auto-cleanup of old entries

```typescript
const cache = useCacheV2<MyState>({ myData: [] });
cache.update({ myData: newValue });
```

### Daily Games
- **`useDailyLocalToday()`** - Per-day persistent state
- **`useDailyGlobalStore()`** - Session-scoped Daily state

### Important: Phase Changes Remount Components
- When `state.phase` changes, React remounts the entire phase component
- **Local useState is lost** on remount
- **Use cache/localStorage** for data that must survive phase changes

---

## 🎨 Styling

### CSS Modules (Always)
```typescript
// ComponentName.module.scss
import styles from './ComponentName.module.scss';

<div className={styles.container}>...</div>
```

### Conditional Classes
```typescript
import clsx from 'clsx';

<div className={clsx(
  styles.base,
  isActive && styles.active,
  className  // Allow className prop override
)} />
```

### Class Naming (BEM-style)
```scss
.component-name {
  &__element { }
  &--modifier { }
}
```

---

## 🎮 Game Development (Functions/Engine)

### File Structure (functions/src/engine/{game-name}/)
```
{game-name}/
├── types.d.ts        # Game types (needs JSDoc!)
├── constants.ts      # PHASES, ACTIONS, config (needs JSDoc!)
├── helpers.ts        # Game logic utilities
├── actions.ts        # Player action handlers
├── setup.ts          # Phase preparation functions
├── data.ts           # Resource loading (optional)
└── index.ts          # Game interface exports
```

### Required Exports (index.ts)
```typescript
/**
 * Creates initial game state
 */
export const getInitialState = (): InitialState => { ... };

/**
 * Returns player count constraints
 */
export const getPlayerCounts = () => PLAYER_COUNTS;

/**
 * Determines next game phase
 */
export const getNextPhase = async (...) => { ... };

/**
 * Routes player actions to handlers
 */
export const submitAction = async (...) => { ... };
```

### Constants Pattern
```typescript
export const GAME_PHASES = {
  LOBBY: 'LOBBY',
  SETUP: 'SETUP',
  DRAW: 'DRAW',
  GAME_OVER: 'GAME_OVER'
} as const;

export const GAME_ACTIONS = {
  SUBMIT_DRAWING: 'SUBMIT_DRAWING',
  SUBMIT_VOTE: 'SUBMIT_VOTE'
} as const;

export const PLAYER_COUNTS = {
  MIN: 3,
  MAX: 10
};
```

### Helper Functions
```typescript
/**
 * Determines the next phase based on current state
 * @param state - Current game state
 * @param players - Current players
 * @returns Next phase configuration
 */
export const determineNextPhase = (
  state: GameState,
  players: GamePlayers
): string => { ... };
```

---

## ✨ Code Quality

### JSDoc Comments

**Always use multi-line format:**
```typescript
/**
 * Description of function or component
 */

// ❌ NOT single-line
/** Description */
```

**Don't repeat TypeScript types in JSDoc:**
```typescript
// ❌ BAD - Types already in signature
/**
 * @param name - string The user's name
 * @returns boolean Whether valid
 */
function validate(name: string): boolean { ... }

// ✅ GOOD - Describe purpose, not types
/**
 * Validates user name against business rules
 * @param name - The user's name to validate
 * @returns True if name meets requirements
 */
function validate(name: string): boolean { ... }
```

***Don't add examples or inner comments in JSDoc**
```typescript
// ❌ BAD - Too much detail in JSDoc
/**
 * Handles user login
 * @param username - The user's username (e.g., "john_doe")
 * @param password - The user's password (must be at least 8 characters)
 * @returns User object if successful, null if failed
 * @example
 * const user = login("john_doe", "password123");
 * if (user) {
 *   // Login successful
 * } else {
 *   // Login failed
 * }
 */
function login(username: string, password: string): User | null { ... }
// ✅ GOOD - Keep JSDoc focused on purpose and parameters
/**
 * Authenticates a user with given credentials
 * @param username - The user's username
 * @param password - The user's password
 * @returns User object if successful, null if failed
 */
function login(username: string, password: string): User | null { ... }
```

**Document all props/type properties:**
```typescript
type Props = {
  /**
   * User's display name
   */
  username: string;
  /**
   * Whether user is an admin
   */
  isAdmin: boolean;
};
```

### Error Handling
```typescript
// Use PageError component for full-page errors
import { PageError } from 'components/errors/PageError';

// Console errors (with biome ignore)
// biome-ignore lint/suspicious/noConsole: debugging purposes
console.error('Failed to load', error);

// API hooks handle errors
const request = useGameActionRequest({
  actionName: 'submit-action',
  onError: () => setStep(0),
  errorMessage: translate({ pt: '...', en: '...' })
});
```

### Naming
- **Variables/Functions**: `camelCase`
- **Components**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types**: `PascalCase`
- **Private/Internal**: Prefix with `_` (rare, prefer local scope)

---

## ⚡ Performance

### When to Optimize
```typescript
// ✅ Use useMemo for expensive computations
const filtered = useMemo(
  () => items.filter(complexFilter),
  [items]
);

// ✅ Use useCallback for stable function references (prevent re-renders)
const handleClick = useCallback(
  () => doSomething(id),
  [id]
);
```

### Component Performance
- Lazy load game sessions (already implemented via `gameSessions` map)
- Extract complex logic to helper functions
- Consider component memoization for expensive renders (rare)

---

## 🎯 Quick Reference

**Imports:**
- Icons: Direct from `icons/IconName` ❌ NOT `pages/Dev/utils/iconsCollection`
- Components: Direct paths ❌ NOT barrel exports
- Lodash: Named imports ❌ NOT default import
- Import order: Automated via `yarn sort-imports`

**Types:**
- Use `type` over `interface`
- Use `Dictionary<T>` over `Record<string, T>` for UIDs
- Document all properties with JSDoc
- Avoid `any` - infer types

**Components:**
- Named exports (except Session components)
- Hooks at top
- Props always have JSDoc
- Use CSS Modules with `clsx`

**State:**
- Persistent: `useGlobalLocalStorage`, `useCacheV2`
- Session: `useGlobalState`, `useState`
- Phase changes remount components

**Games:**
- Follow file structure exactly
- Document types.d.ts and constants.ts (currently missing!)
- JSDoc on all exported functions

---

## 📝 Common Issues to Avoid

1. ❌ Importing from `@pages/Dev/utils/iconsCollection`
2. ❌ Using barrel exports in components
3. ❌ Using `import _ from 'lodash'`
4. ❌ Missing JSDoc on type properties
5. ❌ Using `any` instead of proper types
6. ❌ Default exports (except Sessions)
7. ❌ Single-line JSDoc comments
8. ❌ Storing persistent data in useState (lost on phase change)
9. ❌ Missing `as const` on constant objects

---

**Key Patterns to Follow:**
This codebase has strong, consistent patterns. When in doubt, find a similar existing component and match its structure exactly. The import order, file organization, and component structure are not arbitrary—they enable optimal bundle splitting and tree-shaking.
