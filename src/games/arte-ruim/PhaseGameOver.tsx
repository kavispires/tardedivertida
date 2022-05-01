// Components
import { CanvasSVG } from 'components/canvas';
import { GameOverWrapper } from 'components/game-over';
import { Translate } from 'components/language';
import { DrawingGrade } from './components/DrawingGrade';

function PhaseGameOver({ state, players, info }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon="trophy">
      <ul className="a-game-over__gallery">
        {state.drawings.map((entry: ArteRuimDrawing) => {
          return (
            <li className="a-game-over__gallery-item" key={entry.drawing} style={{ width: '200px' }}>
              <CanvasSVG drawing={entry.drawing} size={200} className="a-game-over__gallery-canvas" />
              <span className="a-game-over__credits">
                "{entry.text}" <Translate pt="por" en="by" /> {players[entry.playerId].name}
              </span>
              <DrawingGrade value={entry.successRate ?? 0} />
            </li>
          );
        })}
      </ul>
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
