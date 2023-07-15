// Constants
import { PHASES } from 'utils/phases';
// Icons
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { PhaseContainer } from './PhaseContainer';

type PhaseWaitProps = {
  info: GameInfo;
  state: GameState;
};

export function PhaseWait({ info, state }: PhaseWaitProps) {
  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.DEFAULT.WAIT} className="setup">
      <div className="phase-announcement">
        <Title>
          <Translate pt="Processando..." en="Processing..." />
        </Title>

        <AnimatedProcessingIcon className="phase-announcement__icon" />

        <Instruction>
          <Translate pt="Aguarde um momento" en="Just a moment" />
        </Instruction>
      </div>
    </PhaseContainer>
  );
}
