import type { ReactNode } from 'react';
// Types
import type { GamePlayers } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { WaitingRoom } from '@components/players/WaitingRoom';
import { Step } from '@components/steps/Step';

type StepWaitingProps = {
  players: GamePlayers;
  instruction: ReactNode;
};

export function StepWaiting({ players, instruction }: StepWaitingProps) {
  return (
    <Step fullWidth>
      <WaitingRoom
        players={players}
        title={
          <Translate
            pt="Aguarde"
            en="Please wait"
          />
        }
        instruction={instruction}
      />
    </Step>
  );
}
