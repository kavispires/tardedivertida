// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Icons
import { CustomerReviewIcon } from 'icons/CustomerReviewIcon';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepResolution } from './StepResolution';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';

export function PhaseResolution({ state, players, info }: PhaseProps) {
  const { step } = useStep(0);

  const announcement = (
    <PhaseAnnouncement
      icon={<CustomerReviewIcon />}
      title={<Translate pt="Resultado" en="And who moves is..." />}
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
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MENTE_COLETIVA.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
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
