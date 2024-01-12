// Types
import type { GamePlayers } from 'types/player';
import { Step } from 'components/steps';

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
