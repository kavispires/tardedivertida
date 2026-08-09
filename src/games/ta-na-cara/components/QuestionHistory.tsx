import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
// Ant Design Resources
import { Flex, Switch } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
import type { TestimonyStatementCardData } from 'types/tdr';
// Hooks
import { useSortedPlayers } from '@hooks/useSortedPlayers';
// Icons
import { BoxCheckMarkIcon } from '@icons/BoxCheckMarkIcon';
import { BoxMinusIcon } from '@icons/BoxMinusIcon';
import { BoxPlusIcon } from '@icons/BoxPlusIcon';
import { BoxXIcon } from '@icons/BoxXIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarCard } from '@components/player/PlayerAvatarCard';

type QuestionHistoryProps = {
  user: GamePlayer;
  players: GamePlayers;
  questionsHistory: TestimonyStatementCardData[];
};

export function QuestionHistory({ players, questionsHistory, user }: QuestionHistoryProps) {
  const [showAll, setShowAll] = useState(false);
  const { targetPlayerId } = user;
  const sortedPlayersList = useSortedPlayers(players, {
    prioritizePlayerId: [targetPlayerId ?? user.id, user.id],
  });

  if (questionsHistory.length === 0) {
    return null;
  }

  const list: GamePlayer[] = showAll ? sortedPlayersList : sortedPlayersList.slice(0, 2);

  return (
    <Flex
      orientation="vertical"
      gap={8}
    >
      {sortedPlayersList.length > 2 && (
        <Flex
          justify="center"
          align="center"
          gap={8}
          className="t-question-history"
        >
          <Translate
            en="Show all players"
            pt="Mostrar todos os jogadores"
          />
          <Switch
            checked={showAll}
            onChange={() => setShowAll(!showAll)}
          />
        </Flex>
      )}
      <div
        className="t-question-history-table"
        style={{ gridTemplateColumns: `2fr repeat(${list.length}, auto)` }}
      >
        <div className="t-question-history-table__header">
          <Translate
            en="Questions"
            pt="Perguntas"
          />
        </div>
        {list.map((player) => (
          <PlayerAvatarCard
            key={`question-history-${player.id}`}
            player={player}
            size="small"
            withRoundCorners
            withName
            addressUser
          />
        ))}

        {questionsHistory.map((question, index) => (
          <Fragment key={`question-history-${question.id}-${index}`}>
            <div className="t-question-history-table__question">{question.statement}</div>
            {list.map((player) => {
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
                      <Icon
                        icon={<BoxXIcon />}
                        size={24}
                      />
                      <div className="text-center">
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
                      key={`question-history-${index}-${player.id}`}
                      vertical
                      justify="center"
                      align="center"
                      className="t-question-history-table__answer"
                    >
                      <Icon
                        icon={<BoxMinusIcon color="#e8818c" />}
                        size={24}
                      />
                      <div className="text-center">
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
                      <Icon
                        icon={<BoxPlusIcon color="#83d39c" />}
                        size={24}
                      />
                      <div className="text-center">
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
                      <Icon
                        icon={<BoxCheckMarkIcon />}
                        size={24}
                      />
                      <div className="text-center">
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
    </Flex>
  );
}
