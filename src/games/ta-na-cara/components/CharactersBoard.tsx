import clsx from 'clsx';
import { type JSX, useMemo } from 'react';
// Ant Design Resources
import { Button, Flex, Image, Tooltip } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
import type { SuspectCard } from 'types/tdr';
// Hooks
import { useCacheV2 } from 'hooks/useCacheV2';
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAvatarColorById } from 'utils/helpers';
// Icons
import { AgeAdultIcon } from 'icons/AgeAdultIcon';
import { AgeChildIcon } from 'icons/AgeChildIcon';
import { AgeTeenIcon } from 'icons/AgeTeenIcon';
import { PetIcon } from 'icons/PetIcon';
import { QuestionIcon } from 'icons/QuestionIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { TransparentButton } from 'components/buttons/TransparentButton';
import { Popconfirm } from 'components/general/Popconfirm';
import { ImageCard } from 'components/image-cards/ImageCard';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';

type CharactersBoardProps = {
  characters: SuspectCard[];
  players: GamePlayers;
  user: GamePlayer;
  revealCharacters?: boolean;
};

export function CharactersBoard({ characters, players, user, revealCharacters }: CharactersBoardProps) {
  const { cache, setCache, resetCache } = useCacheV2<{ eliminated: Dictionary<boolean> }>({
    eliminated: {},
  });

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
            const wasEliminated = !!cache.eliminated[suspect.id];
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
                  {!wasEliminated && <DeckType deck={suspect.deck} />}
                  <ImageCard
                    cardId={wasEliminated ? 'us-00' : suspect.id}
                    preview={false}
                    className={clsx(
                      't-characters-table__suspect-image',
                      isUserCharacter && 't-characters-table__suspect-image--active',
                    )}
                    cardWidth={cardWidth}
                  />
                  {isUserCharacter && (
                    <span
                      className="t-characters-table__culprit-badge"
                      style={{
                        backgroundColor: getAvatarColorById(players[user.id].avatarId),
                        color: `contrast-color(${getAvatarColorById(players[user.id].avatarId)})`,
                      }}
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
                      style={{
                        backgroundColor: getAvatarColorById(
                          players[opponentsCharactersIds[suspect.id]].avatarId,
                        ),
                        color: `contrast-color(${getAvatarColorById(players[user.id].avatarId)})`,
                      }}
                    >
                      <PlayerAvatarName
                        player={players[opponentsCharactersIds[suspect.id]]}
                        size="small"
                      />
                    </span>
                  )}
                  {!wasEliminated && (
                    <div className="t-characters-table__suspect-name">
                      <DualTranslate>{suspect.name}</DualTranslate>
                    </div>
                  )}
                </TransparentButton>
              </div>
            );
          })}
        </Image.PreviewGroup>
      </div>
      <Flex justify="center">
        <Popconfirm
          title={
            <Translate
              pt="Tem certeza que deseja limpar todas as eliminações?"
              en="Are you sure you want to clear all eliminations?"
            />
          }
          onConfirm={resetCache}
        >
          <Button>
            <Translate
              pt="Limpar eliminações"
              en="Clear eliminations"
            />
          </Button>
        </Popconfirm>
      </Flex>
    </Flex>
  );
}

function DeckType({ deck }: Pick<SuspectCard, 'deck'>) {
  const iconMap: Dictionary<{ icon: JSX.Element; title: DualLanguageValue }> = {
    kid: {
      icon: <AgeChildIcon />,
      title: { pt: 'Criança', en: 'Child' },
    },
    teen: {
      icon: <AgeTeenIcon />,
      title: { pt: 'Adolescente', en: 'Teen' },
    },
    adult: {
      icon: <AgeAdultIcon />,
      title: { pt: 'Adulto', en: 'Adult' },
    },
    pet: {
      icon: <PetIcon />,
      title: { pt: 'Animal de estimação', en: 'Pet' },
    },
    other: {
      icon: <QuestionIcon />,
      title: { pt: 'Outro', en: 'Other' },
    },
  };

  const entry = iconMap?.[deck ?? 'other'] ?? iconMap.other;

  return (
    <span className="t-characters-table__deck-type">
      <Tooltip title={<DualTranslate>{entry.title}</DualTranslate>}>
        <IconAvatar
          size="small"
          icon={entry.icon}
          shape="circle"
          className="t-characters-table__deck-type-icon"
        />
      </Tooltip>
    </span>
  );
}
