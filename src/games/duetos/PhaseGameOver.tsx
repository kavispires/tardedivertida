// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { Container } from 'components/layout/Container';
// Internal
import achievementsReference from './utils/achievements';
import type { DuetosGalleryEntry } from './utils/types';
import { Pair } from './components/Pair';

export function PhaseGameOver({ state, players }: PhaseProps) {
  const gallery: DuetosGalleryEntry[] = state.gallery ?? [];

  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
      <Container title={<Translate pt="Melhores Pares" en="Best Pairs" />} className="mt-4">
        {gallery.map((pair: DuetosGalleryEntry, index) => (
          <Pair
            key={pair.pairId}
            index={index % 6}
            firstItem={pair.pair[0]}
            secondItem={pair.pair[1]}
            placeholder={pair.pair[0]}
          />
        ))}
      </Container>
    </GameOverWrapper>
  );
}
