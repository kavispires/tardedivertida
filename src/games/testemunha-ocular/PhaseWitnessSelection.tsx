// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
import { useOnSelectWitnessAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepWitnessSelection } from './StepWitnessSelection';
import { CrimeSceneIcon } from 'components/icons/CrimeSceneIcon';

function PhaseWitnessSelection({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, goToNextStep } = useStep(0);

  const onWitnessButtonClick = useOnSelectWitnessAPIRequest();

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.WITNESS_SELECTION}
      className="t-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<CrimeSceneIcon />}
          title={translate('O Caso', 'The Case')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Um crime horrível aconteceu. Tão horrível quem não consigo nem explicar e nem podemos contar
                  com a ciência forense para resolvê-lo. Portanto, só há uma pessoa que pode nos ajudar agora:
                  uma testemunha ocular...
                </>
              }
              en={
                <>
                  A horrible crime has happened. So horrible that I can't even explain, neither can't rely on
                  forensics and science to solve it. So there's only one person that could help us now: An eye
                  witness...
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepWitnessSelection players={players} onWitnessButtonClick={onWitnessButtonClick} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseWitnessSelection;
