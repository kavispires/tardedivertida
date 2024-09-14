// Types
import type { GamePlayers } from 'types/player';
// Components
import { Step } from 'components/steps';

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
