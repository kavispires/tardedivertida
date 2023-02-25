// Utils
import { achievementsReference } from './utils/achievements';
// Icons
import { TheEndIcon } from 'icons/TheEndIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { SheepAvatar } from './components/SheepAvatar';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      announcementIcon={<TheEndIcon />}
      rateWidgetCustomText={<Translate pt="Sugira uma pergunta:" en="Suggest a question:" />}
    >
      <div className="m-game-over-in-memoriam">
        <Title>In memoriam</Title>
        <div className="m-sheep-rip">
          {state.losers.map((player: GamePlayer) => {
            return (
              <div className="m-sheep-rip__entry" key={`sheep-player-1`}>
                <SheepAvatar id={player.avatarId} width={80} sheepId={player.sheepId} />
                <span className="m-sheep-rip__name">{player.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
