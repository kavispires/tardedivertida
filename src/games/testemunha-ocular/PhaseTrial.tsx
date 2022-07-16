import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
import { useLanguage, useLoading, useStep, useWhichPlayerIsThe } from 'hooks';
import { PHASES } from 'utils/phases';

import { useOnEliminateSuspectAPIRequest } from './utils/api-requests';
import { StepSuspectElimination } from './StepSuspectElimination';
import { LawIcon } from 'components/icons/LawIcon';

function PhaseTrial({ state, players, info }: PhaseProps) {
  const { translate } = useLanguage();
  const { isLoading } = useLoading();
  const { step, goToNextStep } = useStep(0);

  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);
  const [questioner, isUserTheQuestioner] = useWhichPlayerIsThe('questionerId', state, players);

  const onEliminate = useOnEliminateSuspectAPIRequest();

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.TESTEMUNHA_OCULAR.TRIAL}
      className="t-phase"
    >
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
        <PhaseAnnouncement
          icon={<LawIcon />}
          title={translate('Julgamento', 'Trial')}
          onClose={goToNextStep}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Precisamos eliminar suspeitos! Para cada pergunta, pelo menos um suspeito tem que se
                  eliminado. Lembre-se que estamos tentando liberar testemunhas. Desvendamos o caso se o
                  último suspeito for o criminoso!
                  <br />
                  <AvatarName player={questioner} addressUser /> está encarregado(a) de selecionar os
                  inocentes.
                </>
              }
              en={
                <>
                  We need to eliminate suspects! For each question we must eliminate at least one suspect.
                  Remember we are trying to release witnesses. We solve the case if the last man (or woman)
                  standing is the perpetrator!
                  <br />
                  <AvatarName player={questioner} /> is in charge of selecting the innocent people.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepSuspectElimination
          suspects={state.suspects}
          previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
          perpetrator={state.perpetrator}
          isUserTheWitness={isUserTheWitness}
          witness={witness}
          isLoading={isLoading}
          onEliminate={onEliminate}
          question={state.question}
          eliminatedSuspects={state.eliminatedSuspects}
          isUserTheQuestioner={isUserTheQuestioner}
          testimony={state.testimony}
          history={state.history}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseTrial;
