import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
// Design Resources
import { Button, Layout, message, notification, Space, Typography } from 'antd';
// State
import useGlobalState from '../../hooks/useGlobalState';
// Hooks
import { useLoading } from '../../hooks';
// Components
import LoadingPage from '../loaders/LoadingPage';

import { ARTE_RUIM_API } from '../../adapters';
import WaitingRoom from './WaitingRoom';
import Card from './Card';
import { ARTE_RUIM_PHASES, LETTERS } from '../../utils/constants';
import CanvasSVG from './CanvasSVG';
import Ribbon from './Ribbon';
import { CloudUploadOutlined } from '@ant-design/icons';

function EvaluationPhase({ players, state, info }) {
  const [, setLoader] = useLoading();
  const [gameId] = useGlobalState('gameId');
  const [gameName] = useGlobalState('gameName');
  const [me] = useGlobalState('me');
  const [amIReady, setImReady] = useState(false);
  const [step, setStep] = useState(1);
  const [votes, setVotes] = useState({});
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    if (state.phase === ARTE_RUIM_PHASES.EVALUATION) {
      const ready = Boolean(players?.[me]?.ready);
      setImReady(ready);
      if (ready) {
        setStep(3);
      }
    }
  }, [players, me]); // eslint-disable-line

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
          //
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

  if (!info?.gameName || !state?.phase) {
    return <LoadingPage />;
  }

  return (
    <Layout.Content className="evaluation-phase">
      {step === 1 && !amIReady && (
        <div className="evaluation-phase__step-one">
          <Typography.Title className="center">Adivinhação</Typography.Title>
          <Typography.Paragraph className="center">
            Ache os pares de desenho e carta clicando em uma carta ou desenho e em seguida clicando em seu
            par. Quando encontrar todos os pares, envie sua avaliação
          </Typography.Paragraph>
          <ul className="evaluation-phase__all-drawings">
            {state?.drawings?.map((drawingEntry) => {
              const canvasEntryId = `drawing-${drawingEntry.cardId}`;
              return (
                <li
                  key={drawingEntry.id}
                  className={clsx(
                    'evaluation-phase__li-drawing-button',
                    activeItem === canvasEntryId && 'evaluation-phase__li-drawing-button--active'
                  )}
                  onClick={() => onActivateItem(canvasEntryId)}
                >
                  {votes?.[canvasEntryId] && <Ribbon cardEntryId={votes[canvasEntryId]} />}
                  <CanvasSVG
                    key={drawingEntry.cardId}
                    drawing={drawingEntry.drawing}
                    className="evaluation-phase__drawing"
                  />
                </li>
              );
            })}
          </ul>

          <ul className="evaluation-phase__all-cards">
            {state?.cards?.map((cardEntry, index) => {
              const letter = LETTERS[index];
              const cardEntryId = `card-${cardEntry.id}-${letter}`;
              return (
                <li
                  key={cardEntry.id}
                  className={clsx(
                    'evaluation-phase__li-card-button',
                    activeItem === cardEntryId && 'evaluation-phase__li-card-button--active',
                    Object.values(votes).includes(cardEntryId) && 'evaluation-phase__li-card-button--used'
                  )}
                  onClick={() => onActivateItem(cardEntryId)}
                >
                  <Card id={cardEntry.id} title={letter} />
                </li>
              );
            })}
          </ul>
          <Space className="evaluation-phase__action-button">
            <Button
              type="primary"
              onClick={onSubmitVoting}
              disabled={Object.values(votes).length < state.drawings.length}
            >
              <CloudUploadOutlined /> Enviar sua avaliação
            </Button>
          </Space>
        </div>
      )}

      {step === 2 && <WaitingRoom players={players} />}
    </Layout.Content>
  );
}

export default EvaluationPhase;
