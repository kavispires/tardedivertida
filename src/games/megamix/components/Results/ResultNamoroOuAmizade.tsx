// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { ResultComponentProps } from '../../utils/types';
import { Candidate } from '../Candidate';

export function ResultNamoroOuAmizade({
  track,
  winningValues,
  winningTeam,
  playersList,
}: ResultComponentProps) {
  return (
    <>
      <Instruction>
        <Translate pt="O melhor partido foi" en="The best match was" />:{' '}
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((value) => {
          const index = track.data.heads.findIndex((head: PlainObject) => head.id === value);
          return (
            <Candidate
              key={value}
              head={track.data.heads[index]}
              body={track.data.bodies[index]}
              interest={track.data.interests[index]}
              need={track.data.needs[index]}
              funFact={track.data.funFacts[index]}
            />
          );
        })}
      </div>
    </>
  );
}
