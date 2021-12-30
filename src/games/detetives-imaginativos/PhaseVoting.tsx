import { useState } from 'react';
// Hooks
import { useAPICall, useUser, useLoading, useLanguage, useWhichPlayerIsThe } from '../../hooks';
// Resources & Utils
import { DETETIVES_IMAGINATIVOS_API } from '../../adapters';
import { PHASES } from '../../utils/constants';
// Components
import {
  Instruction,
  PhaseAnnouncement,
  PhaseContainer,
  StepSwitcher,
  Translate,
  translate,
} from '../../components';
import StepVoting from './StepVoting';

function PhaseVoting({ state, players, info }: PhaseProps) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const user = useUser(players);
  const [, isUserTheLeader] = useWhichPlayerIsThe('leaderId', state, players);
  const [step, setStep] = useState(0);

  const onSubmitVote = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'submit-vote',
    successMessage: translate('Voto enviado com sucesso', 'Vote submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
      'Oops, the application found an error while trying to submit your vote',
      language
    ),
  });

  const onVote = (playerId: string) => {
    onSubmitVote({
      action: 'SUBMIT_VOTE',
      vote: playerId,
    });
  };

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.VOTING}
      className="d-voting-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="vote"
          title={translate('Votação', 'Vote', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt={
                <>
                  Agora você vota! Escolha o jogador que você acredita ser o impostor. Você pode discutir com
                  os outros antes de votar, porque uma vez votado, você não pode mudar. O impostor só pede se
                  duas pessoas votarem nele.
                </>
              }
              en={
                <>
                  Now it's time to vote! Vote for the player you think is the impostor. You can discuss before
                  you vote because you can't change your vote. The impostor only loses if at least two people
                  voted for them.
                </>
              }
            />
          </Instruction>
        </PhaseAnnouncement>

        {/* Step 1 */}
        <StepVoting
          players={players}
          leaderId={state.leaderId}
          user={user}
          onVote={onVote}
          isLoading={isLoading}
          isUserTheLeader={isUserTheLeader}
          table={state.table}
        />
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default PhaseVoting;
