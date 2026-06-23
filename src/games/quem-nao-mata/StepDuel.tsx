// Types
import type { GamePlayers } from 'types/game';
// Components
import { Step } from '@components/steps/Step';

type StepDuelProps = {
  players: GamePlayers;
};

export function StepDuel({ players }: StepDuelProps) {
  return (
    <Step fullWidth>
      <p>oi</p>
    </Step>
  );
}
