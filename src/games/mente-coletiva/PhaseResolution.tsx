// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { StepResolution } from './StepResolution';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { CustomerReviewIcon } from 'components/icons/CustomerReviewIcon';

function PhaseResolution({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep(0);

  return (
    <PhaseContainer info={info} phase={state?.phase} allowedPhase={PHASES.MENTE_COLETIVA.RESOLUTION}>
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<CustomerReviewIcon />}
          title={translate('Resultado', 'And who moves is...')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
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

        {/* Step 1 */}
        <StepResolution
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

export default PhaseResolution;
