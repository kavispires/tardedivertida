import { useEffect, useState } from 'react';
// Ant Design Resources
import { Progress } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { RunActivity, RunnerCard } from '../utils/types';
import { RaceTrack } from './RaceTrack';
import { CardPlay } from './CardPlay';
// Utils
// Icons

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
    <SpaceContainer orientation="vertical" align="center">
      <RaceTrack runActivity={runActivity} players={players} />

      {card && (
        <>
          <Progress steps={race.length} showInfo={false} percent={(100 * (currentIndex + 1)) / race.length} />
          <CardPlay
            runActivity={runActivity}
            players={players}
            cardsDict={cardsDict}
            lockedPlayersIds={lockedPlayersIds}
            ongoingPlusOnePlayersIds={ongoingPlusOnePlayersIds}
            ongoingMinusOnePlayersIds={ongoingMinusOnePlayersIds}
          />
        </>
      )}
    </SpaceContainer>
  );
}
