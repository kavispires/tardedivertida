import { useCallback, useEffect, useState } from 'react';
// Ant Design Resources
import { ClearOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useGlobalLocalStorage } from '@hooks/useGlobalLocalStorage';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
import { useVotingMatch } from '@hooks/useVotingMatch';
// Utils
import { LETTERS } from '@utils/constants';
import { getEntryId, shuffle } from '@utils/helpers';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { CanvasResizerButton } from '@components/canvas/CanvasResizer';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { PopoverRule } from '@components/rules/PopoverRule';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { ArteRuimCustomCard, ArteRuimDrawing, SubmitVotingPayload } from './utils/types';
import { prepareVotes } from './utils/helpers';
import { EvaluationAllDrawings } from './components/EvaluationAllDrawings';
import { EvaluationAllCards } from './components/EvaluationAllCards';
import { EvaluationRules } from './components/TextBlobs';

type StepEvaluationProps = {
  drawings: ArteRuimDrawing[];
  cards: ArteRuimCustomCard[];
  players: GamePlayers;
  onSubmitVoting: (payload: SubmitVotingPayload) => void;
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

  const canvasWidth = useCardWidth(5, {
    gap: 16,
    minWidth: 150,
    maxWidth: 500,
  });
  const [canvasSize, setCanvasSize] = useGlobalLocalStorage('canvasSize');
  const { votes, setVotes, activeItem, activateItem, resetVoting, isVotingComplete } = useVotingMatch(
    'drawing',
    true,
    drawings.length || 2,
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
        .map((e: ArteRuimCustomCard, index: number) => getEntryId(['card', e.id, LETTERS[index]]))
        .filter((key: string) => !usedCards.includes(key)),
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: no functions should be a dependency of this effect
  useEffect(() => {
    if (!canvasSize) {
      // Round to increments of 50
      setCanvasSize(Math.floor(canvasWidth / 50) * 50);
    }
  }, [canvasSize, canvasWidth]);

  const selectOwnDrawing = useCallback(() => {
    const playersDrawing = (drawings ?? []).find((drawing: ArteRuimDrawing) => drawing.playerId === user.id);
    if (playersDrawing && playersDrawing.level !== 4) {
      const drawingKey = getEntryId(['drawing', playersDrawing.id]);
      const cardIndex = (cards ?? []).findIndex((card: ArteRuimCustomCard) => card.playerId === user.id);
      const cardKey = getEntryId(['card', playersDrawing.id, LETTERS[cardIndex]]);
      const vote = { [drawingKey]: cardKey };
      return vote;
    }
    return {};
  }, [user, drawings, cards]);

  // Auto-select the players own drawing and word
  // biome-ignore lint/correctness/useExhaustiveDependencies: Hook should be called only if the user character changes
  useEffect(() => {
    const selection = selectOwnDrawing();
    if (selection) {
      setVotes((s) => ({ ...s, ...selection }));
    }
  }, [user?.id]);

  useMock(() => {
    onGuessForMe();
  }, []);

  return (
    <Step
      announcement={announcement}
      fullWidth
    >
      <PopoverRule content={<EvaluationRules />} />

      <StepTitle>
        <Translate
          pt="Adivinhação"
          en="Match the Pairs"
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt="Faça pares com as cartas e os desenhos. Basta clicar em um desenho e depois em sua carta correspondente, ou vice-versa. Para refazer, basta re-selecionar o desenho ou carta normalmente. Quando estiver pronto, clique em <strong>Enviar sua avaliação</strong>."
          en="Match the cards and drawings. Just click on a drawing and then on its corresponding card, or vice-versa. To redo, just reselect the drawing or card normally. When you're ready, click <strong>Send evaluation</strong>."
        />
        <br />
        <CanvasResizerButton />
      </RuleInstruction>

      <Space orientation="vertical">
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

        <SpaceFloat>
          <Button
            type="default"
            icon={<ClearOutlined />}
            onClick={() => resetVoting(selectOwnDrawing())}
            disabled={isLoading}
          >
            <Translate
              pt="Limpar seleções"
              en="Clear selections"
            />
          </Button>
          <Button
            type="default"
            icon={<ThunderboltOutlined />}
            onClick={onGuessForMe}
            disabled={isLoading || Object.values(votes).length === drawings.length}
          >
            <Translate
              pt="Chutar restantes"
              en="Guess for me"
            />
          </Button>
          <SendButton
            onClick={() => onSubmitVoting({ votes: prepareVotes(votes), choseRandomly })}
            disabled={!isVotingComplete}
          >
            <Translate
              pt="Enviar sua avaliação"
              en="Send evaluation"
            />
          </SendButton>
        </SpaceFloat>
      </Space>
    </Step>
  );
}
