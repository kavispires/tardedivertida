// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { TimedButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { RunActivity, RunnerCard } from './utils/types';
import { AnimatedRaceTrack } from './components/AnimatedRaceTrack';
// Hooks

type StepRaceProps = {
  players: GamePlayers;
  cardsDict: Dictionary<RunnerCard>;
  race: RunActivity[];
  goToNextStep: () => void;
  lockedPlayersIds: PlayerId[];
  ongoingPlusOnePlayersIds: PlayerId[];
  ongoingMinusOnePlayersIds: PlayerId[];
} & Pick<StepProps, 'announcement'>;

export function StepRace({
  players,
  announcement,
  cardsDict,
  race,
  goToNextStep,
  lockedPlayersIds,
  ongoingPlusOnePlayersIds,
  ongoingMinusOnePlayersIds,
}: StepRaceProps) {
  const duration = 6 * Object.keys(players).length;
  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Já!" en="Go!" />
      </StepTitle>

      <AnimatedRaceTrack
        race={race}
        players={players}
        cardsDict={cardsDict}
        lockedPlayersIds={lockedPlayersIds}
        ongoingMinusOnePlayersIds={ongoingMinusOnePlayersIds}
        ongoingPlusOnePlayersIds={ongoingPlusOnePlayersIds}
      />

      <SpaceContainer>
        <TimedButton duration={duration} onExpire={goToNextStep} icon={<TrophyOutlined />} disabled>
          <Translate pt="Ranking em" en="Ranking in" />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
