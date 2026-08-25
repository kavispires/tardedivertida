// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import {
  AnswerKindaNoButton,
  AnswerMaybeYesButton,
  AnswerNoButton,
  AnswerYesButton,
} from '@components/buttons/AnswerButtons';
import { SuspectCard } from '@components/cards/SuspectCard';
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { TrackProps } from '../../utils/types';
import { mockSelection } from '../../utils/mock';
import { MinigameTitle } from '../MinigameTitle';

export const TrackTaNaCara = ({ track, onSubmitAnswer }: TrackProps) => {
  const cardWidth = useCardWidth(8, { gap: 8, minWidth: 150, maxWidth: 350, margin: 8 });
  const { isLoading } = useLoading();
  const { translate } = useLanguage();

  const onSelect = (value: -2 | -1 | 1 | 2) => {
    onSubmitAnswer({
      data: { value },
    });
  };

  // DEV Mock
  useMock(() => {
    onSelect(mockSelection([-2, -1, 1, 2]));
  });

  return (
    <>
      <MinigameTitle title={{ pt: 'Tá Na Cara', en: 'Guess Who What?' }} />
      <RuleInstruction type="action">
        <Translate
          pt="É bem óbvio só de olhar pra essa pessoa. Mas só pra confirmar, responda essa pergunta de acordo
              com o que você acha."
          en="It's pretty obvious just by looking at this person. But just to confirm, answer this question:"
        />
      </RuleInstruction>

      <TextCard
        header={translate({ pt: 'Pergunta', en: 'Question' })}
        color="orange"
      >
        {track.data.question.statement}
      </TextCard>

      <SpaceContainer>
        <AnswerNoButton
          onClick={() => onSelect(-2)}
          disabled={isLoading}
        />
        <AnswerKindaNoButton
          onClick={() => onSelect(-1)}
          disabled={isLoading}
        />
        <SuspectCard
          suspect={track.data.suspect}
          width={cardWidth}
        />
        <AnswerMaybeYesButton
          onClick={() => onSelect(1)}
          disabled={isLoading}
        />
        <AnswerYesButton
          onClick={() => onSelect(2)}
          disabled={isLoading}
        />
      </SpaceContainer>
    </>
  );
};
