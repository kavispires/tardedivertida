// Types
import type { PhaseProps } from 'types/game';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import { achievementsReference } from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { GalleryCategoryEntry } from './components/GalleryCategoryEntry';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<CrownIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <TitledContainer
        title={<Translate pt="Melhores Quesitos" en="Best Categories" />}
        contentProps={{ className: 'final-gallery' }}
      >
        {state.gallery.map((entry, index) => (
          <GalleryCategoryEntry key={index} entry={entry} players={players} cardsDict={state.cardsDict} />
        ))}
      </TitledContainer>
    </GameOverWrapper>
  );
}
