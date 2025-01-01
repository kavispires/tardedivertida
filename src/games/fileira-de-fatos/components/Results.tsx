import clsx from 'clsx';
// Ant Design Resources
import { Space, Avatar as AntAvatar, Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAvatarColorById, sortPlayers } from 'utils/helpers';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { StarIcon } from 'icons/StarIcon';
// Components
import { Avatar, AvatarName, AvatarStrip, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';

type ResultsProps = {
  players: GamePlayers;
  activePlayerId: PlayerId;
  correctOrder: CardId[];
  scenarioDictionary: Record<CardId, TextCard>;
  roundType: string;
};

export function Results({ players, activePlayerId, correctOrder, roundType }: ResultsProps) {
  const width = useCardWidth(8, {
    gap: 16,
    minWidth: 100,
    maxWidth: 200,
    margin: 32,
  });

  const listOfPLayers = sortPlayers(players).filter((player) => player.id !== activePlayerId);

  return (
    <SpaceContainer vertical>
      {listOfPLayers.map((player) => (
        <Space className="scenarios-results" key={player.id}>
          <AvatarStrip player={player} />
          {player.currentOrder.map((cardId: CardId, index: number) => {
            const isCorrect = correctOrder[index] === cardId;
            const backgroundColor = isCorrect ? { backgroundColor: getAvatarColorById(player.avatarId) } : {};
            return (
              <div
                key={`position-${index}`}
                className={clsx('scenario', !isCorrect && 'scenario__incorrect-result')}
                style={{ width: `${width}px`, ...backgroundColor }}
              >
                {isCorrect ? (
                  <span>
                    <Avatar id={player.avatarId} alt={player.name} size="small" />{' '}
                    <PositiveStarPoints roundType={roundType} position={index + 1} />
                  </span>
                ) : (
                  <span>
                    <Tooltip
                      title={
                        <Translate
                          pt={
                            <>
                              <AvatarName player={player} addressUser size="small" /> achou que esse cenário
                              era na posição #{correctOrder.indexOf(cardId) + 1}
                            </>
                          }
                          en={
                            <>
                              <AvatarName player={player} addressUser size="small" /> thought this scenario
                              would go in position #{correctOrder.indexOf(cardId) + 1}
                            </>
                          }
                        />
                      }
                    >
                      <AntAvatar size="small">{correctOrder.indexOf(cardId) + 1}</AntAvatar>
                    </Tooltip>
                    <NegativeStarPoints roundType={roundType} position={index + 1} />
                  </span>
                )}
              </div>
            );
          })}
          <AvatarStrip player={player} />
        </Space>
      ))}
    </SpaceContainer>
  );
}

function TripleStar() {
  return (
    <>
      <IconAvatar icon={<StarIcon />} size="small" />
      <IconAvatar icon={<StarIcon />} size="small" />
      <IconAvatar icon={<StarIcon />} size="small" />
    </>
  );
}

type PositiveStarPointsProps = {
  roundType: string;
  position: number;
};

function PositiveStarPoints({ roundType, position }: PositiveStarPointsProps) {
  if (roundType === 'SECOND_POSITION' && position === 2) {
    return <TripleStar />;
  }
  if (roundType === 'CENTER_POSITION' && position === 3) {
    return <TripleStar />;
  }
  if (roundType === 'FOURTH_POSITION' && position === 4) {
    return <TripleStar />;
  }

  return <IconAvatar icon={<StarIcon />} size="small" />;
}

type NegativeStarPointsProps = {
  roundType: string;
  position: number;
};

function NegativeStarPoints({ roundType, position }: NegativeStarPointsProps) {
  if (roundType === 'CURSED_FIRST_POSITION' && position === 1) {
    return <IconAvatar icon={<BoxXIcon />} size="small" />;
  }
  if (roundType === 'CURSED_LAST_POSITION' && position === 5) {
    return <IconAvatar icon={<BoxXIcon />} size="small" />;
  }

  return <></>;
}
