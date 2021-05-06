import React, { useCallback, useState } from 'react';
// Design Resources
import { Button, message, notification, Space } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Hooks
import { useLoading } from '../../hooks';
// Utils
import { ARTE_RUIM_API } from '../../adapters';
import { ARTE_RUIM_PHASES } from '../../utils/constants';
// Components
import WaitingRoom from '../shared/WaitingRoom';
import EvaluationAllDrawings from './EvaluationAllDrawings';
import EvaluationAllCards from './EvaluationAllCards';
import PhaseContainer from '../shared/PhaseContainer';
import CanvasResizer from './CanvasResizer';
import Title from '../shared/Title';
import Instruction from '../shared/Instruction';

function EvaluationPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [canvasSize] = useGlobalState('canvasSize');
  const [amIReady, setImReady] = useState(false);
  const [step, setStep] = useState(1);
  const [votes, setVotes] = useState({});
  const [activeItem, setActiveItem] = useState(null);

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

  const onSubmitVoting = useCallback(async () => {
    try {
      setLoader('submit-drawing', true);
      const preparedVotes = Object.entries(votes).reduce((acc, [drawingEntryId, cardEntryId]) => {
        const [, drawingId] = drawingEntryId.split('-');
        const [, cardId] = cardEntryId.split('-');
        acc[drawingId] = cardId;
        return acc;
      }, {});

      setStep(2);

      const response = await ARTE_RUIM_API.submitVoting({
        gameId,
        gameName,
        playerName: me,
        votes: preparedVotes,
      });
      if (response.data) {
        setImReady(true);
        message.success('Avaliação enviada! Agora aguarde os outros jogadores');
      }
    } catch (e) {
      notification.error({
        message: 'Vixi, o aplicativo encontrou um erro ao tentar enviar sua avaliação',
        description: JSON.stringify(e),
        placement: 'bottomLeft',
      });
      console.error(e);
    } finally {
      setLoader('submit-drawing', false);
    }
  }, [gameId, gameName, setLoader, me, votes]);

  return (
    <PhaseContainer
      info={info}
      phase={state?.phase}
      allowedPhase={ARTE_RUIM_PHASES.EVALUATION}
      className="evaluation-phase"
    >
      {step === 1 && !amIReady && (
        <div className="evaluation-phase__step-one">
          <CanvasResizer />
          <Title>Adivinhação</Title>
          <Instruction>
            Encontre os pares de desenho e carta clicando em uma carta ou desenho e em seguida clicando em seu
            par. Uma bandeirinha aparecerá no topo de cada desenho com a cor e letra da carta que você
            selecionou. Quando encontrar todos os pares, envie sua avaliação!
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

          <Space className="evaluation-phase__action-button">
            <Button
              type="primary"
              onClick={onSubmitVoting}
              disabled={Object.values(votes).length < state.drawings.length}
              icon={<CloudUploadOutlined />}
            >
              Enviar sua avaliação
            </Button>
          </Space>
        </div>
      )}

      {step === 2 && (
        <WaitingRoom
          players={players}
          title="Pronto!"
          instruction="Vamos aguardar enquanto os outros jogadores terminam de avaliar!"
        />
      )}
    </PhaseContainer>
  );
}

export default EvaluationPhase;
