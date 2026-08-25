// Components
import {
  AnswerKindaNoButton,
  AnswerMaybeYesButton,
  AnswerNoButton,
  AnswerYesButton,
} from '@components/buttons/AnswerButtons';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultTaNaCara({ winningValues }: ResultComponentProps) {
  return (
    <>
      <Surface>
        {winningValues.length > 1 ? (
          <Translate
            pt="As respostas votadas foram"
            en="Most voted answers are"
          />
        ) : (
          <Translate
            pt="A resposta mais votada foi"
            en="Most voted answer is"
          />
        )}
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div
            key={`answer-${value}`}
            className="track-result-values__text-value"
          >
            {value === '-2' && <AnswerNoButton />}
            {value === '-1' && <AnswerKindaNoButton />}
            {value === '1' && <AnswerMaybeYesButton />}
            {value === '2' && <AnswerYesButton />}
          </div>
        ))}
      </div>
    </>
  );
}
