// Hooks
import { useLanguage, useStep } from 'hooks';
import { useOnSubmitMasterPlayerAPIRequest } from './utils/api-requests';
// Resources & Utils
import { PHASES } from 'utils/phases';
// Components
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { StepMasterPlayerSelection } from './StepMasterPlayerSelection';

function PhaseMasterPlayerSelection({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { step, setStep, goToNextStep } = useStep(0);

  const onMasterPlayerClick = useOnSubmitMasterPlayerAPIRequest(setStep);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.VENDAVAL_DE_PALPITE.MASTER_PLAYER_SELECTION}
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="brain"
          title={translate('O Chefe', 'The Boss')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
          duration={10}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Um jogador deve ser o Chefe e avaliará as dicas dadas pelos outros jogadores que estão
                  tentando descobrir a palavra secreta.
                </>
              }
              en={
                <>
                  A player must be the Boss who will evaluate the clues given by other players who are trying
                  to unveil the secret word.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepMasterPlayerSelection players={players} onMasterPlayerClick={onMasterPlayerClick} />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseMasterPlayerSelection;
