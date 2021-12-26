// Components
import { GameOverWrapper, Title, Translate } from '../../components/shared';
import { useCardWidth } from '../../hooks';
import MonsterSketches from './MonsterSketches';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  const canvasWidth = useCardWidth(6, 16, 150, 500);

  return (
    <GameOverWrapper info={info} state={state} announcementIcon="trophy">
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
