// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { GameOverWrapper } from '@components/wrappers/GameOverWrapper';
// Internal
import type { PhaseGameOverState } from './utils/types';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
    >
      {/* <Achievements players={players} achievements={state.achievements} reference={achievementsReference} /> */}
      <TitledContainer
        title={
          <Translate
            pt="Dicionário"
            en="Dictionary"
          />
        }
        className="mt-4"
      >
        TBD
      </TitledContainer>
    </GameOverWrapper>
  );
}
