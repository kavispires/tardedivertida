import React, { useCallback, useEffect, useState } from 'react';
// Design Resources
import { Button } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// Hooks
import { useIsUserReady, useGlobalState, useAPICall } from '../../../hooks';
// Utils
import { ARTE_RUIM_API } from '../../../adapters';
import { PHASES } from '../../../utils/constants';
// Components
import EvaluationAllDrawings from './EvaluationAllDrawings';
import EvaluationAllCards from './EvaluationAllCards';
import CanvasResizer from './CanvasResizer';
import {
  AdminForceNextPhase,
  ButtonContainer,
  Instruction,
  PhaseContainer,
  StepSwitcher,
  Step,
  Title,
  WaitingRoom,
  ReadyPlayersBar,
} from '../../shared';

function prepareVotes(votes) {
  return Object.entries(votes).reduce((acc, [drawingEntryId, cardEntryId]) => {
    const [, drawingId] = drawingEntryId.split('-');
    const [, cardId] = cardEntryId.split('-');
    acc[drawingId] = cardId;
    return acc;
  }, {});
}

function EvaluationPhase({ players, state, info }) {
  const isUserReady = useIsUserReady(players, state);
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');
  const [cachedCanvasSize] = useGlobalState('cachedCanvasSize');
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState({});
  const [activeItem, setActiveItem] = useState(null);

  const onSubmitVoting = useAPICall({
    apiFunction: ARTE_RUIM_API.submitVoting,
    actionName: 'submit-drawing',
    onBeforeCall: () => setStep(1),
    onError: () => setStep(0),
    successMessage: 'Avaliação enviada! Agora aguarde os outros jogadores',
    errorMessage: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua avaliação',
  });

  useEffect(() => {
    setCanvasSize(cachedCanvasSize);
  }, []); // eslint-disable-line

  const onActivateItem = useCallback(
    (entryId) => {
      const [type] = entryId.split('-');
      if (!activeItem || activeItem.startsWith(type)) {
        setActiveItem(entryId);
      } else {
        if (type === 'card') {
          setVotes((prevVotes) => {
            return {
              ...prevVotes,
              [activeItem]: entryId,
            };
          });
        } else {
          setVotes((prevVotes) => {
            return {
              ...prevVotes,
              [entryId]: activeItem,
            };
          });
        }
        setActiveItem(null);
      }
    },
    [activeItem]
  );

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={PHASES.ARTE_RUIM.EVALUATION}
      className="a-evaluation-phase"
    >
      <StepSwitcher step={step} conditions={[!isUserReady]}>
        {/*Step 0 */}
        <Step className="a-evaluation-step">
          <CanvasResizer />
          <Title>Adivinhação</Title>
          <Instruction>
            Encontre os pares de desenho e carta clicando em uma carta ou desenho e em seguida clicando em seu
            par.
            <br />
            Uma bandeirinha aparecerá no topo de cada desenho com a cor e letra da carta que você selecionou.
            <br />
            Quando encontrar todos os pares, envie sua avaliação!
          </Instruction>

          <EvaluationAllDrawings
            drawings={state?.drawings ?? []}
            activeItem={activeItem}
            onActivateItem={onActivateItem}
            votes={votes}
            canvasSize={canvasSize}
          />

          <EvaluationAllCards
            cards={state?.cards ?? []}
            activeItem={activeItem}
            onActivateItem={onActivateItem}
            votes={votes}
          />

          <ButtonContainer>
            <Button
              type="primary"
              onClick={() => onSubmitVoting({ votes: prepareVotes(votes) })}
              disabled={Object.values(votes).length < state.drawings.length}
              icon={<CloudUploadOutlined />}
            >
              Enviar sua avaliação
            </Button>
          </ButtonContainer>

          <ReadyPlayersBar
            readyText="Já acabei, anda logo!"
            readyTextPlural="Já acabamos, anda logo!"
            showNames
          />
        </Step>

        {/*Step 1 */}
        <Step fullWidth>
          <WaitingRoom
            players={players}
            title="Pronto!"
            instruction="Vamos aguardar enquanto os outros jogadores terminam de avaliar!"
          />
          <AdminForceNextPhase />
        </Step>
      </StepSwitcher>
    </PhaseContainer>
  );
}

export default EvaluationPhase;
