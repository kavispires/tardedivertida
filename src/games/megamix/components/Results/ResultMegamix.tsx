// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

export function ResultMegamix({ track, winningValues, winningTeam, playersList }: ResultComponentProps) {
  return (
    <>
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
