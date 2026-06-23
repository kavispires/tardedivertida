# Drop Player Feature - Implementation Plan

> **Feature**: Host-only action to remove players from active gameplay during resolution/results phases
>
> **Status**: Planning Phase
>
> **Last Updated**: May 5, 2026

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution Design](#solution-design)
- [Implementation Steps](#implementation-steps)
- [Technical Details](#technical-details)
- [Testing Strategy](#testing-strategy)
- [Design Decisions](#design-decisions)
- [Future Enhancements](#future-enhancements)

---

## Overview

### Summary
Implement a host-only action to remove players who need to leave mid-game without resetting the entire session. The feature allows the host to drop players during resolution/results phases, marking them as inactive while preserving their achievements and allowing the game to continue seamlessly.

### Key Benefits
- **No Game Disruption**: Continue playing when someone needs to leave
- **Data Preservation**: Keep dropped players' scores and achievements for final statistics
- **Safe Implementation**: Restricted to transitional phases to minimize complexity
- **Host Control**: Only the host can drop players, preventing abuse

### Scope
- ✅ Host can drop any player (except themselves) during resolution/results phases
- ✅ Dropped players are marked with `dropped: true` flag
- ✅ Turn order and game order automatically updated
- ✅ Minimum player count validation
- ❌ Cannot drop during active gameplay phases
- ❌ Cannot drop during GAME_OVER (game already complete)
- ❌ Player cannot drop themselves

---

## Problem Statement

### Current Situation
When a player needs to leave mid-game:
- **Option 1**: Game must be completely reset (loses all progress)
- **Option 2**: Player goes AFK, blocking game progression
- **Option 3**: Host must manually manage workarounds (suboptimal UX)

### User Story
> *"As a host, I am often in a session with other players and someone needs to leave. I want to be able to remove them from the game so we can continue playing without resetting all our progress."*

### Requirements
1. Host-only action (not available to regular players)
2. Allowed only during resolution/results phases
3. Preserve player data for end-game statistics
4. Update turn order automatically
5. Validate minimum player count
6. Clear error messages for invalid operations

---

## Solution Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Admin UI (Frontend)                   │
│  ┌─────────────────────────────────────────────────┐    │
│  │   AdminMenuDrawer                               │    │
│  │   ┌───────────────────────────────────────┐    │    │
│  │   │ [Select Player ▼]                     │    │    │
│  │   │ ⚠️  This action cannot be undone      │    │    │
│  │   │ [Confirm Drop Player]                 │    │    │
│  │   └───────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HOST_API.run({ action: DROP_PLAYER })
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Host Engine (Backend)                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │ dropPlayer(gameId, gameName, playerId)         │    │
│  │                                                 │    │
│  │ 1. Validate phase (RESULTS/RESOLUTION only)   │    │
│  │ 2. Validate min player count                  │    │
│  │ 3. Mark player.dropped = true                 │    │
│  │ 4. Filter from gameOrder/turnOrder            │    │
│  │ 5. Advance turn if player was active          │    │
│  │ 6. Persist to Firestore                       │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Game State Update                       │
│                                                          │
│  state.players[playerId].dropped = true                │
│  state.gameOrder = gameOrder.filter(id !== playerId)   │
│  state.turnOrder = turnOrder.filter(id !== playerId)   │
│  state.activePlayerId = getNextPlayerId() [if needed]  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Host Action Initiated**: Admin clicks "Drop Player" in AdminMenuDrawer
2. **Validation**: Backend validates phase and minimum player count
3. **State Update**: Player marked as dropped, arrays filtered
4. **Turn Advancement**: If dropped player was active, advance to next
5. **Persistence**: Changes saved to Firestore
6. **Real-time Sync**: All clients receive updated state via Firebase listeners

---

## Implementation Steps

### Phase 1: Backend - Host Action Implementation

#### Step 1: Add `dropPlayer` Host Action
**File**: `functions/src/engine/host.ts`

Add new function following the pattern of existing host actions (around lines 200-320):

```typescript
export type DropPlayerPayload = {
  gameId: string;
  gameName: string;
  playerId: UID;
  action: string;
};

/**
 * Drops a player from the active game during resolution/results phases.
 * Marks the player as dropped and updates game/turn order accordingly.
 *
 * @param data - The payload containing game and player information
 * @returns Success status or error
 */
const dropPlayer = async (data: DropPlayerPayload) => {
  const { gameId, gameName, playerId } = data;
  const actionText = 'drop player';

  utils.firebase.verifyPayload(gameId, 'gameId', actionText);
  utils.firebase.verifyPayload(gameName, 'gameName', actionText);
  utils.firebase.verifyPayload(playerId, 'playerId', actionText);

  const { sessionRef, state } = await utils.firestore.getStateReferences(
    gameName,
    gameId,
    actionText,
  );

  const players = state?.players ?? {};
  const currentPhase = state?.phase ?? '';

  // Validate phase restriction
  const isValidPhase = currentPhase.toUpperCase().includes('RESULT') ||
                       currentPhase.toUpperCase().includes('RESOLUTION');

  if (!isValidPhase) {
    utils.firebase.throwException(
      `Cannot drop player during ${currentPhase} phase. Only allowed during resolution/results phases.`,
      actionText
    );
  }

  // Validate player exists and isn't already dropped
  if (!players[playerId]) {
    utils.firebase.throwException(`Player ${playerId} not found in game`, actionText);
  }

  if (players[playerId].dropped) {
    utils.firebase.throwException(`Player ${playerId} has already been dropped`, actionText);
  }

  // Validate minimum player count
  const { getPlayerCounts } = delegatorUtils.getEngine(gameName);
  const playerCounts = getPlayerCounts();
  const activePlayers = utils.players.getListOfPlayers(players).filter(p => !p.dropped);

  if (activePlayers.length - 1 < playerCounts.MIN) {
    utils.firebase.throwException(
      `Cannot drop player: game requires minimum of ${playerCounts.MIN} players, only ${activePlayers.length - 1} would remain`,
      actionText
    );
  }

  try {
    // Mark player as dropped
    players[playerId].dropped = true;

    // Update game order and turn order
    const gameOrder = state.gameOrder?.filter((id: UID) => id !== playerId) ?? [];
    const turnOrder = state.turnOrder?.filter((id: UID) => id !== playerId);

    // Handle active player advancement if needed
    let activePlayerId = state.activePlayerId;
    if (activePlayerId === playerId && gameOrder.length > 0) {
      activePlayerId = utils.turnOrder.getNextPlayerId(gameOrder, playerId);
    }

    // Build update object
    const updatePayload: PlainObject = {
      players,
      gameOrder,
    };

    if (turnOrder) {
      updatePayload.turnOrder = turnOrder;
    }

    if (activePlayerId !== state.activePlayerId) {
      updatePayload.activePlayerId = activePlayerId;
    }

    await sessionRef.doc('state').update(updatePayload);

    return { success: true, droppedPlayerId: playerId };
  } catch (error) {
    return utils.firebase.throwException(error, actionText);
  }
};
```

#### Step 2: Register the Action
**File**: `functions/src/engine/host.ts` (around line 362)

```typescript
const HOST_API_ACTIONS = {
  CREATE_GAME: createGame,
  LOCK_GAME: lockGame,
  GO_TO_NEXT_PHASE: goToNextPhase,
  FORCE_STATE_PROPERTY: forceStateProperty,
  PLAY_AGAIN: playAgain,
  FORCE_END_GAME: forceLastRound,
  RESET_GAME: unlockAndResetGame,
  RETIRE_GAMES: retireGames,
  DROP_PLAYER: dropPlayer,  // ← Add this
};
```

#### Step 3: Add Utility Functions
**File**: `functions/src/utils/players-utils.ts`

Update `getListOfPlayers()` to exclude dropped players by default:

```typescript
/**
 * Retrieves a list of player objects, optionally including bots and excluding specific players.
 * @param players - The players object to extract from
 * @param includeBots - Whether to include bot players in the list
 * @param butThese - An array of player IDs to exclude from the list
 * @param excludeDropped - Whether to exclude dropped players (default: true)
 * @returns An array of player objects
 */
export const getListOfPlayers = (
  players: Players,
  includeBots = false,
  butThese: UID[] = [],
  excludeDropped = true
): Player[] => {
  let options = Object.values(players).filter((player) => !butThese.includes(player.id));

  if (excludeDropped) {
    options = options.filter(player => !player.dropped);
  }

  if (includeBots) return options;
  return options.filter((player) => player.type === 'player');
};
```

---

### Phase 2: Frontend - Admin UI Integration

#### Step 4: Update Frontend Constants
**File**: `src/services/adapters.ts` (around line 34)

```typescript
export const HOST_API_ACTIONS = {
  CREATE_GAME: 'CREATE_GAME',
  FORCE_END_GAME: 'FORCE_END_GAME',
  FORCE_STATE_PROPERTY: 'FORCE_STATE_PROPERTY',
  GO_TO_NEXT_PHASE: 'GO_TO_NEXT_PHASE',
  LOCK_GAME: 'LOCK_GAME',
  PLAY_AGAIN: 'PLAY_AGAIN',
  RESET_GAME: 'RESET_GAME',
  DROP_PLAYER: 'DROP_PLAYER',  // ← Add this
} as const;
```

#### Step 5: Add UI to AdminMenuDrawer
**File**: `src/components/admin/AdminMenuDrawer.tsx` (insert around lines 90-150)

```typescript
// Add to imports
import { UserDeleteOutlined } from '@ant-design/icons';
import { Select } from 'antd';

// Add inside the Drawer, in the actions section
<li className={styles.buttons}>
  <h3>Player Management</h3>
  <Form
    onFinish={(values) => {
      if (values.playerId) {
        onPerformAdminAction({
          action: HOST_API_ACTIONS.DROP_PLAYER,
          playerId: values.playerId,
        });
      }
    }}
  >
    <Form.Item name="playerId" label="Drop Player">
      <Select
        placeholder="Select player to drop"
        disabled={isLoading}
      >
        {Object.values(players)
          .filter((player) => !player.dropped && player.id !== meta.createdBy)
          .map((player) => (
            <Select.Option key={player.id} value={player.id}>
              {player.name}
            </Select.Option>
          ))}
      </Select>
    </Form.Item>

    <Popconfirm
      placement="right"
      title="Are you sure you want to drop this player?"
      description="This action cannot be undone. The player will be removed from active gameplay."
      onConfirm={() => form.submit()}
    >
      <AdminPerformActionButton
        disabled={isLoading}
        label="Drop Selected Player"
        icon={<UserDeleteOutlined />}
        className={styles.button}
      />
    </Popconfirm>
  </Form>
</li>
```

#### Step 6: Create Reusable Component (Optional Enhancement)
**File**: `src/components/host/DropPlayerControl.tsx`

```typescript
import { UserDeleteOutlined } from '@ant-design/icons';
import { Button, Form, Select } from 'antd';
// Types
import type { GamePlayers, GameState } from 'types/game';
// Hooks
import { useGameMeta } from '@hooks/useGameMeta';
import { useHost } from '@hooks/useHost';
import { useHostActionRequest } from '@hooks/useHostActionRequest';
import { useLoading } from '@hooks/useLoading';
// Services
import { HOST_API_ACTIONS } from '@services/adapters';
// Components
import { Popconfirm } from 'components/general/Popconfirm';
import { Translate } from 'components/language/Translate';

type DropPlayerControlProps = {
  /**
   * The game players
   */
  players: GamePlayers;
  /**
   * The game state
   */
  state: GameState;
  /**
   * Optional callback after successful drop
   */
  onAfterDrop?: () => void;
};

/**
 * Host-only control for dropping players from the game during resolution/results phases
 */
export function DropPlayerControl({ players, state, onAfterDrop }: DropPlayerControlProps) {
  const isHost = useHost();
  const { isLoading } = useLoading();
  const { meta } = useGameMeta();
  const [form] = Form.useForm();

  const onDropPlayer = useHostActionRequest({
    actionName: 'drop-player',
    successMessage: 'Player dropped successfully',
    errorMessage: 'Failed to drop player',
    onAfterCall: () => {
      form.resetFields();
      onAfterDrop?.();
    },
  });

  if (!isHost) return null;

  const eligiblePlayers = Object.values(players).filter(
    (player) => !player.dropped && player.id !== meta.createdBy
  );

  if (eligiblePlayers.length === 0) return null;

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="playerId"
        label={<Translate pt="Remover Jogador" en="Drop Player" />}
      >
        <Select placeholder="Select player to drop" disabled={isLoading}>
          {eligiblePlayers.map((player) => (
            <Select.Option key={player.id} value={player.id}>
              {player.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Popconfirm
        placement="right"
        title={<Translate pt="Tem certeza?" en="Are you sure?" />}
        description={
          <Translate
            pt="Esta ação não pode ser desfeita. O jogador será removido do jogo."
            en="This action cannot be undone. The player will be removed from active gameplay."
          />
        }
        onConfirm={() => {
          const playerId = form.getFieldValue('playerId');
          if (playerId) {
            onDropPlayer({
              action: HOST_API_ACTIONS.DROP_PLAYER,
              playerId,
            });
          }
        }}
      >
        <Button
          icon={<UserDeleteOutlined />}
          danger
          type="primary"
          disabled={isLoading}
        >
          <Translate pt="Remover Jogador" en="Drop Player" />
        </Button>
      </Popconfirm>
    </Form>
  );
}
```

---

### Phase 3: State Cleanup & Turn Order Management

#### Step 7: Update Game Order/Turn Order References
Already handled in Step 1 (backend implementation)

Key operations:
- `gameOrder.filter(id => id !== playerId)` - Remove from game order
- `turnOrder?.filter(id => id !== playerId)` - Remove from turn order if exists
- `utils.turnOrder.getNextPlayerId()` - Advance if dropped player was active

#### Step 8: Handle Edge Cases
Considerations for special game states:

**Active Player Advancement**:
```typescript
if (activePlayerId === playerId && gameOrder.length > 0) {
  activePlayerId = utils.turnOrder.getNextPlayerId(gameOrder, playerId);
  // Also mark new active player as not ready
  players[activePlayerId].ready = false;
}
```

**Special Roles** (judge, scout, detective, etc.):
- Needs game-specific handling
- Consider adding cleanup hooks per game
- Start with basic implementation, enhance as needed

---

### Phase 4: Testing & Validation

#### Step 9: Phase Restriction Validation
Pattern matching approach:
```typescript
const isValidPhase = currentPhase.toUpperCase().includes('RESULT') ||
                     currentPhase.toUpperCase().includes('RESOLUTION');
```

Known phase names to validate against:
- `RESULTS`
- `RESOLUTION`
- `RESULT`
- `ROUND_RESULTS`
- `FINAL_RESULTS`
- `PRELIMINARY_RESULTS`

#### Step 10: Manual Testing Checklist

| Test Case | Expected Behavior | Status |
|-----------|-------------------|--------|
| Drop non-active player during RESULTS | Game continues, turn unchanged | ⬜ |
| Drop active player during RESULTS | Turn advances to next player | ⬜ |
| Drop when 2 players remain (min=2) | Error: cannot drop below minimum | ⬜ |
| Attempt drop during CARD_PLAY phase | Error: invalid phase | ⬜ |
| Attempt drop during GAME_OVER | Error: invalid phase | ⬜ |
| Verify gameOrder updated | Dropped player removed from array | ⬜ |
| Verify turnOrder updated | Dropped player removed from array | ⬜ |
| Test in qual-quesito | Works correctly | ⬜ |
| Test in galeria-de-sonhos | Works correctly | ⬜ |
| Test in contadores-historias | Works correctly | ⬜ |
| Verify dropped player in GAME_OVER gallery | Player data still renders | ⬜ |
| Verify dropped player achievements preserved | Achievements saved correctly | ⬜ |

---

## Technical Details

### Type Definitions

```typescript
// functions/src/types/common.d.ts
interface Player {
  id: UID;
  name: string;
  avatarId: string;
  type: 'player' | 'bot';
  ready: boolean;
  score: number;
  updatedAt: number;
  isGuest?: boolean;
  dropped?: boolean;  // ← Add this
  // ...game-specific properties
}

// functions/src/engine/host.ts
export type DropPlayerPayload = {
  gameId: string;
  gameName: string;
  playerId: UID;
  action: string;
};
```

### Database Schema Impact

**Before**:
```javascript
{
  state: {
    phase: "RESULTS",
    players: {
      "player1": { id: "player1", name: "Alice", score: 10, ... },
      "player2": { id: "player2", name: "Bob", score: 8, ... },
      "player3": { id: "player3", name: "Charlie", score: 6, ... }
    },
    gameOrder: ["player1", "player2", "player3"],
    activePlayerId: "player2"
  }
}
```

**After Dropping Player2**:
```javascript
{
  state: {
    phase: "RESULTS",
    players: {
      "player1": { id: "player1", name: "Alice", score: 10, ... },
      "player2": { id: "player2", name: "Bob", score: 8, dropped: true, ... },  // ← Still present
      "player3": { id: "player3", name: "Charlie", score: 6, ... }
    },
    gameOrder: ["player1", "player3"],  // ← Filtered
    activePlayerId: "player3"  // ← Advanced (was player2)
  }
}
```

### Performance Considerations

- **Array Filtering**: O(n) operation on gameOrder/turnOrder (acceptable for typical game sizes of 3-10 players)
- **Firestore Update**: Single atomic update operation
- **Real-time Sync**: All clients receive update via existing Firebase listeners
- **No Additional Queries**: Uses existing state references

---

## Design Decisions

### 1. Phase Restriction: Resolution/Results Only (NOT GAME_OVER)

**Decision**: ✅ Only allow dropping during RESOLUTION or RESULTS phases

**Rationale**:
- Active gameplay phases have complex dependencies (votes, selections, team formations)
- Resolution/results phases are transitional with minimal player interaction
- GAME_OVER excluded: game already complete, no value in dropping players
- Easier to handle turn advancement and state cleanup
- Reduces risk of breaking game flow

**Implementation**:
```typescript
const isValidPhase = currentPhase.toUpperCase().includes('RESULT') ||
                     currentPhase.toUpperCase().includes('RESOLUTION');
```

**Phase name variations** across games:
- `RESULTS`, `RESOLUTION`, `RESULT`
- `ROUND_RESULTS`, `FINAL_RESULTS`, `PRELIMINARY_RESULTS`
- Pattern matching handles all variations

---

### 2. Player Marking vs Deletion

**Decision**: ✅ Mark `player.dropped = true` instead of deleting

**Rationale**:
- **Data Preservation**: Keeps achievements and score for statistics
- **UI Compatibility**: Game over galleries need player data (avatars, names, stats)
- **Referential Integrity**: Prevents broken references in game state
- **Simpler Cleanup**: No cascade deletions needed

**Implementation**:
```typescript
// Mark as dropped
players[playerId].dropped = true;

// Update utility to exclude by default
export const getListOfPlayers = (
  players: Players,
  includeBots = false,
  butThese: UID[] = [],
  excludeDropped = true  // ← New parameter
): Player[] => {
  // Filter logic...
};
```

**Rejected Alternative**: Complete deletion
- Would break game over screens
- Would lose player achievements/statistics
- Would require cascade cleanup of all references

---

### 3. Minimum Player Validation

**Decision**: ✅ Block drop with error if below game minimum

**Implementation**:
```typescript
const activePlayers = utils.players.getListOfPlayers(players).filter(p => !p.dropped);

if (activePlayers.length - 1 < playerCounts.MIN) {
  throw new Error(
    `Cannot drop player: game requires minimum of ${playerCounts.MIN} players, ` +
    `only ${activePlayers.length - 1} would remain`
  );
}
```

**Rejected Alternatives**:
- **Option B**: Force GAME_OVER when below minimum → Too aggressive, removes host control
- **Option C**: Allow anyway → Could break game mechanics

---

### 4. Host-Only Permissions

**Decision**: ✅ Only host can drop players (not self)

**Rationale**:
- Prevents players from rage-quitting and disrupting game
- Maintains host control over game session
- Consistent with other admin actions (GO_TO_NEXT_PHASE, etc.)

**Implementation**:
- Backend validates via existing `hostEngine()` authentication
- Frontend UI only visible to host via `useHost()` hook
- Players cannot drop themselves (filtered from dropdown)

---

## Future Enhancements

### Priority 1: Post-MVP Improvements

1. **UI Indicator for Dropped Players**
   - Show "Left Early" badge in final results
   - Gray out avatar in player lists
   - Add icon indicator in rankings

2. **Reconnection Flow**
   - Allow dropped players to rejoin if they return
   - "Undo drop" action for accidental drops
   - Time window for reconnection (e.g., 5 minutes)

3. **Drop Notification**
   - Broadcast message to all players when someone is dropped
   - Toast notification: "Alice has left the game"

### Priority 2: Advanced Features

4. **Game-Specific Role Handling**
   - Hook system for games with special roles
   - Automatic role reassignment (judge → next player)
   - Custom drop validation per game

5. **Analytics & Logging**
   - Track drop frequency per game
   - Log drop events for debugging
   - Report most common drop scenarios

6. **Enhanced Phase Detection**
   - `isDroppablePhase` flag in phase definitions
   - Per-game allowlist configuration
   - More granular phase control

### Priority 3: Nice-to-Have

7. **Batch Operations**
   - Drop multiple players at once
   - "Clear inactive players" action

8. **Drop History**
   - Track who was dropped when
   - Include in game analytics

9. **Customizable Rules**
   - Game option: "Allow drop in any phase"
   - Minimum player override

---

## File Checklist

### Backend Files to Modify
- [ ] `functions/src/engine/host.ts` - Add dropPlayer action
- [ ] `functions/src/utils/players-utils.ts` - Update getListOfPlayers()
- [ ] `functions/src/types/common.d.ts` - Add dropped property to Player type (if needed)

### Frontend Files to Modify
- [ ] `src/services/adapters.ts` - Add DROP_PLAYER constant
- [ ] `src/components/admin/AdminMenuDrawer.tsx` - Add drop player UI

### Frontend Files to Create
- [ ] `src/components/host/DropPlayerControl.tsx` - Reusable component (optional)

### Reference Files (Read-Only)
- 📖 `functions/src/engine/galeria-de-sonhos/actions.ts` - Player skip/fallen pattern
- 📖 `functions/src/utils/turn-order-utils.ts` - Turn order management
- 📖 `functions/src/utils/firestore.ts` - State update patterns

---

## Questions & Answers

**Q: What happens to a dropped player's browser session?**
A: The player remains in the `state.players` object with `dropped: true`, so their UI will update via Firebase sync. They'll see they've been removed from active gameplay but can still view the game state.

**Q: Can a dropped player rejoin?**
A: Not in v1. This is a future enhancement. Currently, dropping is permanent for the session.

**Q: What if the host drops themselves?**
A: The UI prevents selecting the host. Backend should also validate and reject this.

**Q: What about games with bots?**
A: Bots are excluded by `getListOfPlayers()` type filter. The drop action only affects human players.

**Q: Does this work with the existing admin menu?**
A: Yes, it integrates seamlessly with the existing AdminMenuDrawer component.

**Q: How do I know which phases are safe to drop in?**
A: Use pattern matching on phase name (`includes('RESULT')` or `includes('RESOLUTION')`). Test thoroughly across different games.

---

## References

### Existing Patterns to Follow
1. **Host Actions**: `goToNextPhase()` in `functions/src/engine/host.ts:209`
2. **Player State Management**: `fallen` pattern in `functions/src/engine/galeria-de-sonhos/actions.ts:73-87`
3. **Turn Order Updates**: `getNextPlayerId()` in `functions/src/utils/turn-order-utils.ts:40`
4. **Admin UI**: `AdminMenuDrawer` in `src/components/admin/AdminMenuDrawer.tsx:90-150`

### Related Documentation
- [ONBOARD_GAME.md](ONBOARD_GAME.md) - Game onboarding process
- [GAME_CHECKLIST.md](GAME_CHECKLIST.md) - Game development checklist
- [.github/copilot-instructions.md](.github/copilot-instructions.md) - Coding standards

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-05-05 | 1.0 | Initial planning document |

---

## Notes

- This feature is designed for RESOLUTION/RESULTS phases only
- Player data is preserved (marked as `dropped: true`) not deleted
- Minimum player count is validated before drop
- GAME_OVER phase is excluded (no need to drop after game ends)
- Phase name detection uses pattern matching for flexibility

---

**Status**: 📋 Ready for Implementation

**Next Steps**:
1. Review plan with team
2. Begin Phase 1: Backend implementation
3. Test across multiple game types
4. Deploy to staging environment
5. Gather user feedback
