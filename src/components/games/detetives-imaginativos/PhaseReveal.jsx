import React from 'react';
import PropTypes from 'prop-types';
// Hooks
import { useWhichPlayerIsThe, useAPICall } from '../../../hooks';
// Resources & Utils
import { GAME_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { Instruction, PhaseContainer, RankingBoard, Title } from '../../shared';
import { AvatarName } from '../../avatars';
import { AdminOnlyButton } from '../../admin/index';
import VotingOptions from './VotingOptions';

function PhaseReveal({ state, players, info }) {
  const impostor = useWhichPlayerIsThe('impostor', state, players);

  const onGoToNextRound = useAPICall({
    apiFunction: GAME_API.goToNextPhase,
    actionName: 'go-to-next-phase',
    successMessage: 'Ranking!',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar ir para a próxima fase',
  });

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.REVEAL}
      className="d-voting-phase"
    >
      <Title>O impostor era {<AvatarName player={impostor} />}</Title>
      <Instruction contained>
        {state.impostorVotes > 1 ? (
          <>Ele(a) recebeu mais de dois votos! Quem votou nele(a) ganha 3 pontos!</>
        ) : (
          <>
            Ele(a) não recebeu mais de 2 votos: <b>Impostor</b> ganha 5 pontos e <b>Líder</b> ganha 4 pontos!
          </>
        )}
      </Instruction>
      <VotingOptions players={players} isAllDisabled={true} leader={state.leader} />
      <RankingBoard players={players} ranking={state.ranking} />

      <Instruction contained>Faltam {state.roundsToEndGame} rodadas para o jogo terminar</Instruction>

      <AdminOnlyButton action={() => onGoToNextRound({})} label="Ir para próxima rodada ou game over" />
    </PhaseContainer>
  );
}

PhaseReveal.propTypes = {
  info: PropTypes.any,
  players: PropTypes.any,
  state: PropTypes.shape({
    impostorVotes: PropTypes.number,
    phase: PropTypes.any,
    ranking: PropTypes.any,
    roundsToEndGame: PropTypes.number,
  }),
};

export default PhaseReveal;
