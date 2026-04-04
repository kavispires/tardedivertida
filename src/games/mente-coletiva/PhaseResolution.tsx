// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Icons
import { CustomerReviewIcon } from 'icons/CustomerReviewIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import { MENTE_COLETIVA_PHASES } from './utils/constants';
import type { PhaseResolutionState } from './utils/types';
import { StepResolution } from './StepResolution';

export function PhaseResolution({ state, players }: PhaseProps<PhaseResolutionState>) {
  const { step } = useStep(0);

  const announcement = (
    <PhaseAnnouncement
      icon={<CustomerReviewIcon />}
      title={
        <Translate
          pt="Resultado"
          en="And who moves is..."
        />
      }
      currentRound={state?.round?.current}
      duration={3}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Agora podemos saber quem deve ser linchado porque não combina com o grupo!
              <br />
              Graças a Deus, mais espaço!
            </>
          }
          en={
            <>
              Now we will know who can be moved because they don't match with the group!
              <br />
              Thank God, more room!
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={MENTE_COLETIVA_PHASES.RESOLUTION}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepResolution
          announcement={announcement}
          ranking={state.ranking}
          players={players}
          pastureChangeStr={state.pastureChangeStr}
          roundType={state.roundType}
          announceSave={state?.announceSave}
          round={state.round}
          pastureSize={state.pastureSize}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}
