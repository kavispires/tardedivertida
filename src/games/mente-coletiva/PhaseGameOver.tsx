// Components

import { GameOverWrapper } from 'components/game-over';
import { Title } from 'components/text';
import { SheepAvatar } from './SheepAvatar';

function PhaseGameOver({ state, info }: PhaseProps) {
  return (
    <GameOverWrapper info={info} state={state} announcementIcon="the-end">
      <div className="m-game-over-in-memoriam">
        <Title>In memoriam</Title>
        <div className="m-sheep-rip">
          {state.losers.map((player: GamePlayer) => {
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

export default PhaseGameOver;
