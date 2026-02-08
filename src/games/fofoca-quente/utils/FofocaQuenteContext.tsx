import { createContext, useContext, useMemo, useState } from 'react';
// Types
import type { PhaseProviderProps } from 'types/game';
// Hooks
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Internal
import { StudentModal } from '../components/StudentModal';
import { Info } from '../components/Info';
import type { FofocaQuenteDefaultState } from './types';
import { ACTION_TYPES, FOFOCA_QUENTE_PHASES } from './constants';
import { useIntimidate, useRumoring } from './hooks';

type FofocaQuenteContextType = {
  students: FofocaQuenteDefaultState['students'];
  schoolBoard: FofocaQuenteDefaultState['schoolBoard'];
  socialGroups: FofocaQuenteDefaultState['socialGroups'];
  staff: FofocaQuenteDefaultState['staff'];
  motivations: FofocaQuenteDefaultState['motivations'];
  gossiperId: string;
  bestFriendId: string;
  isTheGossiperPlayer: boolean;
  isTheDetectivePlayer: boolean;
  activeModalStudentId: string | null;
  onOpenStudentModal: (studentId: string | null) => void;
  detectiveLocationIndex: number | null;
  onSetDetectiveLocation: (locationIndex: number) => void;
  intimidation: {
    currentIntimidations: string[];
    onSubmitIntimidation: (studentId: string) => void;
  };
  permissions: {
    canMoveDetective: boolean;
  };
};

const FofocaQuenteContext = createContext<FofocaQuenteContextType>({
  students: {},
  schoolBoard: [],
  socialGroups: {},
  staff: {},
  motivations: [],
  gossiperId: '',
  bestFriendId: '',
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

/**
 * Provider component for Fofoca Quente game context
 */
export function FofocaQuenteProvider({
  state,
  players,
  user: _user,
  children,
}: PhaseProviderProps<FofocaQuenteDefaultState>) {
  const [_gossiper, isTheGossiperPlayer] = useWhichPlayerIsThe('gossiperPlayerId', state, players);
  const [detective, isTheDetectivePlayer] = useWhichPlayerIsThe('detectivePlayerId', state, players);

  const [activeModalStudentId, onOpenStudentModal] = useState<string | null>(null);
  const [detectiveLocationIndex, onSetDetectiveLocation] = useState<number | null>(
    detective?.locationIndexes?.at(-1) ?? null,
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
        students: state.students ?? {},
        schoolBoard: state.schoolBoard ?? [],
        socialGroups: state.socialGroups ?? [],
        staff: state.staff ?? [],
        motivations: state.motivations ?? [],
        gossiperId: state.gossiperId || '',
        bestFriendId: state.bestFriendId || '',
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

      <Info
        students={state.students}
        socialGroups={state.socialGroups}
        motivations={state.motivations ?? []}
        phase={state.phase}
      />
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
