// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { MovieGenreIcon } from 'icons/MovieGenreIcon';
// Components
import { DualTranslate, Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { Icons } from './utils/helpers';
import { TESTE_DE_ELENCO_PHASES } from './utils/constants';
import { StepRanking } from './StepRanking';
import { StepResult } from './StepResult';

export function PhaseResult({ state, players }: PhaseProps) {
  const { step, goToNextStep, goToPreviousStep } = useStep(0);

  const activeRole = state.movie.roles[state.activeRoleId];

  const Icon = Icons?.[state?.movie?.id] ?? MovieGenreIcon;

  const announcement = (
    <PhaseAnnouncement
      icon={<Icon />}
      title={
        <>
          <Translate pt="Resultado" en="Results" />: <DualTranslate>{activeRole.title}</DualTranslate>
        </>
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={4}
    >
      <Instruction>
        <Translate pt={<>E o papel foi escolhido?</>} en={<>So was the role cast?</>} />
      </Instruction>
    </PhaseAnnouncement>
  );

  //

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={TESTE_DE_ELENCO_PHASES.RESULT}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <StepResult
          activeRole={activeRole}
          outcome={state.outcome}
          players={players}
          announcement={announcement}
          goToNextStep={goToNextStep}
        />

        {/* Step 1 */}
        <StepRanking
          players={players}
          round={state.round}
          ranking={state.ranking}
          goToPreviousStep={goToPreviousStep}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
