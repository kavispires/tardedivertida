import { Divider, Flex, Typography } from 'antd';
import { useLoading } from 'hooks/useLoading';
import { Solutions } from '../utils/types';
import { Translate } from 'components/language';
import { CircleHighlight } from './Highlights';
import { YesNoSwitch } from './YesNoSwitch';
import { Fragment, useMemo } from 'react';
import { countWordProperties } from '../utils/helper';

type SolutionProps = {
  solutions: Solutions;
  attribute?: string;
  word?: string;
  context?: string;
  setAttribute?: (value: string) => void;
  setWord?: (value: string) => void;
  setContext?: (value: string) => void;
  showHints?: boolean;
  itemName?: string;
};

export function Solution({
  solutions,
  attribute,
  word,
  context,
  setAttribute,
  setWord,
  setContext,
  showHints,
  itemName,
}: SolutionProps) {
  const { isLoading } = useLoading();

  return (
    <div>
      <Typography.Paragraph>
        <CircleHighlight color="blue">
          <Translate en="Attribute" pt="Atributo" />
        </CircleHighlight>
        {solutions.attribute.text}

        {!!setAttribute && (
          <>
            {' '}
            <YesNoSwitch
              loading={isLoading}
              checked={!!attribute}
              onChange={(checked) => setAttribute(checked ? 'A' : '')}
            />
          </>
        )}
      </Typography.Paragraph>
      {showHints && <AttributeHints />}
      <Divider />
      <Typography.Paragraph>
        <CircleHighlight color="gold">
          <Translate en="Word" pt="Palavra" />
        </CircleHighlight>
        {solutions.word.text}

        {!!setWord && (
          <>
            {' '}
            <YesNoSwitch
              loading={isLoading}
              checked={!!word}
              onChange={(checked) => setWord(checked ? 'W' : '')}
            />
          </>
        )}
      </Typography.Paragraph>
      {showHints && itemName && <WordHints word={itemName} />}

      {solutions.context && (
        <>
          <Divider />
          <Typography.Paragraph>
            <CircleHighlight color="red">
              <Translate en="Context" pt="Contexto" />
            </CircleHighlight>
            {solutions.context.text}
            {!!setContext && (
              <>
                {' '}
                <YesNoSwitch
                  loading={isLoading}
                  checked={!!context}
                  onChange={(checked) => setContext(checked ? 'C' : '')}
                />
              </>
            )}
          </Typography.Paragraph>
          {showHints && <ContextHints />}
        </>
      )}
    </div>
  );
}

function AttributeHints() {
  return (
    <Flex wrap="wrap" gap={8} className="venn-word-hints">
      <Translate
        en="When describing this thing, would you use this in your top 10 things about it?"
        pt="Ao descrever essa coisa, você usaria esse atributo dentre os 10 principais pontos sobre ela?"
      />
    </Flex>
  );
}

function WordHints({ word }: { word: string }) {
  const hintsObj = useMemo(() => countWordProperties(word), [word]);

  const getCheckIcon = (value: boolean) => (value ? '✅' : '❌');

  const hints = [
    <>
      <Translate en="Letters" pt="Letras" />: {hintsObj.letters}
    </>,

    <>
      <Translate en="Vowels" pt="Vogais" />: {hintsObj.vowels}
    </>,
    <>
      <Translate en="Consonants" pt="Consoantes" />: {hintsObj.consonants}
    </>,
    <>
      <Translate en="Number of words" pt="Número de palavras" />: {hintsObj.numberOfWords}
    </>,
    <>
      <Translate en="Repeated vowels" pt="Repetição de vogais" />: {getCheckIcon(hintsObj.hasRepeatedVowels)}
    </>,
    <>
      <Translate en="Repeated consonants" pt="Repetição de consoantes" />:{' '}
      {getCheckIcon(hintsObj.hasRepeatedConsonants)}
    </>,
    <>
      <Translate en="Consecutive vowels" pt="Vogais consecutivas" />: {hintsObj.consecutiveVowels}
    </>,
    <>
      <Translate en="Consecutive consonants" pt="Consoantes consecutivas" />: {hintsObj.consecutiveConsonants}
    </>,
    <>
      <Translate en="Hyphen" pt="Hífen" />: {getCheckIcon(hintsObj.hasHyphen)}
    </>,
    <>
      <Translate en="Accents" pt="Acentos" />: {getCheckIcon(hintsObj.hasAccents)}
    </>,
  ];

  return (
    <Flex wrap="wrap" gap={8} className="venn-word-hints">
      {hints.map((hint, index) => (
        <div key={index}>{hint}</div>
      ))}
    </Flex>
  );
}

function ContextHints() {
  return (
    <Flex wrap="wrap" gap={8} className="venn-word-hints">
      <Translate
        en="Always think in a general consensus. In a common situation would people say it fits? No technicalities."
        pt="Pense sempre em senso comum. Em uma situação geral, as pessoas diriam que se encaixa? Sem tecnicalidades."
      />
    </Flex>
  );
}
