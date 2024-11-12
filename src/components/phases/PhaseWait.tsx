// Types
import type { GameState } from 'types/game';
import type { GameInfo } from 'types/game-info';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
// Internal
import { PhaseContainer } from './PhaseContainer';

type PhaseWaitProps = {
  info: GameInfo;
  state: GameState;
};

export function PhaseWait({ state }: PhaseWaitProps) {
  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.DEFAULT.WAIT} className="setup">
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
