// Types
import { PhaseProps } from 'types/game';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Utils
import { PHASES } from 'utils/phases';
// Icons
import { LawIcon } from 'icons/LawIcon';
// Components
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PhaseAnnouncement, PhaseContainer } from 'components/phases';
import { StepSwitcher } from 'components/steps';
import { Instruction } from 'components/text';
// Internal
import { useOnEliminateSuspectAPIRequest } from './utils/api-requests';
import { StepSuspectElimination } from './StepSuspectElimination';

function PhaseTrial({ state, players }: PhaseProps) {
  const { isLoading } = useLoading();
  const { step } = useStep(0);

  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);
  const [questioner, isUserTheQuestioner] = useWhichPlayerIsThe('questionerId', state, players);

  const onEliminate = useOnEliminateSuspectAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<LawIcon />}
      title={<Translate pt="Julgamento" en="Trial" />}
      currentRound={state?.round?.current}
      type="overlay"
    >
      <Instruction>
        <Translate
          pt={
            <>
              Precisamos eliminar suspeitos! Para cada pergunta, pelo menos um suspeito tem que se eliminado.
              Lembre-se que estamos tentando liberar testemunhas. Desvendamos o caso se o último suspeito for
              o criminoso!
              <br />
              <AvatarName player={questioner} addressUser /> está encarregado(a) de selecionar os inocentes.
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
  );

  return (
    <PhaseContainer phase={state?.phase} allowedPhase={PHASES.TESTEMUNHA_OCULAR.TRIAL} className="t-phase">
      <StepSwitcher step={step} players={players}>
        {/* Step 0 */}
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
          questioner={questioner}
          isUserTheQuestioner={isUserTheQuestioner}
          testimony={state.testimony}
          history={state.history}
          announcement={announcement}
          status={state.status}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseTrial;
