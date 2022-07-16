// Hooks
import { GameOverWrapper } from 'components/game-over';
import { TrophyIcon } from 'components/icons/TrophyIcon';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { useCardWidth } from 'hooks';
// Components
import { MonsterSketches } from './components/MonsterSketches';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  const canvasWidth = useCardWidth(6, 16, 150, 500);

  return (
    <GameOverWrapper info={info} state={state} announcementIcon={<TrophyIcon />}>
      <div>
        <Title level={2}>
          <Translate pt="Desenhos" en="Sketches" />
        </Title>
        <div className="r-gallery">
          <MonsterSketches
            sketches={state.gallery}
            players={players}
            canvasSize={canvasWidth}
            canvasWidth={canvasWidth}
          />
        </div>
      </div>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
