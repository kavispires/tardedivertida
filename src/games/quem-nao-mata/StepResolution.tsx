// Types
import type { GamePlayers } from 'types/player';
// Components
import { Step } from 'components/steps';

type StepResolutionProps = {
  players: GamePlayers;
};

export function StepResolution({ players }: StepResolutionProps) {
  return (
    <Step fullWidth>
      <p>oi</p>
    </Step>
  );
}
