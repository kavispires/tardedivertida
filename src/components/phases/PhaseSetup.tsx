// Types
import type { GameState } from 'types/game';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { AnimatedGearIcon } from 'icons/AnimatedGearIcon';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import { PhaseContainer } from './PhaseContainer';

type PhaseSetupProps = {
  state: GameState;
};

export function PhaseSetup({ state }: PhaseSetupProps) {
  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.DEFAULT.SETUP} className="setup">
      <div className="phase-announcement">
        <StepTitle colorScheme="light">
          <Translate pt="Preparando o jogo..." en="Setting up..." />
        </StepTitle>

        <AnimatedGearIcon className="phase-announcement__icon" />

        <Instruction>
          <Translate pt="Aguarde um momento" en="Just a moment" />
        </Instruction>
      </div>
    </PhaseContainer>
  );
}
