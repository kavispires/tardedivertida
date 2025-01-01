// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
// Internal
import type { Tree } from './utils/types';
import { Forest } from './components/Forest';

type StepBuildWaitProps = {
  user: GamePlayer;
  forest: Tree[];
} & Pick<StepProps, 'announcement'>;

export function StepBuildWait({ user, announcement, forest }: StepBuildWaitProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate
          pt="Todos os jogadores já descobriam seu mapa completamente"
          en="All players have discovered your map completely"
        />
      </StepTitle>

      <Instruction contained>
        <Translate
          pt={<>Aguarde pacientemente, você ainda vai participar na hora de adivinhar.</>}
          en={<>Sit and wait patiently, you will still participate when it's time to guess.</>}
        />
      </Instruction>

      <Forest forest={forest} map={user.map} showPath />
    </Step>
  );
}
