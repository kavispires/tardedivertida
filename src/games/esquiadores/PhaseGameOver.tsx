// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import achievementsReference from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { Mountain } from './components/Mountain';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  const gallery = state.gallery ?? [];

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
            pt="Montanhas Pares"
            en="Best Pairs"
          />
        }
        className="mt-4"
        contentProps={{ direction: 'vertical' }}
      >
        {gallery.map((entry) => (
          <Mountain
            key={entry.id}
            mountain={entry.mountain}
            skier={players[entry.skierId]}
            animateFrom={0}
            animateTo={null}
            showLevel={10}
          />
        ))}
      </TitledContainer>
    </GameOverWrapper>
  );
}
