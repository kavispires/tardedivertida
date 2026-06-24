// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { GameOverWrapper } from '@components/wrappers/GameOverWrapper';
// Internal
import achievementsReference from './utils/achievements';
import type { DuetosGalleryEntry, PhaseGameOverState } from './utils/types';
import { Pair } from './components/Pair';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const gallery: DuetosGalleryEntry[] = state.gallery ?? [];

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
      <TitledContainer
        title={
          <Translate
            pt="Melhores Pares"
            en="Best Pairs"
          />
        }
        className="mt-4"
      >
        {gallery.map((pair: DuetosGalleryEntry, index) => (
          <Pair
            key={pair.pairId}
            index={index % 6}
            firstItem={pair.pair[0]}
            secondItem={pair.pair[1]}
            placeholder={pair.pair[0]}
          />
        ))}
      </TitledContainer>
    </GameOverWrapper>
  );
}
