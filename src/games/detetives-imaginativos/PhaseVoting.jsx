import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
  Step,
  StepSwitcher,
  Title,
  Translate,
  translate,
} from '../../components/shared';
import Table from './Table';
import VotingOptions from './VotingOptions';
import { LoadingClock } from '../../components/icons';

function PhaseVoting({ state, players, info }) {
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

  const onVote = (playerId) => {
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
        <Step key={1}>
          <Title>
            {isLoading ? <LoadingClock /> : <Translate pt="Quem é o impostor?" en="Who is the impostor?" />}
          </Title>
          <Instruction>
            {isUserTheLeader && (
              <Translate
                pt="Aguarde enquanto os outros jogadorem votam em quem eles acham ser o impostor. Como Líder, você não vota."
                en="Wait while the other detectives vote. As Lead Detective, you don't vote."
              />
            )}

            {!isUserTheLeader && !user.vote && (
              <Translate
                pt="Vote para quem você acha que pode ser o impostor! Lembre-se, o impostor só perde se 2 ou mais detetives votarem nele."
                en="Vote for who you think can be the impostor! Remember, the impostor only goes down if they get 2 or more votes."
              />
            )}

            {!isUserTheLeader && user.vote && (
              <Translate
                pt="Aguarde enquanto os outros jogadores votam..."
                en="Wait while other detectives finish voting..."
              />
            )}
          </Instruction>

          <VotingOptions
            players={players}
            leaderId={state.leaderId}
            user={user}
            onVote={onVote}
            isLoading={isLoading}
            isAllDisabled={isUserTheLeader}
          />

          <Table table={state.table} players={players} />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseVoting.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    leader: PropTypes.string,
    phase: PropTypes.string,
    table: PropTypes.arrayOf(
      PropTypes.shape({
        playerId: PropTypes.string,
        cards: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }),
};

export default PhaseVoting;
