import clsx from 'clsx';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { ClearOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Flex, Image, Tooltip } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
import type { SuspectCardData, TestimonyStatementCardData } from 'types/tdr';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Utils
import { getBackgroundAvatarColorById } from '@utils/helpers';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { SuspectCard } from '@components/cards/SuspectCard';
import { Popconfirm } from '@components/general/Popconfirm';
import { ImageCard } from '@components/image-cards/ImageCard';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
// Internal
import { useCharacterEliminationCache } from '../utils/useCharacterEliminationCache';

type CharactersBoardProps = {
  characters: SuspectCardData[];
  players: GamePlayers;
  user: GamePlayer;
  revealCharacters?: boolean;
  questionsHistory: TestimonyStatementCardData[];
  disableEliminations?: boolean;
};

export function CharactersBoard({
  characters,
  players,
  user,
  revealCharacters,
  questionsHistory,
  disableEliminations,
}: CharactersBoardProps) {
  const {
    eliminations,
    generalEliminations,
    showInferredEliminations,
    onUpdateElimination,
    resetCache,
    activeStatementId,
  } = useCharacterEliminationCache();

  const [isPeeking, setIsPeeking] = useState(false);

  const cardWidth = useCardWidth(10, {
    gap: 16,
    minWidth: 80,
    maxWidth: 100,
    margin: 16,
  });

  const opponentsCharactersIds = useMemo(() => {
    if (!revealCharacters) return {};

    return Object.values(players)
      .filter((player) => player.id !== user.id)
      .reduce(
        (acc, player) => {
          acc[player.secretCharacterId] = player.id;
          return acc;
        },
        {} as Dictionary<UID>,
      );
  }, [players, user.id, revealCharacters]);

  const activeStatementTooltip = useMemo(() => {
    if (!activeStatementId) return '';
    const activeStatement = questionsHistory.find((question) => question.id === activeStatementId);
    return activeStatement ? `${activeStatement.statement}?` : '';
  }, [activeStatementId, questionsHistory]);

  return (
    <Flex
      vertical
      gap={12}
    >
      <div className="t-characters-table">
        <Image.PreviewGroup>
          {characters.map((suspect) => {
            // const wasEliminated = eliminatedSuspects.includes(suspect.id);
            const isUserCharacter = user.secretCharacterId === suspect.id;
            const wasEliminated =
              !isPeeking && (!!eliminations[suspect.id] || !!generalEliminations[suspect.id]);
            const isOpponentCharacter = opponentsCharactersIds[suspect.id];
            const canEliminate =
              !isUserCharacter &&
              !showInferredEliminations &&
              !disableEliminations &&
              questionsHistory.length > 0;
            return (
              <div
                className="t-characters-table__suspect"
                key={suspect.id}
              >
                <Tooltip title={activeStatementTooltip}>
                  <TransparentButton
                    onClick={canEliminate ? () => onUpdateElimination(suspect.id) : undefined}
                    hoverType="tint"
                  >
                    {wasEliminated ? (
                      <ImageCard
                        cardId="us-00"
                        preview={false}
                        className={clsx(
                          't-characters-table__suspect-image',
                          't-characters-table__suspect-image--eliminated',
                          isUserCharacter && 't-characters-table__suspect-image--active',
                        )}
                        cardWidth={cardWidth}
                      />
                    ) : (
                      <SuspectCard
                        suspect={suspect}
                        width={cardWidth}
                        preview={false}
                        className={clsx(
                          't-characters-table__suspect-image',
                          isUserCharacter && 't-characters-table__suspect-image--active',
                        )}
                        visibleContent={{ deckIcon: true }}
                      />
                    )}

                    {isUserCharacter && (
                      <span
                        className="t-characters-table__culprit-badge"
                        style={getBackgroundAvatarColorById(user.avatarId)}
                      >
                        <Translate
                          pt="Você"
                          en="You"
                        />
                      </span>
                    )}
                    {isOpponentCharacter && (
                      <span
                        className="t-characters-table__culprit-badge"
                        style={getBackgroundAvatarColorById(
                          players[opponentsCharactersIds[suspect.id]].avatarId,
                        )}
                      >
                        <PlayerAvatarName
                          player={players[opponentsCharactersIds[suspect.id]]}
                          size="small"
                          contrastText
                        />
                      </span>
                    )}
                  </TransparentButton>
                </Tooltip>
              </div>
            );
          })}
        </Image.PreviewGroup>
      </div>
      <Flex
        justify="center"
        gap={6}
      >
        <Popconfirm
          title={
            <Translate
              pt="Tem certeza que deseja limpar todas as eliminações?"
              en="Are you sure you want to clear all eliminations?"
            />
          }
          onConfirm={resetCache}
        >
          <Button
            icon={<ClearOutlined />}
            disabled={disableEliminations}
          >
            <Translate
              pt="Limpar tudo"
              en="Clear all"
            />
          </Button>
        </Popconfirm>

        <Button
          icon={<EyeOutlined />}
          onMouseEnter={() => setIsPeeking(true)}
          onMouseLeave={() => setIsPeeking(false)}
        >
          <Translate
            en="Peek all characters"
            pt="Espiar todos os personagens"
          />
        </Button>
      </Flex>
    </Flex>
  );
}
