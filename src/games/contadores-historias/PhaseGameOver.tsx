// Utils
import { achievementsReference } from './utils/achievements';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
