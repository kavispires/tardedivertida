// Types
import type { GameInfo } from 'types/game-info';
import type { GameState } from 'types/game';
// Constants
import { PHASES } from 'utils/phases';
// Icons
import { AnimatedGearIcon } from 'icons/AnimatedGearIcon';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { PhaseContainer } from './PhaseContainer';

type PhaseSetupProps = {
  info: GameInfo;
  state: GameState;
};

export function PhaseSetup({ info, state }: PhaseSetupProps) {
  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.DEFAULT.SETUP} className="setup">
      <div className="phase-announcement">
        <Title>
          <Translate pt="Preparando o jogo..." en="Setting up..." />
        </Title>

        <AnimatedGearIcon className="phase-announcement__icon" />

        <Instruction>
          <Translate pt="Aguarde um momento" en="Just a moment" />
        </Instruction>
      </div>
    </PhaseContainer>
  );
}
