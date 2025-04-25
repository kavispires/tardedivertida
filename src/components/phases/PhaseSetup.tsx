import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useGameId } from 'hooks/useGameId';
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

export function PhaseSetup({ state }: PhaseProps) {
  const gameId = useGameId();
  const queryClient = useQueryClient();

  // biome-ignore lint/correctness/useExhaustiveDependencies: only gameId is necessary
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['meta', gameId] });
  }, [gameId]);

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
