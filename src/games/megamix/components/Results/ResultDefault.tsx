// Types
import type { ResultComponentProps } from '../../utils/types';
// Components
import { Instruction } from 'components/text';
import { Translate } from 'components/language';

export function ResultDefault({ winningTeam, winningValues, playersList }: ResultComponentProps) {
  return (
    <>
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate pt="As votadas foram" en="Most voted ones are" />
        ) : (
          <Translate pt="A mais votada foi" en="Most voted one is" />
        )}
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div key={value} className="track-result-values__text-value">
            {value}
          </div>
        ))}
      </div>
    </>
  );
}
