// Ant Design Resources
import { Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
import type { GamePlayer } from 'types/player';
// Icons
import { TheEndIcon } from 'icons/TheEndIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import type { GalleryEntry } from './utils/types';
import { achievementsReference } from './utils/achievements';
import { SheepAvatar } from './components/SheepAvatar';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper
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
            {state.gallery.map(({ question, answers }: GalleryEntry) => {
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
                          {playerIds.length} <Translate pt="jogadores" en="players" />
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
