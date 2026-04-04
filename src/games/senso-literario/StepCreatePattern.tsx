import { sample } from 'lodash';
import { useState } from 'react';
// Ant Design Resources
import { EllipsisOutlined, StarFilled } from '@ant-design/icons';
import { Flex, Segmented } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons/SendButton';
import { BookPatternCard } from 'components/cards/BookPatternCard';
import { DevButton } from 'components/debug/DevButton';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { SpaceFloat } from 'components/layout/SpaceFloat';
import { Step, type StepProps } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
import { TextHighlight } from 'components/text/TextHighlight';
// Internal
import { COLORS, GENRES, LETTERS } from './utils/constants';
import type { SubmitPatternPayload } from './utils/types';
import { mockBookPattern } from './utils/mock';

type StepCreatePatternProps = {
  players: GamePlayers;
  user: GamePlayer;
  sequence: string[];
  onSubmitPattern: (payload: SubmitPatternPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepCreatePattern({ announcement, sequence, onSubmitPattern }: StepCreatePatternProps) {
  const cardWidth = useCardWidth(5, { maxWidth: 128 });
  const { language } = useLanguage();
  const [color, setColor] = useState<string>((sample(COLORS) ?? COLORS[0]).key);
  const [genre, setGenre] = useState<string>((sample(GENRES) ?? GENRES[0]).key);
  const [letter, setLetter] = useState<string>(sample(LETTERS) ?? LETTERS[0]);

  const currentPatternId = `${color}-${genre}-${letter}`;

  useMock(() => {
    onSubmitPattern({ patternId: mockBookPattern(sequence) });
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={
            <>
              Qual livro vai no lugar do <TextHighlight>?</TextHighlight> ?
            </>
          }
          en={
            <>
              Which book goes in the <TextHighlight>?</TextHighlight> spot?
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              A sequência abaixo é formata de cartas que tem 3 atributos diferentes:
              <br />O <TextHighlight>gênero</TextHighlight> do livro: Romance, Infantil ou Técnico.
              <br />A <TextHighlight>cor</TextHighlight> da capa: Vermelha, Azul ou Amarela.
              <br />A <TextHighlight>letra</TextHighlight> inicial do título: A, B, C, D ou E.
              <br />
              Porém um livro está faltando!
            </>
          }
          en={
            <>
              The sequence below is made up of cards that have 3 different attributes:
              <br />
              The book genre: Romance, Children or Technical.
              <br />
              The cover color: Red, Blue or Yellow.
              <br />
              The initial letter of the title: A, B, C, D or E.
              <br />
              But one book is missing!
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer>
        {sequence.map((patternId, index) => (
          <BookPatternCard
            patternId={patternId}
            key={index}
            cardWidth={cardWidth}
          />
        ))}
      </SpaceContainer>

      <RuleInstruction type="action">
        <Translate
          en={
            <>
              Craft your book cover by selecting a color, a genre, and a letter. The goal is to match what
              other players are thinking by doing a book cover pattern that best matches theirs.
            </>
          }
          pt={
            <>
              Monte sua capa escolhendo uma cor, um gênero e uma letra. O objetivo é combinar com o que os
              outros jogadores estão pensando, fazendo um padrão de capa que mais se aproxime do deles.
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer>
        <Flex
          vertical
          gap={12}
        >
          <Segmented
            options={COLORS.map((entry) => ({
              label: entry[language],
              value: entry.key,
              icon:
                entry.key === color ? <StarFilled /> : <EllipsisOutlined style={{ color: 'transparent' }} />,
            }))}
            value={color}
            onChange={setColor}
          />
          <Segmented
            options={GENRES.map((entry) => ({
              label: entry[language],
              value: entry.key,
              icon:
                entry.key === genre ? <StarFilled /> : <EllipsisOutlined style={{ color: 'transparent' }} />,
            }))}
            value={genre}
            onChange={setGenre}
          />
          <Segmented
            options={LETTERS.map((l) => ({
              label: l,
              value: l,
              icon: l === letter ? <StarFilled /> : <EllipsisOutlined style={{ color: 'transparent' }} />,
            }))}
            block
            value={letter}
            onChange={setLetter}
          />
        </Flex>

        <BookPatternCard
          patternId={currentPatternId}
          cardWidth={cardWidth}
        />
      </SpaceContainer>

      <SpaceFloat>
        <SendButton
          size="large"
          onClick={() => onSubmitPattern({ patternId: currentPatternId })}
        >
          <Translate
            pt="Enviar padrão"
            en="Submit pattern"
          />
        </SendButton>
        <DevButton
          onClick={() => {
            const newPattern = mockBookPattern(sequence);
            setColor(newPattern.split('-')[0]);
            setGenre(newPattern.split('-')[1]);
            setLetter(newPattern.split('-')[2]);
          }}
        />
      </SpaceFloat>
    </Step>
  );
}
