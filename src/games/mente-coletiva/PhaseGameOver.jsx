import PropTypes from 'prop-types';
// Components
import { GameOverWrapper, Title } from '../../components/shared';
import { SheepAvatar } from '../../components/avatars';

function PhaseGameOver({ state, info }) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon="the-end">
      <div className="m-game-over-in-memoriam">
        <Title>In memoriam</Title>
        <div className="m-sheep-rip">
          {state.losers.map((player) => {
            return (
              <div className="m-sheep-rip__entry" key={`sheep-player-1`}>
                <SheepAvatar id={player.avatarId} width={80} />
                <span className="m-sheep-rip__name">{player.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </GameOverWrapper>
  );
}

PhaseGameOver.propTypes = {
  info: PropTypes.any,
  state: PropTypes.shape({
    winners: PropTypes.array,
    losers: PropTypes.array,
    phase: PropTypes.string,
    round: PropTypes.shape({
      current: PropTypes.number,
      total: PropTypes.number,
    }),
  }),
};

export default PhaseGameOver;
