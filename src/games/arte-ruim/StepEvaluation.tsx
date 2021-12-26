import { useCallback, useEffect } from 'react';
// Design Resources
import { Button } from 'antd';
import { CloudUploadOutlined, ThunderboltOutlined } from '@ant-design/icons';
// Hooks
import { useGlobalState, useLanguage, useUser, useLoading, useVotingMatch, useCardWidth } from '../../hooks';
// Utils
import { LETTERS, SEPARATOR } from '../../utils/constants';
import { getEntryId, shuffle } from '../../utils/helpers';
// Components
import {
  ButtonContainer,
  CanvasResizer,
  Step,
  Title,
  ReadyPlayersBar,
  translate,
  Translate,
  PopoverRule,
} from '../../components';
import EvaluationAllDrawings from './EvaluationAllDrawings';
import EvaluationAllCards from './EvaluationAllCards';

import RulesEvaluation from './RulesEvaluation';

function prepareVotes(votes: PlainObject) {
  return Object.entries(votes).reduce((acc: PlainObject, [drawingEntryId, cardEntryId]) => {
    const [, drawingId] = drawingEntryId.split(SEPARATOR);
    const [, cardId] = cardEntryId.split(SEPARATOR);
    acc[drawingId] = cardId;
    return acc;
  }, {});
}

type StepEvaluationProps = {
  drawings: ArteRuimDrawing[];
  cards: ArteRuimCard[];
  players: GamePlayers;
  onSubmitVoting: GenericFunction;
};
function StepEvaluation({ drawings, cards, players, onSubmitVoting }: StepEvaluationProps) {
  const [isLoading] = useLoading();
  const language = useLanguage();
  const user = useUser(players);
  const canvasWidth = useCardWidth(Math.min(Object.keys(players).length, 6), 16, 150, 500);
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');

  const { votes, setVotes, activeItem, activateItem, resetVoting } = useVotingMatch(
    'drawing',
    true,
    drawings.length || 2
  );

  const onGuessForMe = useCallback(() => {
    const usedDrawings = Object.keys(votes);
    const usedCards = Object.values(votes);
    const drawingsKeys = drawings
      .map((e: ArteRuimDrawing) => getEntryId(['drawing', e.id]))
      .filter((key: string) => !usedDrawings.includes(key));
    const cardsKeys = shuffle(
      cards
        .map((e: ArteRuimCard, index: number) => getEntryId(['card', e.id, LETTERS[index]]))
        .filter((key: string) => !usedCards.includes(key))
    );
    const newVotes = { ...votes };
    drawingsKeys.forEach((drawingKey: string, index: number) => {
      if (!newVotes[drawingKey]) {
        newVotes[drawingKey] = cardsKeys[index];
      }
    });
    setVotes(newVotes);
  }, [cards, drawings, votes, setVotes]);

  useEffect(() => {
    if (!canvasSize) {
      // Round to increments of 50
      setCanvasSize(Math.floor(canvasWidth / 50) * 50);
    }
  }, [canvasSize, canvasWidth]); // eslint-disable-line

  const selectOwnDrawing = useCallback(() => {
    const playersDrawing = (drawings ?? []).find((drawing: ArteRuimDrawing) => drawing.playerId === user.id);
    if (playersDrawing) {
      const drawingKey = getEntryId(['drawing', playersDrawing.id]);
      const cardIndex = (cards ?? []).findIndex((card: ArteRuimCard) => card.playerId === user.id);
      const cardKey = getEntryId(['card', playersDrawing.id, LETTERS[cardIndex]]);
      const vote = { [drawingKey]: cardKey };
      return vote;
    }
    return {};
  }, [user, drawings, cards]);

  // Auto-select the players own drawing and word
  useEffect(() => {
    const selection = selectOwnDrawing();
    if (selection) {
      setVotes((s: any) => ({ ...s, ...selection }));
    }
  }, [selectOwnDrawing, setVotes]);
  return (
    <Step className="a-evaluation-step">
      <PopoverRule content={<RulesEvaluation />} />
      <CanvasResizer />
      <Title>
        <Translate pt="Adivinhação" en="Match the Pairs" />
      </Title>

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
          disabled={isLoading || Object.values(votes).length === drawings.length}
        >
          <Translate pt="Chutar restantes" en="Guess for me" />
        </Button>
        <Button
          type="primary"
          onClick={() => onSubmitVoting({ votes: prepareVotes(votes) })}
          disabled={isLoading || Object.values(votes).length < drawings.length}
          icon={<CloudUploadOutlined />}
        >
          <Translate pt="Enviar sua avaliação" en="Send evaluation" />
        </Button>
      </ButtonContainer>

      <EvaluationAllDrawings
        drawings={drawings ?? []}
        activeItem={activeItem}
        onActivateItem={activateItem}
        votes={votes}
        canvasSize={canvasSize}
        players={players}
      />

      <EvaluationAllCards
        cards={cards ?? []}
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
  );
}

export default StepEvaluation;
