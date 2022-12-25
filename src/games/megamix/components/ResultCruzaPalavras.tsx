// AntDesign Resources
// Hooks
// Utils
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { WinningCount } from './WinningCount';

export function ResultCruzaPalavras({ task, winningValues, winningTeam }: ResultComponentProps) {
  const cheatSheet: PlainObject = {
    0: [task.data.cards[0].text, task.data.cards[2].text],
    1: [task.data.cards[0].text, task.data.cards[3].text],
    2: [task.data.cards[1].text, task.data.cards[2].text],
    3: [task.data.cards[1].text, task.data.cards[3].text],
  };

  return (
    <>
      <WinningCount>{winningTeam.length}</WinningCount>
      <Instruction>
        <Translate pt="O mais votado foi" en="The most popular was" />:
      </Instruction>
      <div className="task-result-values__cards">
        {winningValues.map((value) => (
          <div key={value} className="task-result-values__text-value">
            {cheatSheet[value][0]} {'+'} {cheatSheet[value][1]}
          </div>
        ))}
      </div>
    </>
  );
}
