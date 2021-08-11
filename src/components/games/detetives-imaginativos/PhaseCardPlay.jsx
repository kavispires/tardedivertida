import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Design Resources
import { message, Spin } from 'antd';
import { FileImageOutlined, QuestionCircleFilled } from '@ant-design/icons';
// Hooks
import {
  useIsUserThe,
  useWhichPlayerIsThe,
  useAPICall,
  useUser,
  useLoading,
  useLanguage,
} from '../../../hooks';
// Resources & Utils
import { DETETIVES_IMAGINATIVOS_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
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
} from '../../shared';
import { AvatarName } from '../../avatars';
import { messageContent } from '../../modals';
import { ImageCardHand as Hand } from '../../cards';
import Table from './Table';

function PhaseCardPlay({ state, players, info }) {
  const language = useLanguage();
  const [isLoading] = useLoading();
  const user = useUser(players);
  const currentPlayer = useWhichPlayerIsThe('currentPlayerId', state, players);
  const isUserTheImpostor = useIsUserThe('impostor', state);
  const isUserTheCurrentPlayer = useIsUserThe('currentPlayerId', state);
  const [step, setStep] = useState(0);

  const onPlayCard = useAPICall({
    apiFunction: DETETIVES_IMAGINATIVOS_API.submitAction,
    actionName: 'play-card',
    successMessage: translate('Carta enviada com sucesso', 'Card submitted successfully', language),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua carta',
      'Oops, the application found an error while trying to submit your card',
      language
    ),
  });

  const onSelectCard = (cardId) => {
    onPlayCard({
      action: 'PLAY_CARD',
      cardId,
    });
  };

  useEffect(() => {
    if (isUserTheCurrentPlayer && step > 0) {
      message.info(
        messageContent(
          translate('Escolha uma carta!', 'Choose a card to play', language),
          translate(
            'Aperte o botão Selecionar acima da carta escolhida',
            'Press the select button above each card',
            language
          ),

          currentPlayer.id,
          3
        )
      );
    }
  }, [isUserTheCurrentPlayer, currentPlayer.id, language, step]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.DETETIVES_IMAGINATIVOS.CARD_PLAY}
      className="d-phase d-play-card-phase"
    >
      <StepSwitcher step={step}>
        {/* Step 0 */}
        <PhaseAnnouncement
          type="hanging-photograph"
          title={translate('Apresentação das Evidências', 'Evidence', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <Instruction>
            <Translate
              pt="Agora, jogadores selecionarão duas cartas, uma de cada vez, como evidência que eles não sao o impostor. Enquanto isso, o impostor está prestando bastante atenção nas cartas selecionadas e escolhando algo que o(a) ajude a passar despercebido."
              en="Now players will play 2 cards, one at a time, as evidence that they are not the impostor while the impostor is looking closely to what others are playing and trying to go unnoticed."
            />
          </Instruction>
          {/* TODO: Preload hand */}
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step key={1}>
          <Title>
            {isUserTheImpostor ? (
              <>
                <QuestionCircleFilled />{' '}
                <Translate
                  pt="Pista? Que pista? Você é o impostor!"
                  en="Clue? What clue? You are the impostor!"
                />
              </>
            ) : (
              <>
                <Translate pt="A pista secreta é" en="The secret clue is" />{' '}
                <span className="d-clue">{state.clue}</span>
              </>
            )}
          </Title>
          <Instruction>
            {isUserTheCurrentPlayer && !isUserTheImpostor && (
              <>
                <FileImageOutlined />{' '}
                <Translate
                  pt="Selecione uma carta que mais combine com a pista secreta."
                  en="Select a card that best fits the secret clue."
                />
              </>
            )}
            {isUserTheCurrentPlayer && isUserTheImpostor && (
              <>
                <FileImageOutlined />{' '}
                <Translate
                  pt="Selecione uma carta que mais combine com as cartas que os outros
                jogadores estão usando."
                  en="Select a card that best fits with what others are playing."
                />
              </>
            )}
            {!isUserTheCurrentPlayer && (
              <>
                <Spin />{' '}
                <Translate
                  pt={
                    <>
                      Aguarde enquanto <AvatarName player={currentPlayer} addressUser /> escolhe uma carta.
                    </>
                  }
                  en={
                    <>
                      Wait while <AvatarName player={currentPlayer} /> picks a card.
                    </>
                  }
                />
              </>
            )}
          </Instruction>
          <Table table={state.table} players={players} />
          <Hand
            hand={user.hand}
            onSelectCard={isUserTheCurrentPlayer ? onSelectCard : null}
            disabledSelectButton={isLoading}
            selectButtonLabel={translate('Selecionar', 'Select', language)}
            sizeRatio={10}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

PhaseCardPlay.propTypes = {
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

export default PhaseCardPlay;
