import clsx from 'clsx';
// Ant Design Resources
import { Avatar, Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Icons
import { ArrowIcon } from '@icons/ArrowIcon';
import { SnowFlakeIcon } from '@icons/SnowFlakeIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { PlayerAvatarCard } from '@components/player/PlayerAvatarCard';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { RunActivity, RunnerCard } from '../utils/types';
import { RunCard } from './RunCard';

type CardPlayProps = {
  runActivity: RunActivity;
  players: GamePlayers;
  cardsDict: Dictionary<RunnerCard>;
  lockedPlayersIds?: UID[];
  ongoingPlusOnePlayersIds?: UID[];
  ongoingMinusOnePlayersIds?: UID[];
};

export function CardPlay({
  runActivity,
  players,
  cardsDict,
  lockedPlayersIds = [],
  ongoingPlusOnePlayersIds = [],
  ongoingMinusOnePlayersIds = [],
}: CardPlayProps) {
  const card = runActivity.cardId ? cardsDict[runActivity.cardId] : null;

  if (!card) return null;

  const isTargetLocked = lockedPlayersIds.includes(runActivity.targetId);

  return (
    <RuleInstruction
      type="event"
      key={runActivity.id}
      className={getAnimationClass('tada')}
    >
      <div className="card-play-container">
        <PlayerAvatarCard
          player={players[runActivity.playerId]}
          withName
          withRoundCorners
          size="small"
        />

        <Flex
          vertical
          gap={6}
          align="center"
        >
          <Icon icon={<ArrowIcon />} />
          <Translate
            en="played"
            pt="jogou"
          />
        </Flex>

        <div className="card-play-container__section-container">
          <RunCard card={card} />

          {runActivity.newValue && runActivity.newValue > 0 && (
            <PositiveValue
              value={runActivity.newValue}
              className="card-play-container__new-value"
            />
          )}
          {runActivity.newValue && runActivity.newValue < 0 && (
            <NegativeValue
              value={runActivity.newValue}
              className="card-play-container__new-value"
            />
          )}
        </div>

        <Flex
          vertical
          gap={6}
          align="center"
          className={clsx({ 'card-play-container__invisible': card.omitsTarget })}
        >
          <Icon icon={<ArrowIcon />} />
          <Translate
            en="on"
            pt="em"
          />
        </Flex>

        <div className="card-play-container__section-container">
          {isTargetLocked && (
            <div
              className={clsx('card-play-container__locked-overlay', {
                'card-play-container__invisible': card.omitsTarget,
              })}
            >
              <Icon
                icon={<SnowFlakeIcon />}
                size="large"
              />
            </div>
          )}

          <PlayerAvatarCard
            player={players[runActivity.targetId]}
            withName
            withRoundCorners
            size="small"
            className={clsx({
              'card-play-container__avatar-locked': isTargetLocked,
              'card-play-container__invisible': card.omitsTarget,
            })}
          />
          {ongoingPlusOnePlayersIds.includes(runActivity.targetId) && (
            <PositiveValue
              value={1}
              className={clsx('card-play-container__ongoing-value', {
                'card-play-container__invisible': card.omitsTarget,
              })}
            />
          )}
          {ongoingMinusOnePlayersIds.includes(runActivity.targetId) && (
            <NegativeValue
              value={-1}
              className={clsx('card-play-container__ongoing-value', {
                'card-play-container__invisible': card.omitsTarget,
              })}
            />
          )}
        </div>
      </div>
    </RuleInstruction>
  );
}

type NewValueProps = {
  value: number;
  className: string;
};

function PositiveValue({ value, className }: NewValueProps) {
  return (
    <Avatar
      size="large"
      style={{ backgroundColor: 'green' }}
      className={className}
    >
      +{value}
    </Avatar>
  );
}

function NegativeValue({ value, className }: NewValueProps) {
  return (
    <Avatar
      size="large"
      style={{ backgroundColor: 'red' }}
      className={className}
    >
      {value}
    </Avatar>
  );
}
