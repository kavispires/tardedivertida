import { useEffect, useState } from 'react';
// Ant Design Resources
import { Avatar, Flex, Progress } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { ArrowIcon } from 'icons/ArrowIcon';
import { NoIcon } from 'icons/NoIcon';
// Components
import { AvatarCard, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
// Internal
import type { RunActivity, RunnerCard } from '../utils/types';
import { RaceTrack } from './RaceTrack';
import { RunCard } from './RunCard';

type AnimatedRaceTrackProps = {
  race: RunActivity[];
  players: GamePlayers;
  cardsDict: Dictionary<RunnerCard>;
  lockedPlayersIds?: PlayerId[];
  ongoingPlusOnePlayersIds?: PlayerId[];
  ongoingMinusOnePlayersIds?: PlayerId[];
};

export function AnimatedRaceTrack({
  players,
  race,
  cardsDict,
  lockedPlayersIds = [],
  ongoingPlusOnePlayersIds = [],
  ongoingMinusOnePlayersIds = [],
}: AnimatedRaceTrackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (race.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex < race.length - 1) {
          return prevIndex + 1;
        }
        clearInterval(interval);
        return prevIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [race]);

  const runActivity = race[currentIndex];
  const card = runActivity.cardId ? cardsDict[runActivity.cardId] : null;

  return (
    <SpaceContainer direction="vertical" align="center">
      <RaceTrack runActivity={runActivity} players={players} />

      {card && (
        <>
          <Progress steps={race.length} showInfo={false} percent={(100 * (currentIndex + 1)) / race.length} />
          <RuleInstruction type="event" key={runActivity.id} className={getAnimationClass('tada')}>
            <Flex align="center" gap={6}>
              <AvatarCard player={players[runActivity.playerId]} withName withRoundCorners size="small" />

              <Flex vertical gap={6} align="center">
                <IconAvatar icon={<ArrowIcon />} />
                <Translate en="played" pt="jogou" />
              </Flex>

              <RunCard card={card} />
              {runActivity.newValue && runActivity.newValue > 0 && (
                <PositiveValue value={runActivity.newValue} />
              )}
              {runActivity.newValue && runActivity.newValue < 0 && (
                <NegativeValue value={runActivity.newValue} />
              )}

              {!card.noTarget && (
                <>
                  <Flex vertical gap={6} align="center">
                    <IconAvatar icon={<ArrowIcon />} />
                    <Translate en="on" pt="em" />
                  </Flex>

                  {lockedPlayersIds.includes(runActivity.targetId) && <IconAvatar icon={<NoIcon />} />}
                  <AvatarCard player={players[runActivity.targetId]} withName withRoundCorners size="small" />
                  {ongoingPlusOnePlayersIds.includes(runActivity.targetId) && <PositiveValue value={1} />}
                  {ongoingMinusOnePlayersIds.includes(runActivity.targetId) && <NegativeValue value={-1} />}
                </>
              )}
            </Flex>
          </RuleInstruction>
        </>
      )}
    </SpaceContainer>
  );
}

function PositiveValue({ value }: { value: number }) {
  return (
    <Avatar size="large" style={{ backgroundColor: 'green' }}>
      +{value}
    </Avatar>
  );
}

function NegativeValue({ value }: { value: number }) {
  return (
    <Avatar size="large" style={{ backgroundColor: 'red' }}>
      {value}
    </Avatar>
  );
}
