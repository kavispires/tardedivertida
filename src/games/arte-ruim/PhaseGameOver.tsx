// Utils
import { achievementsReference } from './utils/achievements';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { FinalGallery } from './components/FinalGallery';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon={<TrophyIcon />}
      rateWidgetCustomText={<Translate pt="Alguma sugestão de carta?" en="Any card suggestions?" />}
    >
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <FinalGallery players={players} drawings={state.drawings} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
