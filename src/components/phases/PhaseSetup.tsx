import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
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
import { VideoBackground } from './lobby/VideoBackground';
import { ImageBackground } from './lobby/ImageBackground';

export function PhaseSetup({ state }: PhaseProps) {
  const gameId = useGameId();
  const queryClient = useQueryClient();
  const hasInvalidated = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only the id matters
  useEffect(() => {
    if (!hasInvalidated.current && gameId) {
      queryClient.invalidateQueries({ queryKey: ['meta', gameId] });
      hasInvalidated.current = true;
    }
  }, [gameId]);

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.DEFAULT.SETUP} className="setup">
      <div className="phase-announcement" style={{ zIndex: 3, background: 'transparent' }}>
        <StepTitle colorScheme="dark">
          <Translate pt="Preparando o jogo..." en="Setting up..." />
        </StepTitle>

        <AnimatedGearIcon className="phase-announcement__icon" />

        <Instruction style={{ color: 'white' }}>
          <Translate pt="Aguarde um momento" en="Gathering resources..." />
        </Instruction>
      </div>
      <VideoBackground />

      <ImageBackground />
    </PhaseContainer>
  );
}
