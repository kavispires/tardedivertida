// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { Translate } from '@components/language/Translate';
import { GameOverWrapper } from '@components/wrappers/GameOverWrapper';
// Internal
import { achievementsReference } from './utils/achievements';
import { FinalGallery } from './components/FinalGallery';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
      rateWidgetCustomText={
        <Translate
          pt="Alguma sugestão de carta?"
          en="Any card suggestions?"
        />
      }
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <FinalGallery
        players={players}
        drawings={state.drawings}
      />
    </GameOverWrapper>
  );
}
