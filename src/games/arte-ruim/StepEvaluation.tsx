import { useCallback, useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
// Ant Design Resources
import { Button, Space } from 'antd';
import { CloudUploadOutlined, ThunderboltOutlined } from '@ant-design/icons';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { ArteRuimCard, ArteRuimDrawing } from './utils/types';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useGlobalState } from 'hooks/useGlobalState';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
import { useVotingMatch } from 'hooks/useVotingMatch';
// Utils
import { LETTERS } from 'utils/constants';
import { getEntryId, shuffle } from 'utils/helpers';
import { prepareVotes } from './utils/helpers';
// Components
import { Step, type StepProps } from 'components/steps';
import { PopoverRule } from 'components/rules';
import { CanvasResizer } from 'components/canvas';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { EvaluationAllDrawings } from './components/EvaluationAllDrawings';
import { EvaluationAllCards } from './components/EvaluationAllCards';
import { EvaluationRules } from './components/TextBlobs';

type StepEvaluationProps = {
  drawings: ArteRuimDrawing[];
  cards: ArteRuimCard[];
  players: GamePlayers;
  onSubmitVoting: GenericFunction;
  levelType: string;
  user: GamePlayer;
} & Pick<StepProps, 'announcement'>;

export function StepEvaluation({
  drawings,
  cards,
  players,
  onSubmitVoting,
  levelType,
  announcement,
  user,
}: StepEvaluationProps) {
  const { isLoading } = useLoading();

  const canvasWidth = useCardWidth(5, { gap: 16, minWidth: 150, maxWidth: 500 });
  const [canvasSize, setCanvasSize] = useGlobalState('canvasSize');
  const { votes, setVotes, activeItem, activateItem, resetVoting, isVotingComplete } = useVotingMatch(
    'drawing',
    true,
    drawings.length || 2
  );
  const [choseRandomly, setChoseRandomly] = useState(false);

  const onGuessForMe = useCallback(() => {
    setChoseRandomly(true);
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
  useEffectOnce(() => {
    const selection = selectOwnDrawing();
    if (selection) {
      setVotes((s: any) => ({ ...s, ...selection }));
    }
  });

  useMock(() => {
    onGuessForMe();
  }, []);

  return (
    <Step announcement={announcement} fullWidth>
      <PopoverRule content={<EvaluationRules />} />
      <CanvasResizer />
      <Title>
        <Translate pt="Adivinhação" en="Match the Pairs" />
      </Title>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Faça pares com as cartas e os desenhos.
              <br />
              Basta clicar em um desenho e depois em sua carta correspondente, ou vice-versa.
              <br />
              Para refazer, basta reselecionar o desenho ou carta normalmente.
              <br />
              Quando estiver pronto, clique em <b>Enviar sua avaliação</b>.
            </>
          }
          en={
            <>
              Match the cards and drawings.
              <br />
              Just click on a drawing and then on its corresponding card, or vice versa.
              <br />
              To redo, just reselect the drawing or card normally.
              <br />
              When you're ready, click <b>Send evaluation</b>.
            </>
          }
        />
      </RuleInstruction>

      <Space direction="vertical" className="a-evaluation-step">
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
            onClick={() => onSubmitVoting({ votes: prepareVotes(votes), choseRandomly })}
            disabled={isLoading || !isVotingComplete}
            icon={<CloudUploadOutlined />}
            loading={isLoading}
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
          levelType={levelType}
        />
      </Space>
    </Step>
  );
}
