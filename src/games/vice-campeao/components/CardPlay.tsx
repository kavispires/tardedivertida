// Ant Design Resources
import { Avatar, Flex } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Icons
import { ArrowIcon } from '@icons/ArrowIcon';
import { NoIcon } from '@icons/NoIcon';
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

  return (
    <RuleInstruction
      type="event"
      key={runActivity.id}
      className={getAnimationClass('tada')}
    >
      <Flex
        align="center"
        gap={6}
      >
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

        <RunCard card={card} />
        {runActivity.newValue && runActivity.newValue > 0 && <PositiveValue value={runActivity.newValue} />}
        {runActivity.newValue && runActivity.newValue < 0 && <NegativeValue value={runActivity.newValue} />}

        {!card.noTarget && (
          <>
            <Flex
              vertical
              gap={6}
              align="center"
            >
              <Icon icon={<ArrowIcon />} />
              <Translate
                en="on"
                pt="em"
              />
            </Flex>

            {lockedPlayersIds.includes(runActivity.targetId) && <Icon icon={<NoIcon />} />}
            <PlayerAvatarCard
              player={players[runActivity.targetId]}
              withName
              withRoundCorners
              size="small"
            />
            {ongoingPlusOnePlayersIds.includes(runActivity.targetId) && <PositiveValue value={1} />}
            {ongoingMinusOnePlayersIds.includes(runActivity.targetId) && <NegativeValue value={-1} />}
          </>
        )}
      </Flex>
    </RuleInstruction>
  );
}

function PositiveValue({ value }: { value: number }) {
  return (
    <Avatar
      size="large"
      style={{ backgroundColor: 'green' }}
    >
      +{value}
    </Avatar>
  );
}

function NegativeValue({ value }: { value: number }) {
  return (
    <Avatar
      size="large"
      style={{ backgroundColor: 'red' }}
    >
      {value}
    </Avatar>
  );
}
