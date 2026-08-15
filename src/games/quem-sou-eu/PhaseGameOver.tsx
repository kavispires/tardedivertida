import { orderBy } from 'lodash';
// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
// Internal
import type { FinalCharacterEntry, PhaseGameOverState } from './utils/types';
import { achievementsReference } from './utils/achievements';
import { FinalCharacter } from './components/FinalCharacter';

export function PhaseGameOver({ state, players, meta }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <SpaceContainer wrap>
        {orderBy(state.gallery, `name.${meta.language}`).map((entry: FinalCharacterEntry) => (
          <FinalCharacter
            players={players}
            character={entry}
            glyphWidth={30}
            key={entry.id}
            imageCardsMode={!!meta.options?.imageCardsMode}
          />
        ))}
      </SpaceContainer>
    </GameOverWrapper>
  );
}
