// Types
import type { PhaseProps } from 'types/game';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
// Internal
import { PhaseContainer } from './PhaseContainer';

export function PhaseWait({ state }: PhaseProps) {
  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={PHASES.DEFAULT.WAIT}
      className="setup"
    >
      <div className="phase-announcement">
        <Title>
          <Translate
            pt="Processando..."
            en="Processing..."
          />
        </Title>

        <AnimatedProcessingIcon className="phase-announcement__icon" />

        <Instruction>
          <Translate
            pt="Aguarde um momento"
            en="Just a moment"
          />
        </Instruction>
      </div>
    </PhaseContainer>
  );
}
