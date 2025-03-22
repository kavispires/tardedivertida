import { useMemo, useState } from 'react';
// Ant Design Resources
import { Button, Collapse, type CollapseProps, Flex, Input, Slider, Tag } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
import { useStep } from 'hooks/useStep';
// Components
import { SendButton } from 'components/buttons';
import { Card } from 'components/cards';
import { ItemCard } from 'components/cards/ItemCard';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitWordPayload, WordLength } from './utils/types';
import { mockNewWord } from './utils/mock';
import { WORD_LENGTH_STATUS } from './utils/constants';
import { ItemsGrid } from './components/ItemsGrid';
import { WordLengths } from './components/WordLengths';

type StepCreateWordProps = {
  players: GamePlayers;
  user: GamePlayer;
  items: string[];
  beginsWith: string;
  endsWith: string;
  wordLengths: WordLength[];
  onSubmitWord: (payload: SubmitWordPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepCreateWord({
  announcement,
  items,
  beginsWith,
  endsWith,
  wordLengths,
  onSubmitWord,
}: StepCreateWordProps) {
  const { dualTranslate } = useLanguage();
  const [beginsWithName, setBeginsWithName] = useState('');
  const [endsWithName, setEndsWithName] = useState('');
  const [beginningIndex, setBeginningIndex] = useState(0);
  const [endingIndex, setEndingIndex] = useState(0);
  const { step, goToNextStep, goToPreviousStep } = useStep(1);

  const newWord = useMemo(() => {
    const begin = beginsWithName.slice(0, beginningIndex + 1);
    const end = endsWithName.slice(endingIndex - beginsWithName.length - 1);
    return begin + end;
  }, [beginsWithName, endsWithName, beginningIndex, endingIndex]);

  const onBeginWithNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBeginsWithName(value);
    setBeginningIndex(0);
  };

  const onEndWithNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndsWithName(value);
    setEndingIndex(beginsWithName.length + value.length);
  };

  const onUpdateIndexes = (values: number[]) => {
    setBeginningIndex(values[0]);
    setEndingIndex(values[1]);
  };

  const isWordValid = wordLengths.some(
    (wl) => wl.status !== WORD_LENGTH_STATUS.SOLVED && wl.wordLength === newWord.length,
  );

  const onCompleteNewWord = () => {
    onSubmitWord({
      names: [beginsWithName, endsWithName],
      newWord,
      indexes: [beginningIndex, endingIndex - beginsWithName.length - 1],
    });
  };

  useMock(() => {
    onSubmitWord(mockNewWord(wordLengths));
  });

  const steps: CollapseProps['items'] = [
    {
      key: 1,
      label: <Translate pt="Passo 1: Nomeie os itens" en="Step 1: Name the items" />,
      children: (
        <>
          <RuleInstruction type="action" className="no-margin">
            <Translate
              pt={<>Passo 1: Primeiro você deve nomear as duas coisas.</>}
              en={<>Step 1: You must name two things</>}
            />
          </RuleInstruction>

          <div className="new-word-items-grid contained">
            <Flex vertical gap={4} align="center">
              <ItemCard id={beginsWith} className="item-forced-outline" width={100} />
              <Input
                autoComplete="off"
                value={beginsWithName}
                onChange={onBeginWithNameChange}
                placeholder={dualTranslate({ pt: 'Escreva o nome', en: 'Write the name' })}
                className="uppercase"
              />
            </Flex>

            <Flex vertical gap={4} align="center">
              <ItemCard id={endsWith} className="item-forced-outline" width={100} />
              <Input
                autoComplete="off"
                value={endsWithName}
                onChange={onEndWithNameChange}
                placeholder={dualTranslate({ pt: 'Escreva o nome', en: 'Write the name' })}
                className="uppercase"
              />
            </Flex>
          </div>
          <SpaceContainer>
            <DevButton onClick={() => onSubmitWord(mockNewWord(wordLengths))}>Mock</DevButton>
            <Button
              type="primary"
              disabled={beginsWithName.length < 3 || endsWithName.length < 3}
              onClick={goToNextStep}
            >
              <Translate pt="Próximo passo" en="Next step" />
            </Button>
          </SpaceContainer>
        </>
      ),
    },
    {
      key: 2,
      label: <Translate pt="Passo 2: Crie a palavra-valise" en="Step 2: Create the portmanteau" />,
      children: (
        <>
          <RuleInstruction type="action">
            <Translate
              en={
                <>
                  Then, you must create a new word that starts with the first thing and ends with the second
                  thing that fits of the word lengths available.
                </>
              }
              pt={
                <>
                  Crie uma nova palavra que começa com a primeira coisa e termina com a segunda coisa que se
                  encaixe nos comprimentos de palavras disponíveis.
                </>
              }
            />
          </RuleInstruction>

          {step === 2 && (
            <SpaceContainer key={`${beginsWithName}-${endsWithName}`}>
              <div style={{ minWidth: 500 }}>
                <Flex justify="space-between" gap={32}>
                  <div>
                    {beginsWithName.split('').map((l, i) => (
                      <Tag
                        key={`${l}-${i}`}
                        color={i <= beginningIndex ? 'red-inverse' : undefined}
                        className="origin-word"
                      >
                        {l}
                      </Tag>
                    ))}
                  </div>
                  <div>
                    {endsWithName.split('').map((l, i) => (
                      <Tag
                        key={`${l}-${i}`}
                        color={i >= endingIndex - beginsWithName.length - 1 ? 'blue-inverse' : undefined}
                        className="origin-word"
                      >
                        {l}
                      </Tag>
                    ))}
                  </div>
                </Flex>
                <Slider
                  range
                  defaultValue={[beginningIndex, endingIndex]}
                  min={0}
                  max={beginsWithName.length + endsWithName.length}
                  disabled={beginsWithName.length < 3 || endsWithName.length < 3}
                  onChange={(values) => onUpdateIndexes(values as [number, number])}
                />
              </div>
            </SpaceContainer>
          )}

          <SpaceContainer direction="vertical">
            <Card
              header={dualTranslate({
                en: `Your new word (${newWord.length} letters)`,
                pt: `Sua nova palavra (${newWord.length} letras)`,
              })}
            >
              {newWord}
            </Card>
          </SpaceContainer>

          <WordLengths wordLengths={wordLengths} highlightLength={newWord.length} phase="WORD_CREATION" />

          <SpaceContainer>
            <Button onClick={goToPreviousStep}>
              <Translate pt="Voltar" en="Back" />
            </Button>
            <SendButton size="large" disabled={!isWordValid} onClick={onCompleteNewWord}>
              <Translate pt="Enviar Nova Palavra" en="Send New Word" />
            </SendButton>
          </SpaceContainer>
        </>
      ),
    },
  ];

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt={<>Crie a nova palavra</>} en={<>Create the new word</>} />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          en={
            <>
              From the items below, two of them were draft to be the beginning and the end of your new word.
            </>
          }
          pt={
            <>Dos itens abaixo, dois deles foram escolhidos para ser o começo e o fim da sua nova palavra.</>
          }
        />
      </RuleInstruction>

      <ItemsGrid items={items} targets={[beginsWith, endsWith]} selectedItems={[]} />

      <Collapse items={steps} className="contained" accordion activeKey={step} />
    </Step>
  );
}
