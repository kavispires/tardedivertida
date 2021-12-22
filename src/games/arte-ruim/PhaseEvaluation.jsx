import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
// Design Resources
import { Button } from 'antd';
import { CloudUploadOutlined, ThunderboltOutlined } from '@ant-design/icons';
// Hooks
import {
  useIsUserReady,
  useGlobalState,
  useAPICall,
  useLanguage,
  useUser,
  useLoading,
  useVotingMatch,
  useCardWidth,
} from '../../hooks';
// Utils
import { ARTE_RUIM_API } from '../../adapters';
import { LETTERS, PHASES, SEPARATOR } from '../../utils/constants';
// Components
import {
  ButtonContainer,
  Instruction,
  PhaseContainer,
  StepSwitcher,
  Step,
  Title,
  WaitingRoom,
  ReadyPlayersBar,
  PhaseAnnouncement,
  translate,
  Translate,
} from '../../components/shared';
import EvaluationAllDrawings from './EvaluationAllDrawings';
import EvaluationAllCards from './EvaluationAllCards';
import { getEntryId, shuffle } from '../../utils/helpers';
import { CollapsibleRule } from '../../components/rules';
import { CanvasResizer } from '../../components/canvas';

function prepareVotes(votes) {
  return Object.entries(votes).reduce((acc, [drawingEntryId, cardEntryId]) => {
    const [, drawingId] = drawingEntryId.split(SEPARATOR);
    const [, cardId] = cardEntryId.split(SEPARATOR);
    acc[drawingId] = cardId;
    return acc;
  }, {});
}

const EvaluationRules = () => (
  <Instruction>
    <Translate
      pt={
        <>
          Encontre os pares de desenho e carta clicando em uma carta ou desenho e em seguida clicando em seu
          par.
          <br />
          Uma bandeirinha aparecerá no topo de cada desenho com a cor e letra da carta que você selecionou.
          <br />
          Quando encontrar todos os pares, envie sua avaliação!
        </>
      }
      en={
        <>
          Find the pairs of artwork and card by clicking on a card or artwork then on its match.
          <br />
          A ribbon will show up on the artwork with the color and letter of the matching card.
          <br />
          When you're done, click the button to send your evaluation!
        </>
      }
    />
  </Instruction>
);

function EvaluationPhase({ players, state, info }) {
  const [isLoading] = useLoading();
  const language = useLanguage();
  const user = useUser(players);
  const isUserReady = useIsUserReady(players, state);
  const canvasWidth = useCardWidth(Math.min(Object.keys(players).length, 6), 16, 150, 500);
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');
  const [step, setStep] = useState(0);

  const { votes, setVotes, activeItem, activateItem, resetVoting } = useVotingMatch(
    'drawing',
    true,
    state?.drawings.length || 2
  );

  const onSubmitVotingAPIRequest = useAPICall({
    apiFunction: ARTE_RUIM_API.submitAction,
    actionName: 'submit-drawing',
    onBeforeCall: () => setStep(2),
    onError: () => setStep(0),
    successMessage: translate(
      'Avaliação enviada! Agora aguarde os outros jogadores',
      'Evaluation sent successfully! Wait for the other players',
      language
    ),
    errorMessage: translate(
      'Vixi, o aplicativo encontrou um erro ao tentar enviar sua avaliação',
      'Oops, the application failed to send your evaluation',
      language
    ),
  });

  const onSubmitVoting = (payload) => {
    onSubmitVotingAPIRequest({
      action: 'SUBMIT_VOTING',
      ...payload,
    });
  };

  const onGuessForMe = useCallback(() => {
    const usedDrawings = Object.keys(votes);
    const usedCards = Object.values(votes);
    const drawingsKeys = state?.drawings
      .map((e) => getEntryId(['drawing', e.id]))
      .filter((key) => !usedDrawings.includes(key));
    const cardsKeys = shuffle(
      state?.cards
        .map((e, index) => getEntryId(['card', e.id, LETTERS[index]]))
        .filter((key) => !usedCards.includes(key))
    );
    const newVotes = { ...votes };
    drawingsKeys.forEach((drawingKey, index) => {
      if (!newVotes[drawingKey]) {
        newVotes[drawingKey] = cardsKeys[index];
      }
    });
    setVotes(newVotes);
  }, [state?.cards, state?.drawings, votes, setVotes]);

  useEffect(() => {
    if (!canvasSize) {
      // Round to increments of 50
      setCanvasSize(Math.floor(canvasWidth / 50) * 50);
    }
  }, [canvasSize, canvasWidth]); // eslint-disable-line

  const selectOwnDrawing = useCallback(() => {
    const playersDrawing = (state?.drawings ?? []).find((drawing) => drawing.playerId === user.id);
    if (playersDrawing) {
      const drawingKey = getEntryId(['drawing', playersDrawing.id]);
      const cardIndex = (state?.cards ?? []).findIndex((card) => card.playerId === user.id);
      const cardKey = getEntryId(['card', playersDrawing.id, LETTERS[cardIndex]]);
      const vote = { [drawingKey]: cardKey };
      return vote;
    }
    return {};
  }, [user, state?.drawings, state?.cards]);

  // Auto-select the players own drawing and word
  useEffect(() => {
    const selection = selectOwnDrawing();
    if (selection) {
      setVotes((s) => ({ ...s, ...selection }));
    }
  }, [selectOwnDrawing, setVotes]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ARTE_RUIM.EVALUATION}
      className="a-evaluation-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady, !isUserReady]}>
        {/*Step 0 */}
        <PhaseAnnouncement
          type="evaluate"
          title={translate('Adivinhação', 'Match the Pairs', language)}
          onClose={() => setStep(1)}
          currentRound={state?.round?.current}
        >
          <EvaluationRules />
        </PhaseAnnouncement>

        {/* Step 1 */}
        <Step className="a-evaluation-step">
          <CanvasResizer numPlayers={Object.keys(players).length} />
          <Title>
            <Translate pt="Adivinhação" en="Match the Pairs" />
          </Title>
          <CollapsibleRule>
            <EvaluationRules />
          </CollapsibleRule>

          <ButtonContainer>
            <Button
              type="default"
              icon={<ThunderboltOutlined />}
              onClick={() => resetVoting(selectOwnDrawing())}
              disabled={isLoading}
            >
              <Translate pt="Limpar seleções" en="Clear selections" />
            </Button>
            <Button
              type="default"
              icon={<ThunderboltOutlined />}
              onClick={onGuessForMe}
              disabled={isLoading || Object.values(votes).length === state.drawings.length}
            >
              <Translate pt="Chutar restantes" en="Guess for me" />
            </Button>
            <Button
              type="primary"
              onClick={() => onSubmitVoting({ votes: prepareVotes(votes) })}
              disabled={isLoading || Object.values(votes).length < state.drawings.length}
              icon={<CloudUploadOutlined />}
            >
              <Translate pt="Enviar sua avaliação" en="Send evaluation" />
            </Button>
          </ButtonContainer>

          <EvaluationAllDrawings
            drawings={state?.drawings ?? []}
            activeItem={activeItem}
            onActivateItem={activateItem}
            votes={votes}
            canvasSize={canvasSize}
            players={players}
          />

          <EvaluationAllCards
            cards={state?.cards ?? []}
            activeItem={activeItem}
            onActivateItem={activateItem}
            votes={votes}
          />

          <ReadyPlayersBar
            players={players}
            readyText={translate('Já acabei, anda logo!', "I'm done, hurry up!", language)}
            readyTextPlural={translate('Já acabamos, anda logo!', "We're done, hurry up!", language)}
            showNames
          />
        </Step>

        {/*Step 2 */}
        <Step fullWidth>
          <WaitingRoom
            players={players}
            title={translate('Pronto!', 'Done!', language)}
            instruction={translate(
              'Vamos aguardar enquanto os outros jogadores terminam de avaliar!',
              'Please wait while other players finish their evaluations!',
              language
            )}
          />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

EvaluationPhase.propTypes = {
  info: PropTypes.object,
  players: PropTypes.object,
  state: PropTypes.shape({
    cards: PropTypes.array,
    drawings: PropTypes.array,
    phase: PropTypes.string,
  }),
};

export default EvaluationPhase;
