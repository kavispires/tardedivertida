import { useCallback, useEffect } from 'react';
// Ant Design Resources
import { Button, Space } from 'antd';
import { CloudUploadOutlined, ThunderboltOutlined } from '@ant-design/icons';
// Hooks
import {
  useGlobalState,
  useLanguage,
  useUser,
  useLoading,
  useVotingMatch,
  useCardWidth,
  useMock,
} from 'hooks';
// Utils
import { LETTERS } from 'utils/constants';
import { getEntryId, shuffle } from 'utils/helpers';
import { prepareVotes } from './utils/helpers';
// Components
import { Step } from 'components/steps';
import { PopoverRule } from 'components/rules';
import { CanvasResizer } from 'components/canvas';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';
import { EvaluationAllDrawings } from './components/EvaluationAllDrawings';
import { EvaluationAllCards } from './components/EvaluationAllCards';
import { EvaluationRules } from './components/TextBlobs';

type StepEvaluationProps = {
  drawings: ArteRuimDrawing[];
  cards: ArteRuimCard[];
  players: GamePlayers;
  onSubmitVoting: GenericFunction;
};

export function StepEvaluation({ drawings, cards, players, onSubmitVoting }: StepEvaluationProps) {
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const user = useUser(players);
  const canvasWidth = useCardWidth(Math.min(Object.keys(players).length, 6), 16, 150, 500);
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');
  const { votes, setVotes, activeItem, activateItem, resetVoting, isVotingComplete } = useVotingMatch(
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
    let cardsKeys = shuffle(
      cards
        .map((e: ArteRuimCard, index: number) => getEntryId(['card', e.id, LETTERS[index]]))
        .filter((key: string) => !usedCards.includes(key))
    );
    // For level 5 specifically, if there are less cards than drawings
    cardsKeys =
      cardsKeys.length < drawingsKeys.length
        ? Array(Math.ceil(drawingsKeys.length / cardsKeys.length))
            .fill(cardsKeys)
            .flat()
        : cardsKeys;

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
    if (playersDrawing && playersDrawing.level !== 5) {
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

  useMock(() => {
    onGuessForMe();
  }, []);

  return (
    <Step className="a-evaluation-step">
      <PopoverRule content={<EvaluationRules />} />
      <CanvasResizer />
      <Title>
        <Translate pt="Adivinhação" en="Match the Pairs" />
      </Title>

      <Space className="space-container" align="center" wrap>
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
          disabled={isLoading || !isVotingComplete}
          icon={<CloudUploadOutlined />}
        >
          <Translate pt="Enviar sua avaliação" en="Send evaluation" />
        </Button>
      </Space>

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
        readyText={translate('Já acabei, anda logo!', "I'm done, hurry up!")}
        readyTextPlural={translate('Já acabamos, anda logo!', "We're done, hurry up!")}
      />
    </Step>
  );
}
