import { sampleSize, shuffle } from 'lodash';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { UndoOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
// Types
import type { TextCard } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useStep } from 'hooks/useStep';
// Utils
import { LETTERS } from 'utils/constants';
import { getColorFromIndex } from 'utils/helpers';
// Components
import { SendButton, TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitMetricsPayload, SubmitPoolPayload } from './utils/types';
import { EditableMetricsBoard } from './components/EditableMetricsBoard';

const TOTAL_WORDS = 4;

type StepBuildMetricsProps = {
  wordsDict: Dictionary<TextCard>;
  secretCardsOptionsIds: CardId[];
  availablePoolCardsIds: CardId[];
  poolIds?: CardId[];
  secretWordId?: CardId;
  metricsDescriptors: Record<string, TextCard[]>;
  onSubmitPool: (payload: SubmitPoolPayload) => void;
  onSubmitMetrics: (payload: SubmitMetricsPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepBuildMetrics({
  wordsDict,
  secretCardsOptionsIds,
  availablePoolCardsIds,
  metricsDescriptors,
  secretWordId,
  poolIds = [],
  onSubmitMetrics,
  onSubmitPool,
  announcement,
}: StepBuildMetricsProps) {
  const { dualTranslate } = useLanguage();
  const { step, goToNextStep, setStep } = useStep(secretWordId ? 3 : 1);
  const [selectedCardId, setSelectedCardId] = useState<CardId | null>(secretWordId || null);
  const [selectedWords, setSelectedWords] = useState<CardId[]>([]);
  const [metrics, setMetrics] = useState<Record<string, number>>({
    1: 3,
    2: 3,
    3: 3,
    4: 3,
    5: 3,
  });

  const onSelectWord = (cardId: CardId) => {
    setSelectedWords((prev) => {
      const newSelection = [...prev];
      if (newSelection.includes(cardId)) {
        return newSelection.filter((id) => id !== cardId);
      }
      if (prev.length === TOTAL_WORDS) {
        return prev;
      }
      return [...newSelection, cardId];
    });
  };

  const onRandomSelect = () => {
    const unusedCards = availablePoolCardsIds.filter((cardId) => !selectedWords.includes(cardId));
    setSelectedWords((prev) => {
      return [...prev, ...sampleSize(unusedCards, TOTAL_WORDS - prev.length).map((cardId) => cardId)];
    });
  };

  const onCompletePool = () => {
    if (selectedCardId) {
      onSubmitPool({
        poolIds: shuffle([...selectedWords, selectedCardId]),
        secretWordId: selectedCardId || '',
      });
    }
  };

  const selectedCard = wordsDict[selectedCardId || ''];
  const selectedCardIndex = secretCardsOptionsIds.findIndex((id) => id === secretWordId);

  const onCompleteMetrics = () => {
    onSubmitMetrics({ metrics });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: the only thing that matters is the secret word
  useEffect(() => {
    if (step < 3 && secretWordId) {
      setStep(3);
    }
  }, [secretWordId]);

  const handleMetricsChange = (metricId: string, value: number) => {
    setMetrics((prev) => ({
      ...prev,
      [metricId]: value,
    }));
  };

  return (
    <Step fullWidth announcement={announcement}>
      {step === 1 && (
        <>
          <StepTitle>
            <Translate pt="Qual será a palavra secreta?" en="Which will be the secret word?" />
          </StepTitle>

          <RuleInstruction type="action">
            <Translate
              en="First, from these two words, select the one you want to create the metrics for."
              pt="Primeiro, dentre estas duas palavras, selecione a que você quer usar para suas métricas."
            />
          </RuleInstruction>

          <SpaceContainer>
            {secretCardsOptionsIds.map((cardId, index) => {
              const card = wordsDict[cardId];
              return (
                <TransparentButton
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  active={selectedCardId === card.id}
                >
                  <Card header={LETTERS[index]} color={getColorFromIndex(index + 2)}>
                    {card.text}
                  </Card>
                </TransparentButton>
              );
            })}
          </SpaceContainer>

          <SpaceContainer>
            <Button size="large" type="primary" onClick={goToNextStep} disabled={!selectedCardId}>
              <Translate pt="Continuar" en="Continue" />
            </Button>
          </SpaceContainer>
        </>
      )}

      {step === 2 && (
        <>
          <StepTitle>
            <Translate
              pt="Quais outras palavras estão misturadas para os outros jogadores?"
              en="Which other words will be mixed for the other players?"
            />
          </StepTitle>

          <RuleInstruction type="action">
            <Translate
              en={
                <>
                  Now that you have the keyword, from these other words select <strong>4 words</strong> to be
                  part of the pool. Choose words that won't conflict with your keyword.
                </>
              }
              pt={
                <>
                  Agora que você tem a palavra-chave, selecione <strong>4 palavras</strong> para fazer parte
                  do pool. Escolha palavras que não entrem em conflito com sua palavra-chave.
                </>
              }
            />
          </RuleInstruction>

          <Card
            header={dualTranslate({ en: 'Keyword', pt: 'Palavra-chave' })}
            color={getColorFromIndex(selectedCardIndex + 2)}
          >
            {selectedCard.text}
          </Card>

          <SpaceContainer wrap>
            {availablePoolCardsIds.map((cardId) => {
              const card = wordsDict[cardId];
              return (
                <TransparentButton
                  key={card.id}
                  onClick={() => onSelectWord(card.id)}
                  active={selectedWords.includes(card.id)}
                >
                  <Card hideHeader>{card.text}</Card>
                </TransparentButton>
              );
            })}
          </SpaceContainer>

          <SpaceContainer>
            <Button
              size="large"
              onClick={onRandomSelect}
              disabled={selectedWords.length >= TOTAL_WORDS}
              icon={<UndoOutlined />}
            >
              <Translate pt="Aleatório" en="Random" />
            </Button>
            <SendButton
              size="large"
              onClick={onCompletePool}
              disabled={!selectedCardId || selectedWords.length !== TOTAL_WORDS}
            >
              <Translate pt="Enviar" en="Submit" />
            </SendButton>
          </SpaceContainer>
        </>
      )}

      {step === 3 && (
        <>
          <StepTitle>
            <Translate pt="Crie suas métricas" en="Create the metrics" />
          </StepTitle>

          <RuleInstruction type="action">
            <Translate
              en={
                <>
                  Finally, evaluate each of the 5 metrics by distributing the 6 pips between the 2 descriptors
                  that best describes your keyword so the players can try to guess it.
                  <br />
                  Just click on the descriptor to move the pips.
                </>
              }
              pt={
                <>
                  Por fim, avalie cada uma das 5 métricas distribuindo as 6 bolinhas entre os 2 descritores
                  que melhor descrevem sua palavra-chave para que os jogadores possam tentar adivinhá-la.
                  <br />
                  Basta clicar no descritor para mover as bolinhas.
                </>
              }
            />
          </RuleInstruction>

          <Card
            header={dualTranslate({ en: 'Keyword', pt: 'Palavra-chave' })}
            color={getColorFromIndex(selectedCardIndex + 3)}
          >
            {selectedCard.text}
          </Card>

          <EditableMetricsBoard
            metricsDescriptors={metricsDescriptors}
            evaluations={metrics}
            onChange={handleMetricsChange}
          />

          <SpaceContainer className="mt-6">
            <SendButton size="large" onClick={onCompleteMetrics}>
              <Translate pt="Enviar Métricas" en="Submit Metrics" />
            </SendButton>
          </SpaceContainer>

          <RuleInstruction type="tip">
            <Translate
              en={<>Here are the other words in case you need to verify any conflicts</>}
              pt={<>Aqui estão as outras palavras caso você precise verificar algum conflito</>}
            />
            <Flex justify="center">
              {poolIds.map((cardId) => {
                const card = wordsDict[cardId];
                return (
                  <Card key={card.id} hideHeader size="small">
                    {card.text}
                  </Card>
                );
              })}
            </Flex>
          </RuleInstruction>
        </>
      )}
    </Step>
  );
}
