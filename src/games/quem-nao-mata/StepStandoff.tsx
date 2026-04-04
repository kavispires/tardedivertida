// Types
import type { GamePlayers } from 'types/game';
// Components
import { Step } from 'components/steps/Step';

type StepStandoffProps = {
  players: GamePlayers;
};

export function StepStandoff({ players }: StepStandoffProps) {
  return (
    <Step fullWidth>
      <p>oi</p>
    </Step>
  );
}
