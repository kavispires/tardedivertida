import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { Button, message } from 'antd';
// Hooks
import { useIsUserThe, useWhichPlayerIsThe, useAPICall, useLoading } from '../../../hooks';
// Resources & Utils
import { DETETIVES_IMAGINATIVOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { ButtonContainer, EmergencyAlert, Instruction, PhaseContainer, Title } from '../../shared';
import { AvatarName } from '../../avatars';
import { messageContent } from '../../modals';
import TableFocus from './TableFocus';
import MagnifyingGlassSVG from './MagnifyingGlassSVG';

function DefensePhase({ state, players, info }) {
  const [isLoading] = useLoading();
  const currentPlayer = useWhichPlayerIsThe('currentPlayerId', state, players);
  const isUserTheCurrentPlayer = useIsUserThe('currentPlayerId', state);

  const onFinishDefense = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'submit-secret-clue',
    successMessage: 'Defesa concluída com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar concluir sua defesa',
  });

  const onFinishDefenseClick = () => {
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
          currentPlayer?.id,
          4
        )
      );
    }
  }, [isUserTheCurrentPlayer, currentPlayer?.id]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.DEFENSE}
      className="d-defense-phase"
    >
      <EmergencyAlert duration={5}>
        <MagnifyingGlassSVG />
        <Title className="d-emergency-alert-title">
          Pista secreta: <span className="d-clue">{state.clue}</span>
        </Title>
      </EmergencyAlert>

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
          <Button type="primary" onClick={onFinishDefenseClick} disabled={isLoading} size="large">
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
