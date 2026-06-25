# Functions Folder Reorganization Plan

**Created:** 2026-06-24
**Status:** DRAFT - Discussion Phase

---

## 🎯 Goals

1. **Clear Separation of Concerns**: Services, mechanics, and pure utilities
2. **Reduce Redundancies**: Consolidate duplicated logic
3. **Improve Discoverability**: Developers know where to find/add code
4. **Eliminate Circular Dependencies**: Clean import graph

---

## 📊 Current Issues Summary

### Critical Problems Found
- **God Module**: `players-utils.ts` (530 lines, 5+ responsibilities)
- **Dual Card Systems**: `deck.ts` vs `player-hand-utils.ts`
- **Circular Import Risk**: `game-utils.ts` ↔ `players-utils.ts`
- **100+ Lines Duplication**: Resource fetching in `tdr-utils.ts`
- **Scope Confusion**: Game logic mixed with generic utilities

### Files Analysis
| File | Lines | Issues | Action |
|------|-------|--------|--------|
| `players-utils.ts` | 530 | Too many responsibilities | **SPLIT** |
| `player-hand-utils.ts` | ~100 | Deprecated pattern, dual system | **DEPRECATE** |
| `tdr-utils.ts` | ~600 | 100+ duplicated lines, TDR-specific | **REFACTOR + MOVE** |
| `helpers.ts` | ~280 | Mixed concerns (some game logic) | **CLEAN** |
| `game-utils.ts` | ~300 | Mixed concerns (some generic utils) | **MOVE TO MECHANICS** |
| `firebase.ts` | ~150 | Service layer | **MOVE TO SERVICES** |
| `firestore.ts` | ~400 | Service layer | **MOVE TO SERVICES** |
| `user.ts` | ~200 | Service layer | **MOVE TO SERVICES** |
| `admin-cleanup.ts` | ~100 | Admin service | **MOVE TO SERVICES** |
| `delegators.ts` | ~200 | Engine routing | **MOVE TO SERVICES** |
| `deck.ts` | ~100 | Game mechanic | **MOVE TO MECHANICS** |
| `turn-order-utils.ts` | ~100 | Game mechanic | **MOVE TO MECHANICS** |
| `achievement-utils.ts` | ~200 | Already deprecated | **DELETE** (replaced by tool-kits) |
| `image-cards-utils.ts` | ~80 | Resource fetching | **MOVE TO MECHANICS** |
| `constants.ts` | ~500 | Mixed (global + specific) | **SPLIT** |

---

## 🏗️ Proposed New Structure

```
functions/src/
├── services/           # Firebase, external APIs, infrastructure
│   ├── firebase.ts           # Firebase config, error handling, delegators
│   ├── firestore.ts          # Firestore collections, CRUD operations
│   ├── user-service.ts       # User management, game history
│   ├── admin-service.ts      # Admin cleanup, maintenance
│   ├── resource-service.ts   # TDR resource fetching (generic pattern)
│   └── index.ts
│
├── mechanics/          # Game-specific logic and systems
│   ├── players/
│   │   ├── player-manager.ts     # CRUD, ready state, properties
│   │   ├── player-scoring.ts     # Scores class, rankings
│   │   ├── player-voting.ts      # Vote analysis
│   │   └── index.ts
│   ├── cards/
│   │   ├── deck-system.ts        # Modern card management (current deck.ts)
│   │   ├── player-hand.ts        # DEPRECATED - legacy support only
│   │   └── index.ts
│   ├── game-flow.ts          # Phase delegation, game state, rounds
│   ├── turn-order.ts         # Turn order management
│   ├── randomization.ts      # Game-specific random selection
│   ├── scoring.ts            # Victory points, rankings
│   └── index.ts
│
├── resources/          # TDR-specific resource management
│   ├── items.ts              # getItems, item filtering
│   ├── words.ts              # getSingleWords, getAdjectives
│   ├── suspects.ts           # getContenders, getSuspects
│   ├── movies.ts             # getMovies
│   ├── image-cards.ts        # getImageCards, getImageCardsDecks
│   ├── resource-helpers.ts   # Shared NSFW filtering, used-item logic
│   └── index.ts
│
├── utils/              # Pure utilities (math, arrays, strings)
│   ├── array.ts              # Array manipulation (immutable operations)
│   ├── object.ts             # Object/Dictionary operations
│   ├── string.ts             # String manipulation
│   ├── math.ts               # Averages, calculations
│   ├── filtering.ts          # Generic filter abstractions
│   ├── constants.ts          # ONLY global constants (LETTERS, AVATAR_IDS, etc.)
│   └── index.ts
│
├── constants/          # Game-specific constants
│   ├── games.ts              # GAME_NAMES, GAME_CODES, GAME_KEYS
│   ├── collections.ts        # GLOBAL_USED_DOCUMENTS, DATA_DOCUMENTS
│   ├── resources.ts          # TDR_RESOURCES
│   ├── sprites.ts            # AVATAR_SPRITE_LIBRARIES, SPRITE_LIBRARIES
│   ├── colors.ts             # AVATARS_COLORS, BOT_COLORS
│   └── index.ts
│
├── engine/             # Existing game engines (unchanged)
├── types/              # Existing types (unchanged)
└── tool-kits/          # Existing tool-kits (unchanged)
```

---

## 🗺️ File Migration Map

### 📁 **SERVICES** (New Folder)
**Purpose**: Firebase, Firestore, external APIs, infrastructure

| Current File | New Location | Rationale |
|-------------|--------------|-----------|
| `firebase.ts` | `services/firebase.ts` | Firebase config, emulator checks, error handling |
| `firestore.ts` | `services/firestore.ts` | Collection refs, Firestore operations |
| `user.ts` | `services/user-service.ts` | User management, game history tracking |
| `admin-cleanup.ts` | `services/admin-service.ts` | Admin operations |
| `delegators.ts` | `services/firebase.ts` | Merge into firebase.ts (game engine routing) |

**New File to Create**:
- `services/resource-service.ts` - Extract generic `getUnusedResources()` pattern from `tdr-utils.ts`

---

### 🎮 **MECHANICS** (New Folder)
**Purpose**: Game logic, player systems, card management, turn order

| Current File/Functions | New Location | Rationale |
|------------------------|--------------|-----------|
| `players-utils.ts` (lines 1-150) | `mechanics/players/player-manager.ts` | CRUD, ready state, properties |
| `players-utils.ts` (lines 276-413) | `mechanics/players/player-scoring.ts` | Scores class, rankings |
| `players-utils.ts` (lines 439-530) | `mechanics/players/player-voting.ts` | Vote analysis |
| `deck.ts` | `mechanics/cards/deck-system.ts` | Modern card management |
| `player-hand-utils.ts` | `mechanics/cards/player-hand.ts` + **@deprecated** | Legacy support |
| `turn-order-utils.ts` | `mechanics/turn-order.ts` | Turn order |
| `game-utils.ts` (game flow) | `mechanics/game-flow.ts` | Phase delegation, game state, rounds |
| `game-utils.ts` (randomization) | `mechanics/randomization.ts` | `getRandomUniqueItems`, `getRandomUniqueObjects`, etc. |
| `game-utils.ts` (scoring) | `mechanics/scoring.ts` | `getPointsToVictory`, `determineWinners`, etc. |

**Functions to Move from `game-utils.ts` → `utils/`**:
- `dealItems()` → `utils/array.ts` (rename to `popItems`)
- `filterOutByIds()` → `utils/filtering.ts` (make generic)
- `buildBooleanDictionary()` → Already in `helpers.ts`, consolidate

---

### 📦 **RESOURCES** (New Folder)
**Purpose**: TDR-specific resource fetching (items, words, suspects, etc.)

| Current File | New Location | Rationale |
|-------------|--------------|-----------|
| `tdr-utils.ts` (items) | `resources/items.ts` | `getItems()`, item filtering |
| `tdr-utils.ts` (words) | `resources/words.ts` | `getSingleWords()`, `getAdjectives()` |
| `tdr-utils.ts` (suspects) | `resources/suspects.ts` | `getContenders()`, `getSuspects()` |
| `tdr-utils.ts` (movies) | `resources/movies.ts` | `getMovies()` |
| `image-cards-utils.ts` | `resources/image-cards.ts` | `getImageCards()`, `getImageCardsDecks()` |
| **NEW**: Extract pattern | `resources/resource-helpers.ts` | NSFW filtering, used-item checking, deck filtering |

**Refactoring**:
- All resource files use `getUnusedResources()` from `services/resource-service.ts`
- Share filtering logic from `resources/resource-helpers.ts`
- Eliminate 100+ lines of duplication

---

### 🛠️ **UTILS** (Keep, But Clean)
**Purpose**: ONLY pure utilities - math, arrays, strings, objects

| Current File | Action | New Structure |
|-------------|--------|---------------|
| `helpers.ts` | **SPLIT** | → `utils/array.ts`, `utils/object.ts`, `utils/string.ts`, `utils/math.ts` |
| `constants.ts` (global only) | **KEEP** | → `utils/constants.ts` (LETTERS, AVATAR_IDS, SEPARATOR, DOUBLE_ROUNDS_THRESHOLD) |

**What STAYS in `utils/`**:
- `stringRemoveAccents()`
- `getLastItem()`, `removeItem()`, `makeArray()`, `getUniqueItems()` → `utils/array.ts`
- `calculateAverage()`, `calculateLongestRun()` → `utils/math.ts`
- `sliceIntoChunks()`, `sliceInParts()` → `utils/array.ts`
- `getNextItem()`, `getPreviousItem()` → `utils/array.ts`
- `buildBooleanDictionary()` → `utils/object.ts`

**New Files**:
- `utils/filtering.ts` - Generic filtering abstractions:
  ```typescript
  export const filterByPredicate = <T>(dict: Dictionary<T>, predicate: (item: T) => boolean): Dictionary<T>
  export const buildFilterChain = (...predicates): (item: T) => boolean
  ```

---

### 📋 **CONSTANTS** (New Folder)
**Purpose**: Game-specific constants split by category

| From `constants.ts` | New Location | What's Included |
|--------------------|--------------|-----------------|
| Game metadata | `constants/games.ts` | `GAMES`, `GAME_CODES`, `GAME_KEYS`, `GAME_NAMES` |
| Collection names | `constants/collections.ts` | `GLOBAL_USED_DOCUMENTS`, `DATA_DOCUMENTS` |
| TDR resources | `constants/resources.ts` | `TDR_RESOURCES` |
| Sprite libraries | `constants/sprites.ts` | `AVATAR_SPRITE_LIBRARIES`, `SPRITE_LIBRARIES` |
| Color constants | `constants/colors.ts` | `AVATARS_COLORS`, `BOT_COLORS` |

**Rationale**: `constants.ts` is 500+ lines and mixes global constants with game-specific data. Splitting improves discoverability and reduces cognitive load.

---

## 🔄 Migration Strategy

### Phase 1: Create New Folders & Core Services (Week 1)
1. Create `services/`, `mechanics/`, `resources/`, `constants/` folders
2. Move Firebase/Firestore to `services/`
3. Split `constants.ts` → `constants/` folder
4. Create barrel exports (`index.ts`) for each folder
5. Update imports in `engine/` files

### Phase 2: Mechanics Reorganization (Week 2)
1. Split `players-utils.ts` → `mechanics/players/`
2. Move `deck.ts` → `mechanics/cards/deck-system.ts`
3. Deprecate `player-hand-utils.ts` → `mechanics/cards/player-hand.ts` (@deprecated)
4. Split `game-utils.ts` → `mechanics/game-flow.ts`, `mechanics/randomization.ts`, `mechanics/scoring.ts`
5. Move `turn-order-utils.ts` → `mechanics/turn-order.ts`
6. Update imports

### Phase 3: Resources & Utils Cleanup (Week 3)
1. Split `tdr-utils.ts` → `resources/` folder
2. Create `resources/resource-helpers.ts` with shared logic
3. Refactor resource files to use shared patterns
4. Split `helpers.ts` → `utils/array.ts`, `utils/object.ts`, etc.
5. Create `utils/filtering.ts` with generic abstractions
6. Update imports

### Phase 4: Verification & Documentation (Week 4)
1. Run full test suite
2. Check for circular dependencies
3. Update documentation
4. Create migration guide for developers

---

## ✅ Verification Checklist

- [ ] `yarn build` passes
- [ ] `yarn test` passes (all tests)
- [ ] No circular dependencies: `yarn madge --circular --extensions ts functions/src`
- [ ] All game engines import correctly
- [ ] Manual smoke test: Create game, play phase, check scoring
- [ ] Documentation updated

---

## 🎨 Design Principles

### **SERVICES** = "How do we talk to external systems?"
- Firebase, Firestore, external APIs
- Database operations
- User management
- Resource fetching infrastructure

### **MECHANICS** = "How does the game work?"
- Player systems
- Card/deck management
- Turn order
- Scoring, winning conditions
- Game flow (phases, rounds)
- Game-specific randomization

### **RESOURCES** = "What game content do we need?"
- TDR-specific: items, words, suspects, movies
- Image cards
- Resource filtering (NSFW, decks, used items)

### **UTILS** = "Generic, reusable, framework-agnostic functions"
- Array manipulation (immutable)
- Object/Dictionary operations
- String manipulation
- Math calculations
- Generic filtering abstractions
- NO game logic, NO Firebase, NO TDR specifics

### **CONSTANTS** = "What fixed data do we reference?"
- Global constants in `utils/constants.ts`
- Game metadata in `constants/games.ts`
- Collection names in `constants/collections.ts`
- Specific constants in files where they're used (if used only once)

---

## 🤔 Open Questions for Discussion

### 1. **Services vs. Engine**
Should `delegators.ts` (game engine routing) go in:
- **Option A**: `services/firebase.ts` (infrastructure concern)
- **Option B**: `engine/routing.ts` (game engine concern)
- **Recommendation**: **Option A** - It's HTTP routing logic, belongs with Firebase

### 2. **Resources vs. Services**
Should resource fetching be:
- **Option A**: `resources/` folder (TDR-specific content)
- **Option B**: `services/resource-service.ts` (infrastructure)
- **Recommendation**: **Both** - Generic infrastructure in services, TDR-specific logic in resources

### 3. **Constants Location**
Should constants be:
- **Option A**: Separate `constants/` top-level folder
- **Option B**: Inside relevant folders (`services/constants.ts`, `mechanics/constants.ts`)
- **Recommendation**: **Option A** - Easier to find, clear separation

### 4. **Tool-Kits**
Should `tool-kits/` move to:
- **Option A**: `mechanics/tool-kits/` (they're game mechanics builders)
- **Option B**: Keep as-is (current `utils/tool-kits/`)
- **Recommendation**: **Option B** - They're meta-tools, not mechanics themselves

### 5. **Backward Compatibility**
How do we handle imports during migration?
- **Option A**: Keep old files as barrel exports (re-export from new locations)
- **Option B**: Search-and-replace all imports immediately
- **Option C**: Gradual migration with deprecation warnings
- **Recommendation**: **Option C** - Safest, allows incremental testing

### 6. **File Size Enforcement**
Should we add linting rules?
- **Option A**: ESLint rule: max 300 lines per file
- **Option B**: No enforcement, rely on code review
- **Recommendation**: **Option A** - Prevents future god modules

---

## 📝 Next Steps

1. **✅ Discuss structure** - Review and align on folder organization
2. **Decide on open questions** - Make decisions on trade-offs
3. **Create detailed implementation plan** - Step-by-step with file-by-file changes
4. **Begin Phase 1** - Services migration (lowest risk)

---

**Last Updated:** 2026-06-24
**Status:** Ready for review and discussion
