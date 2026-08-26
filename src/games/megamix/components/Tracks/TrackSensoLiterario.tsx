// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { BookPatternCard } from '@components/cards/BookPatternCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackSensoLiterario = ({ track, onSubmitAnswer }: TrackProps) => {
  const cardWidth = useCardWidth(10, { gap: 8, minWidth: 96, maxWidth: 128, margin: 8 });
  const { isLoading } = useLoading();

  const onSelect = (value: string) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection(track.data.options));
  });

  return (
    <>
      <MinigameTitle track={track} />
      <RuleInstruction type="rule">
        <Translate
          pt="A sequência de livros está faltando um, qual é ele?"
          en="The sequence of books is missing one, which one is it?"
        />
      </RuleInstruction>

      <SpaceContainer>
        {track.data.sequence.map((bookId: string) => (
          <BookPatternCard
            key={bookId}
            patternId={bookId}
            cardWidth={cardWidth / 1.25}
          />
        ))}
      </SpaceContainer>

      <RuleInstruction type="action">
        <Translate
          pt="Selecione o livro:"
          en="Select the book:"
        />
      </RuleInstruction>

      <SpaceContainer>
        {track.data.options.map((bookId: string) => (
          <TransparentButton
            key={bookId}
            onClick={() => onSelect(bookId)}
            disabled={isLoading}
          >
            <BookPatternCard
              patternId={bookId}
              cardWidth={cardWidth}
            />
          </TransparentButton>
        ))}
      </SpaceContainer>
    </>
  );
};
