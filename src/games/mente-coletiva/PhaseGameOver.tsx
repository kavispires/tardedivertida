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
import { Space } from 'antd';

function PhaseGameOver({ state, info, players }: PhaseProps) {
  return (
    <GameOverWrapper
      info={info}
      state={state}
      players={players}
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

      {Boolean(state.gallery) && (
        <>
          <Title size="x-small" level={3}>
            <Translate pt="Melhores Respostas" en="Best Answers" />
          </Title>
          <Space className="space-container gallery" wrap>
            {state.gallery.map(({ question, answers }: MGalleryEntry) => {
              return (
                <div className="gallery-entry" key={question.id}>
                  <h4 className="gallery-entry__question">
                    {question.prefix} {question.number} {question.suffix}
                  </h4>
                  {answers.map(({ answer, playerIds }) => {
                    return (
                      <div className="gallery-entry__answer" key={`${question.id}-${answer}`}>
                        <span>{answer}</span>
                        <span>
                          {playerIds.length} <Translate pt="jogadores" en="jogadores" />
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Space>
        </>
      )}
    </GameOverWrapper>
  );
}

export default PhaseGameOver;
