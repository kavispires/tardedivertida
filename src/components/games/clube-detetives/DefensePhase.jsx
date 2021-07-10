import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, message } from 'antd';
// Hooks
import { useIsUserThe, useWhichPlayerIsThe, useAPICall, useLoading } from '../../../hooks';
// Resources & Utils
import { CLUBE_DETETIVES_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { ButtonContainer, Instruction, PhaseContainer, Title } from '../../shared';
import { AvatarName } from '../../avatars';
import { messageContent } from '../../modals';
import TableFocus from './TableFocus';

function DefensePhase({ state, players, info }) {
  const [isLoading] = useLoading();
  const currentPlayer = useWhichPlayerIsThe('currentPlayerId', state, players);
  const leader = useWhichPlayerIsThe('leader', state, players);
  const isUserTheCurrentPlayer = useIsUserThe('currentPlayerId', state);
  console.log({ currentPlayer });
  console.log({ leader });

  const onFinishDefense = useAPICall({
    apiFunction: CLUBE_DETETIVES_API.submitAction,
    actionName: 'submit-secret-clue',
    successMessage: 'Defesa concluída com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar concluir sua defesa',
  });

  const onFinishDefenseClick = (cardId) => {
    onFinishDefense({
      action: 'DEFEND',
    });
  };

  useEffect(() => {
    if (isUserTheCurrentPlayer) {
      message.info(
        messageContent(
          'Sua vez de defender suas escolhas!',
          'Aperte o botão Concluir Defesa quando terminar',
          currentPlayer?.name,
          4
        )
      );
    }
  }, [isUserTheCurrentPlayer, currentPlayer?.name]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.CLUBE_DETETIVES.DEFENSE}
      className="d-secret-clue-phase"
    >
      <Title>
        Defesa: A pista secreta era <span className="d-clue">{state.clue}</span>
      </Title>
      <Instruction>
        <AvatarName player={currentPlayer} />, explique porque você escolheu as cartas.
        {isUserTheCurrentPlayer && <> Quando terminar sua defesa, aperte concluir.</>}
      </Instruction>

      <TableFocus table={state.table} currentPlayer={currentPlayer} />

      {isUserTheCurrentPlayer && (
        <ButtonContainer>
          <Button type="primary" onClick={onFinishDefenseClick} disabled={isLoading}>
            Concluir Defesa
          </Button>
        </ButtonContainer>
      )}
    </PhaseContainer>
  );
}

DefensePhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    clue: PropTypes.string,
    phase: PropTypes.string,
    table: PropTypes.arrayOf(
      PropTypes.shape({
        playerId: PropTypes.string,
        cards: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }),
};

export default DefensePhase;
