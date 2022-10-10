// Utils
import { achievementsReference } from './utils/achievements';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { TrophyIcon } from 'components/icons/TrophyIcon';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
