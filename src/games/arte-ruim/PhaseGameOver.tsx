// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { GameOverWrapper } from '@components/game-over/GameOverWrapper';
import { Achievements } from '@components/general/Achievements';
import { Translate } from '@components/language/Translate';
// Internal
import { achievementsReference } from './utils/achievements';
import { FinalGallery } from './components/FinalGallery';

function PhaseGameOver({ state, players }: PhaseProps) {
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

export default PhaseGameOver;
