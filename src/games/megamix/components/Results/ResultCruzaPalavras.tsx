// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultCruzaPalavras({ track, winningValues }: ResultComponentProps) {
  const cheatSheet: PlainObject = {
    0: [track.data.cards[0].text, track.data.cards[2].text],
    1: [track.data.cards[0].text, track.data.cards[3].text],
    2: [track.data.cards[1].text, track.data.cards[2].text],
    3: [track.data.cards[1].text, track.data.cards[3].text],
  };

  return (
    <>
      <Instruction>
        <Translate
          pt="O mais votado foi"
          en="The most popular was"
        />
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div
            key={value}
            className="track-result-values__text-value"
          >
            {cheatSheet[value][0]} {'+'} {cheatSheet[value][1]}
          </div>
        ))}
      </div>
    </>
  );
}
