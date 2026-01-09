import type { ReactNode } from 'react';
// Types
import type { GamePlayers } from 'types/player';
// Components
import { Translate } from 'components/language';
import { WaitingRoom } from 'components/players';
import { Step } from 'components/steps';

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
