import clsx from 'clsx';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { ClearOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Flex, Image } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
import type { SuspectCardData } from 'types/tdr';
// Hooks
import { useCache } from '@hooks/useCache';
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

type CharactersBoardProps = {
  characters: SuspectCardData[];
  players: GamePlayers;
  user: GamePlayer;
  revealCharacters?: boolean;
};

export function CharactersBoard({ characters, players, user, revealCharacters }: CharactersBoardProps) {
  const { cache, setCache, resetCache } = useCache<{ eliminated: Dictionary<boolean> }>({
    eliminated: {},
  });
  const [isPeeking, setIsPeeking] = useState(false);

  const cardWidth = useCardWidth(10, {
    gap: 16,
    minWidth: 80,
    maxWidth: 100,
    margin: 16,
  });

  const onToggleCharacterElimination = (characterId: UID) => {
    const isAlreadyEliminated = cache.eliminated[characterId];
    const newEliminated = { ...cache.eliminated };
    if (isAlreadyEliminated) {
      delete newEliminated[characterId];
    } else {
      newEliminated[characterId] = true;
    }
    setCache((prev) => ({ ...prev, eliminated: newEliminated }));
  };

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
            const wasEliminated = !isPeeking && !!cache.eliminated[suspect.id];
            const isOpponentCharacter = opponentsCharactersIds[suspect.id];
            return (
              <div
                className="t-characters-table__suspect"
                key={suspect.id}
              >
                <TransparentButton
                  onClick={() => onToggleCharacterElimination(suspect.id)}
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
          <Button icon={<ClearOutlined />}>
            <Translate
              pt="Limpar eliminações"
              en="Clear eliminations"
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
