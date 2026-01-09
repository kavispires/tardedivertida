import { useEffect, useState } from 'react';
// Ant Design Resources
import { ClearOutlined, CloudUploadOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { TextCard } from 'types/tdr';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { CanvasResizer } from 'components/canvas';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TitledContainer } from 'components/layout/TitledContainer';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { DrawingEntry, SubmitEvaluationPayload } from './utils/types';
import { useGuessing } from './utils/useGuessing';
import { EvaluationRules } from './components/RulesBlobs';
import { EvaluationAllDrawings } from './components/EvaluationAllDrawings';
import { EvaluationAllSubjects } from './components/EvaluationAllSubjects';
import { EvaluationAllDescriptors } from './components/EvaluationAllDescriptors';

type StepEvaluateProps = {
  user: GamePlayer;
  players: GamePlayers;
  onSubmitGuesses: (payload: SubmitEvaluationPayload) => void;
  cards: Dictionary<TextCard>;
  drawings: DrawingEntry[];
  subjectsIds: CardId[];
  descriptorsIds: CardId[];
  gameLanguage: Language;
} & Pick<StepProps, 'announcement'>;

export function StepEvaluate({
  players,
  onSubmitGuesses,
  cards,
  drawings,
  subjectsIds,
  descriptorsIds,
  announcement,
  user,
  gameLanguage,
}: StepEvaluateProps) {
  const { isLoading } = useLoading();

  const canvasWidth = useCardWidth(6, {
    gap: 16,
    minWidth: 120,
    maxWidth: 500,
  });
  const [canvasSize, setCanvasSize] = useGlobalLocalStorage('canvasSize');
  const {
    subjectGuesses,
    descriptorGuesses,
    activateItem,
    activeItem,
    matchedItems,
    resetGuesses,
    isComplete,
    randomSelection,
  } = useGuessing({
    drawings,
    userId: user.id,
    subjectsIds,
    descriptorsIds,
  });
  const [choseRandomly, setChoseRandomly] = useState(false);

  const onGuessForMe = () => {
    setChoseRandomly(true);
    randomSelection();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!canvasSize) {
      // Round to increments of 50
      setCanvasSize(Math.floor(canvasWidth / 50) * 50);
    }
  }, [canvasSize, canvasWidth]);

  useMock(() => {
    onGuessForMe();
  }, []);

  const descriptors = (
    <TitledContainer
      title={
        <Translate
          pt="Descritores"
          en="Descriptors"
        />
      }
    >
      <EvaluationAllDescriptors
        cards={cards}
        descriptorsIds={descriptorsIds}
        onSelect={activateItem}
        activeItem={activeItem}
        matchedItems={matchedItems}
      />
    </TitledContainer>
  );

  const subjects = (
    <TitledContainer
      title={
        <Translate
          pt="Sujeitos"
          en="Subjects"
        />
      }
    >
      <EvaluationAllSubjects
        cards={cards}
        subjectsIds={subjectsIds}
        onSelect={activateItem}
        activeItem={activeItem}
        matchedItems={matchedItems}
      />
    </TitledContainer>
  );

  return (
    <Step
      announcement={announcement}
      fullWidth
    >
      <StepTitle>
        <Translate
          pt="Adivinhação"
          en="Match the Pairs"
        />
      </StepTitle>

      <PopoverRule content={<EvaluationRules />} />
      <CanvasResizer />

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Faça pares com as cartas e os desenhos. Cada desenho tem um sujeito e um descritor
              correspondente.
              <br />
              Basta clicar em uma carta e depois em seu desenho correspondente.
              <br />
              Para refazer, basta reselecionar o desenho ou carta normalmente.
              <br />
              Quando estiver pronto, clique em <b>Enviar sua avaliação</b>.
            </>
          }
          en={
            <>
              Match the cards and drawings. Each drawing has a corresponding subject and descriptor.
              <br />
              Simply click on a card and then on its corresponding drawing.
              <br />
              To redo, just reselect the drawing or card normally.
              <br />
              When you're ready, click <b>Send evaluation</b>.
            </>
          }
        />
      </RuleInstruction>

      <Space orientation="vertical">
        <SpaceContainer wrap>
          <Button
            type="default"
            icon={<ClearOutlined />}
            onClick={resetGuesses}
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
            disabled={isLoading || isComplete}
          >
            <Translate
              pt="Chutar restantes"
              en="Guess for me"
            />
          </Button>
          <SendButton
            onClick={() =>
              onSubmitGuesses({
                guesses: prepareGuesses(drawings, subjectGuesses, descriptorGuesses),
                choseRandomly,
              })
            }
            disabled={!isComplete}
            icon={<CloudUploadOutlined />}
          >
            <Translate
              pt="Enviar sua avaliação"
              en="Send evaluation"
            />
          </SendButton>
        </SpaceContainer>

        <EvaluationAllDrawings
          players={players}
          cards={cards}
          drawings={drawings}
          onSelect={activateItem}
          subjectGuesses={subjectGuesses}
          descriptorGuesses={descriptorGuesses}
          gameLanguage={gameLanguage}
          activeItem={activeItem}
        />

        {gameLanguage === 'pt' ? subjects : descriptors}

        {gameLanguage === 'pt' ? descriptors : subjects}
      </Space>
    </Step>
  );
}

const prepareGuesses = (
  drawings: DrawingEntry[],
  subjectGuesses: StringDictionary,
  descriptorGuesses: StringDictionary,
) => {
  const guesses: ArrayDictionary<CardId> = {};

  drawings.forEach(({ playerId }) => {
    guesses[playerId] = [descriptorGuesses[playerId], subjectGuesses[playerId]];
  });

  return guesses;
};
