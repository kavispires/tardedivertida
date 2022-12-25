// AntDesign Resources
// Hooks
// Utils
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { Candidate } from './TaskNamoroOuAmizade';
import { WinningCount } from './WinningCount';

export function ResultNamoroOuAmizade({ task, winningValues, winningTeam }: ResultComponentProps) {
  return (
    <>
      <WinningCount>{winningTeam.length}</WinningCount>
      <Instruction>
        <Translate pt="O melhor partido foi" en="The best match was" />:{' '}
      </Instruction>
      <div className="task-result-values__cards">
        {winningValues.map((value) => {
          const index = task.data.heads.findIndex((head: PlainObject) => head.id === value);
          return (
            <Candidate
              key={value}
              head={task.data.heads[index]}
              body={task.data.bodies[index]}
              interest={task.data.interests[index]}
              need={task.data.needs[index]}
              funFact={task.data.funFacts[index]}
            />
          );
        })}
      </div>
    </>
  );
}
