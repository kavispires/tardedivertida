// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { WinningCount } from '../WinningCount';

export function ResultMegamix({ track, winningValues, winningTeam }: ResultComponentProps) {
  return (
    <>
      <WinningCount>{winningTeam.length}</WinningCount>
      <Instruction>
        <Translate pt="O mais votado foi" en="The most popular was" />:
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div key={value} className="track-result-values__text-value">
            {track.data.card.options[Number(value)]}
          </div>
        ))}
      </div>
    </>
  );
}
