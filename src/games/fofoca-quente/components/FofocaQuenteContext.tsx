import { createContext, type ReactNode, useContext, useState } from 'react';
// Types
import type { GameState } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Internal
import type { FofocaQuenteDefaultState } from '../utils/types';
import { FOFOCA_QUENTE_PHASES } from '../utils/constants';
import { StudentModal } from './StudentModal';

type FofocaQuenteContextType = {
  isTheGossiperPlayer: boolean;
  isTheDetectivePlayer: boolean;
  activeModalStudentId: string | null;
  onOpenStudentModal: (studentId: string | null) => void;
  detectiveLocationIndex: number | null;
  onSetDetectiveLocation: (locationId: number) => void;
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
export function FofocaQuenteProvider({ state, players, user, children }: FofocaQuenteProviderProps) {
  const [, isTheGossiperPlayer] = useWhichPlayerIsThe('gossiperPlayerId', state, players);
  const [, isTheDetectivePlayer] = useWhichPlayerIsThe('detectivePlayerId', state, players);

  const [activeModalStudentId, onOpenStudentModal] = useState<string | null>(null);
  const [detectiveLocationIndex, onSetDetectiveLocation] = useState<number | null>(null);

  const permissions = {
    canMoveDetective:
      isTheDetectivePlayer && ([FOFOCA_QUENTE_PHASES.BOARD_SETUP] as string[]).includes(state.phase),
  };

  return (
    <FofocaQuenteContext.Provider
      value={{
        isTheGossiperPlayer,
        isTheDetectivePlayer,
        activeModalStudentId,
        onOpenStudentModal,
        detectiveLocationIndex,
        onSetDetectiveLocation,
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
          showSecrets={user.role === 'gossiper'}
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
