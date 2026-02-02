import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
// Types
import type { GameState } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Internal
import type { FofocaQuenteDefaultState } from '../utils/types';
import { ACTION_TYPES, FOFOCA_QUENTE_PHASES } from '../utils/constants';
import { useIntimidate, useRumoring } from '../utils/hooks';
import { StudentModal } from './StudentModal';

type FofocaQuenteContextType = {
  isTheGossiperPlayer: boolean;
  isTheDetectivePlayer: boolean;
  activeModalStudentId: string | null;
  onOpenStudentModal: (studentId: string | null) => void;
  detectiveLocationIndex: number | null;
  onSetDetectiveLocation: (locationId: number) => void;
  intimidation: {
    currentIntimidations: string[];
    onSubmitIntimidation: (studentId: string) => void;
  };
  permissions: {
    canMoveDetective: boolean;
  };
};

const FofocaQuenteContext = createContext<FofocaQuenteContextType>({
  isTheGossiperPlayer: false,
  isTheDetectivePlayer: false,
  activeModalStudentId: null,
  onOpenStudentModal: () => {},
  detectiveLocationIndex: null,
  onSetDetectiveLocation: () => {},
  intimidation: {
    currentIntimidations: [],
    onSubmitIntimidation: () => {},
  },
  permissions: {
    canMoveDetective: false,
  },
});

type FofocaQuenteProviderProps = {
  state: GameState<FofocaQuenteDefaultState>;
  players: GamePlayers;
  user: GamePlayer;
  children: ReactNode;
};

/**
 * Provider component for Fofoca Quente game context
 */
export function FofocaQuenteProvider({ state, players, user: _user, children }: FofocaQuenteProviderProps) {
  const [_gossiper, isTheGossiperPlayer] = useWhichPlayerIsThe('gossiperPlayerId', state, players);
  const [detective, isTheDetectivePlayer] = useWhichPlayerIsThe('detectivePlayerId', state, players);

  const [activeModalStudentId, onOpenStudentModal] = useState<string | null>(null);
  const [detectiveLocationIndex, onSetDetectiveLocation] = useState<number | null>(
    detective?.locationId ?? null,
  );

  // ACTION: INTIMIDATION
  const intimidation = useIntimidate(state.maxIntimidations ?? 0);
  // ACTION: RUMOR
  const rumor = useRumoring();

  // ACTION: INVESTIGATION

  const permissions = {
    canMoveDetective:
      isTheDetectivePlayer && ([FOFOCA_QUENTE_PHASES.BOARD_SETUP] as string[]).includes(state.phase),
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: only the phase is needed
  const actionObject = useMemo(() => {
    if (state.phase === FOFOCA_QUENTE_PHASES.INTIMIDATION) {
      if (isTheGossiperPlayer) {
        return {
          actionType: ACTION_TYPES.INTIMIDATE,
          onPerformAction: intimidation.onSubmitIntimidation,
        };
      }
      return {};
    }
    if (state.phase === FOFOCA_QUENTE_PHASES.RUMOR) {
      if (isTheGossiperPlayer) {
        return {
          actionType: ACTION_TYPES.RUMOR,
          onPerformAction: (studentId: string, additionalData?: PlainObject) => {
            const rumorIndex = additionalData?.rumorIndex;
            if (typeof rumorIndex !== 'number') {
              console.error('Invalid rumor index');
              return;
            }
            rumor.onSubmitRumor(studentId, rumorIndex);
          },
          actionData: {
            possibleRumors: state.possibleRumors || [],
          },
        };
      }
      return {};
    }

    return {};
  }, [state.phase, isTheGossiperPlayer]);

  return (
    <FofocaQuenteContext.Provider
      value={{
        isTheGossiperPlayer,
        isTheDetectivePlayer,
        activeModalStudentId,
        onOpenStudentModal,
        detectiveLocationIndex,
        onSetDetectiveLocation,
        intimidation,
        permissions,
      }}
    >
      {children}

      {activeModalStudentId && (
        <StudentModal
          student={state.students[activeModalStudentId]}
          socialGroups={state.socialGroups}
          gossiperId={state.gossiperId}
          bestFriendId={state.bestFriendId}
          closeModal={() => onOpenStudentModal(null)}
          showSecrets={isTheGossiperPlayer}
          {...actionObject}
        />
      )}
    </FofocaQuenteContext.Provider>
  );
}

/**
 * Hook to access Fofoca Quente game context
 */
export function useFofocaQuenteContext() {
  const context = useContext(FofocaQuenteContext);
  if (context === undefined) {
    throw new Error('useFofocaQuenteContext must be used within a FofocaQuenteProvider');
  }
  return context;
}
