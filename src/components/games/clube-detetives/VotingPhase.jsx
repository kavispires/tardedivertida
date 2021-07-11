import React from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Spin } from 'antd';
// Hooks
import { useIsUserThe, useAPICall, useUser, useLoading } from '../../../hooks';
// Resources & Utils
import { CLUBE_DETETIVES_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { Instruction, PhaseContainer, Title } from '../../shared';
import Table from './Table';
import VotingOptions from './VotingOptions';
import { AdminForceNextPhase } from '../../admin/index';

function VotingPhase({ state, players, info }) {
  const [isLoading] = useLoading();
  const user = useUser(players);
  const isUserTheLeader = useIsUserThe('leader', state);

  const onSubmitVote = useAPICall({
    apiFunction: CLUBE_DETETIVES_API.submitAction,
    actionName: 'submit-vote',
    successMessage: 'Voto enviado com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar seu voto',
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
      allowedPhase={PHASES.CLUBE_DETETIVES.VOTING}
      className="d-voting-phase"
    >
      <Title>{isLoading ? <Spin size="large" /> : 'Quem é o impostor?'}</Title>
      <Instruction>
        {isUserTheLeader && 'Aguarde enquanto os outros jogadorem votam em quem eles acham ser o impostor'}

        {!isUserTheLeader &&
          !user.vote &&
          'Vote para quem você acha que pode ser o impostor! O impostor só perde se 2 ou mais detetives votarem nele! Discutam antes de votar!'}

        {!isUserTheLeader && user.vote && 'Aguarde enquanto os outros jogadores votam...'}
      </Instruction>

      {!isUserTheLeader && (
        <VotingOptions
          players={players}
          leader={state.leader}
          user={user}
          onVote={onVote}
          isLoading={isLoading}
        />
      )}

      <Table table={state.table} players={players} />

      <AdminForceNextPhase />
    </PhaseContainer>
  );
}

VotingPhase.propTypes = {
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

export default VotingPhase;
