// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useStep } from 'hooks/useStep';
import { useWhichPlayerIsThe } from 'hooks/useWhichPlayerIsThe';
// Icons
import { LawIcon } from 'icons/LawIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PhaseAnnouncement } from 'components/phases/PhaseAnnouncement';
import { PhaseContainer } from 'components/phases/PhaseContainer';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { StepSwitcher } from 'components/steps/StepSwitcher';
import { Instruction } from 'components/text/Instruction';
// Internal
import { useOnEliminateSuspectAPIRequest } from './utils/api-requests';
import { TESTEMUNHA_OCULAR_PHASES } from './utils/constants';
import type { PhaseTrialState } from './utils/types';
import { StepEliminationSuspect } from './StepEliminationSuspect';

export function PhaseTrial({ state, players }: PhaseProps<PhaseTrialState>) {
  const { step } = useStep(0);

  const [witness, isUserTheWitness] = useWhichPlayerIsThe('witnessId', state, players);
  const [questioner, isUserTheQuestioner] = useWhichPlayerIsThe('questionerId', state, players);

  const onEliminate = useOnEliminateSuspectAPIRequest();

  const announcement = (
    <PhaseAnnouncement
      icon={<LawIcon />}
      title={
        <Translate
          pt="Julgamento"
          en="Trial"
        />
      }
      currentRound={state?.round?.current}
      type="overlay"
      duration={state?.round?.current === 1 ? 15 : 3}
    >
      <Instruction>
        <Translate
          pt={
            <>
              Precisamos eliminar suspeitos! Para cada pergunta, pelo menos um suspeito tem que se eliminado.
              Lembre-se que estamos tentando liberar testemunhas. Desvendamos o caso se o último suspeito for
              o criminoso!
              <br />
              <PlayerAvatarName
                player={questioner}
                addressUser
              />{' '}
              está encarregado(a) de selecionar os inocentes.
            </>
          }
          en={
            <>
              We need to eliminate suspects! For each question we must eliminate at least one suspect.
              Remember we are trying to release witnesses. We solve the case if the last man (or woman)
              standing is the perpetrator!
              <br />
              <PlayerAvatarName player={questioner} /> is in charge of selecting the innocent people.
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );

  return (
    <PhaseContainer
      phase={state?.phase}
      allowedPhase={TESTEMUNHA_OCULAR_PHASES.TRIAL}
    >
      <StepSwitcher
        step={step}
        players={players}
      >
        {/* Step 0 */}
        <StepEliminationSuspect
          suspectsDict={state.suspectsDict}
          suspectsIds={state.suspectsIds}
          previouslyEliminatedSuspects={state.previouslyEliminatedSuspects}
          perpetratorId={state.perpetratorId}
          isUserTheWitness={isUserTheWitness}
          witness={witness}
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
