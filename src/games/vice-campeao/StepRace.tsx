// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers } from 'types/game';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Step, type StepProps } from '@components/steps/Step';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { RunActivity, RunnerCard } from './utils/types';
import { AnimatedRaceTrack } from './components/AnimatedRaceTrack';

type StepRaceProps = {
  players: GamePlayers;
  cardsDict: Dictionary<RunnerCard>;
  race: RunActivity[];
  goToNextStep: () => void;
  lockedPlayersIds: UID[];
  ongoingPlusOnePlayersIds: UID[];
  ongoingMinusOnePlayersIds: UID[];
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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Já!"
          en="Go!"
        />
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
        <TimedButton
          duration={duration}
          onExpire={goToNextStep}
          icon={<TrophyOutlined />}
          disabled
        >
          <Translate
            pt="Ranking em"
            en="Ranking in"
          />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
