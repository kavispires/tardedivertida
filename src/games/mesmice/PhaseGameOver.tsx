// Types
import type { PhaseProps } from 'types/game';
import type { MesmiceGalleryEntry } from './utils/types';
// Utils
import { achievementsReference } from './utils/achievements';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Container } from 'components/general/Container';
import { Translate } from 'components/language';
import { FinalGalleryEntry } from './components/FinalGalleryEntry';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<CrownIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Container
        title={<Translate pt="Objetos, Dicas e Características" en="Objects, Clues and Features" />}
        contentProps={{ className: 'final-gallery' }}
      >
        {state.gallery.map((entry: MesmiceGalleryEntry) => {
          return (
            <FinalGalleryEntry
              key={`${entry.playerId}-${entry.item.id}`}
              entry={entry}
              features={state.features}
              players={players}
            />
          );
        })}
      </Container>
    </GameOverWrapper>
  );
}
