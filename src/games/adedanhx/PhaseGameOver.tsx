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
import type { AdedanhxGalleryEntry } from './utils/types';
import { achievementsReference } from './utils/achievements';
import { FinalGalleryEntry } from './components/FinalGalleryEntry';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<CrownIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <TitledContainer
        title={<Translate pt="Respostas Mais Rápidas" en="Fastest Answers" />}
        contentProps={{ className: 'final-gallery' }}
      >
        {state.topAnswers.map((entry: AdedanhxGalleryEntry) => {
          return <FinalGalleryEntry entry={entry} key={entry.id} />;
        })}
      </TitledContainer>

      <TitledContainer
        title={<Translate pt="Sem Respostas" en="No Answers" />}
        contentProps={{ className: 'final-gallery' }}
      >
        {state.noAnswers.map((entry: AdedanhxGalleryEntry) => {
          return <FinalGalleryEntry entry={entry} key={entry.id} />;
        })}
      </TitledContainer>
    </GameOverWrapper>
  );
}
