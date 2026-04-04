// Components
import { Translate } from 'components/language/Translate';
import { Instruction } from 'components/text/Instruction';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultText({ winningValues }: ResultComponentProps) {
  return (
    <>
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate
            pt="As votadas foram"
            en="Most voted options are"
          />
        ) : (
          <Translate
            pt="A mais votada foi"
            en="Most voted option is"
          />
        )}
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div
            key={value}
            className="track-result-values__text-value"
          >
            {value}
          </div>
        ))}
      </div>
    </>
  );
}
