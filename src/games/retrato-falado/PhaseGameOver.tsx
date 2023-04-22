// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { Title } from 'components/text';
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { MonsterSketches } from './components/MonsterSketches';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  const canvasWidth = useCardWidth(6, 16, 150, 500);

  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<TrophyIcon />}>
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
