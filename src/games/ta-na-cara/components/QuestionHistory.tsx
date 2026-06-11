import { Fragment } from 'react/jsx-runtime';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
import type { TestimonyQuestionCard } from 'types/tdr';
// Utils
import { sortPlayers } from 'utils/helpers';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxMinusIcon } from 'icons/BoxMinusIcon';
import { BoxPlusIcon } from 'icons/BoxPlusIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { Translate } from 'components/language/Translate';
import { PlayerAvatarCard } from 'components/player/PlayerAvatarCard';

type QuestionHistoryProps = {
  players: GamePlayers;
  questionsHistory: TestimonyQuestionCard[];
};

export function QuestionHistory({ players, questionsHistory }: QuestionHistoryProps) {
  const playersList = sortPlayers(players);

  if (questionsHistory.length === 0) {
    return null;
  }

  return (
    <div className="t-question-history-table">
      <div className="t-question-history-table__header">
        <Translate
          en="Questions"
          pt="Perguntas"
        />
      </div>
      {playersList.map((player) => (
        <PlayerAvatarCard
          key={player.id}
          player={player}
          size="small"
          withRoundCorners
          withName
        />
      ))}

      {questionsHistory.map((question, index) => (
        <Fragment key={`question-history-${index}`}>
          <div
            key={`question-history-${index}`}
            className="t-question-history-table__question"
          >
            {question.question}
          </div>
          {playersList.map((player) => {
            const answer = player.answers?.[index];
            switch (answer) {
              case -2: {
                return (
                  <Flex
                    key={`question-history-${index}-${player.id}`}
                    vertical
                    justify="center"
                    align="center"
                    className="t-question-history-table__answer"
                  >
                    <IconAvatar
                      icon={<BoxXIcon />}
                      size={24}
                    />
                    <div>
                      <Translate
                        pt="Não"
                        en="No"
                      />
                    </div>
                  </Flex>
                );
              }
              case -1: {
                return (
                  <Flex
                    vertical
                    justify="center"
                    align="center"
                    className="t-question-history-table__answer"
                  >
                    <IconAvatar
                      icon={<BoxMinusIcon color="#e8818c" />}
                      size={24}
                    />
                    <div>
                      <Translate
                        pt="Talvez Não"
                        en="Kinda No"
                      />
                    </div>
                  </Flex>
                );
              }
              case 1: {
                return (
                  <Flex
                    key={`question-history-${index}-${player.id}`}
                    vertical
                    justify="center"
                    align="center"
                    className="t-question-history-table__answer"
                  >
                    <IconAvatar
                      icon={<BoxPlusIcon color="#83d39c" />}
                      size={24}
                    />
                    <div>
                      <Translate
                        pt="Meio Sim"
                        en="Maybe Yes"
                      />
                    </div>
                  </Flex>
                );
              }
              case 2: {
                return (
                  <Flex
                    key={`question-history-${index}-${player.id}`}
                    vertical
                    justify="center"
                    align="center"
                    className="t-question-history-table__answer"
                  >
                    <IconAvatar
                      icon={<BoxCheckMarkIcon />}
                      size={24}
                    />
                    <div>
                      <Translate
                        pt="Sim"
                        en="Yes"
                      />
                    </div>
                  </Flex>
                );
              }
              default: {
                return (
                  <div
                    key={`question-history-${index}-${player.id}`}
                    className="t-question-history-table__answer"
                  >
                    -
                  </div>
                );
              }
            }
          })}
        </Fragment>
      ))}
    </div>
  );
}
