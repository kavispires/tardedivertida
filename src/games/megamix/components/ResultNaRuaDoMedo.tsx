// Utils
import { LETTERS } from 'utils/constants';
// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { HouseCard } from 'games/na-rua-do-medo/components/HouseCard';
import { WinningCount } from './WinningCount';

export function ResultNaRuaDoMedo({ task, winningValues, winningTeam }: ResultComponentProps) {
  if (task.variant === 'house') {
    const winningCards: NCard[] = task.data.options.filter((option: PlainObject) => {
      return winningValues.includes(option.id);
    });

    return (
      <>
        <WinningCount>{winningTeam.length}</WinningCount>
        <Instruction>
          <Translate pt="A escolha mais popular foi" en="The most popular choice was" />:
        </Instruction>
        <div className="task-result-values__cards">
          {winningCards.map((card) => (
            <div key={card.id} className="task-result-values__text-value">
              <HouseCard card={card} candyLeftover={0} preview={false} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <WinningCount>{winningTeam.length}</WinningCount>
      <Instruction>
        <Translate pt="A rua mais votada foi" en="The most voted street was" />:
      </Instruction>
      <div className="task-result-values__cards">
        {winningValues.map((value) => (
          <div key={value} className="task-result-values__text-value">
            {LETTERS[Number(value)]}
          </div>
        ))}
      </div>
    </>
  );
}