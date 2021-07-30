import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message, Spin } from 'antd';
import { FileImageOutlined, QuestionCircleFilled } from '@ant-design/icons';
// Hooks
import { useIsUserThe, useWhichPlayerIsThe, useAPICall, useUser, useLoading } from '../../../hooks';
// Resources & Utils
import { DETETIVES_IMAGINATIVOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import { Instruction, PhaseContainer, Title } from '../../shared';
import { AvatarName } from '../../avatars';
import { messageContent } from '../../modals';
import { ImageCardHand as Hand } from '../../cards';
import Table from './Table';

function CardPlayPhase({ state, players, info }) {
  const [isLoading] = useLoading();
  const user = useUser(players);
  const currentPlayer = useWhichPlayerIsThe('currentPlayerId', state, players);
  const isUserTheImpostor = useIsUserThe('impostor', state);
  const isUserTheCurrentPlayer = useIsUserThe('currentPlayerId', state);

  const onPlayCard = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'play-card',
    successMessage: 'Carta enviada com sucesso',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
  });

  const onSelectCard = (cardId) => {
    onPlayCard({
      action: 'PLAY_CARD',
      cardId,
    });
  };

  useEffect(() => {
    if (isUserTheCurrentPlayer) {
      message.info(
        messageContent(
          'Escolha uma carta!',
          'Aperte o botão Selecionar acima da carta escolhida',
          currentPlayer.id,
          3
        )
      );
    }
  }, [isUserTheCurrentPlayer, currentPlayer.id]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.CARD_PLAY}
      className="d-phase d-play-card-phase"
    >
      <Title>
        A pista secreta é{' '}
        <span className="d-clue">{isUserTheImpostor ? <QuestionCircleFilled /> : state.clue}</span>
      </Title>
      <Instruction>
        {isUserTheCurrentPlayer && !isUserTheImpostor && (
          <>
            <FileImageOutlined /> Selecione uma carta que mais combine com a pista secreta.
          </>
        )}
        {isUserTheCurrentPlayer && isUserTheImpostor && (
          <>
            <FileImageOutlined /> Selecione uma carta que mais combine com as cartas que os outros jogadores
            estão usando.
          </>
        )}
        {!isUserTheCurrentPlayer && (
          <>
            <Spin /> Aguarde enquanto <AvatarName player={currentPlayer} addressUser /> escolhe uma carta
          </>
        )}
      </Instruction>
      <Table table={state.table} players={players} />
      <Hand
        hand={user.hand}
        onSelectCard={isUserTheCurrentPlayer ? onSelectCard : null}
        disabledSelectButton={isLoading}
        selectButtonLabel="Selecionar"
        sizeRatio={10}
      />
    </PhaseContainer>
  );
}

CardPlayPhase.propTypes = {
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

export default CardPlayPhase;
