import { CanvasSVG } from 'components/canvas';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { useCardWidth } from 'hooks/useCardWidth';

export function ResultArteRuim({ task, winningValues }: ResultComponentProps) {
  const width = useCardWidth(winningValues.length + 1, 9, 80, 200, 0, 'results-values');

  if (task.variant === 'drawings') {
    const winningArtworks: PlainObject[] = task.data.options.filter((option: PlainObject) => {
      return winningValues.includes(option.playerId);
    });

    return (
      <>
        <Instruction>
          <Translate pt="A arte mais votada foi" en="The most popular art was" />:
        </Instruction>
        <div className="task-result-values__cards">
          {winningArtworks.map((value) => (
            <div key={value.playerId} className="task-result-values__text-value">
              <CanvasSVG drawing={value.drawing} size={width} className="a-drawing" />
            </div>
          ))}
        </div>
      </>
    );
  }

  const winningCards: PlainObject[] = task.data.cards.filter((option: PlainObject) => {
    return winningValues.includes(option.id);
  });

  return (
    <>
      <Instruction>
        <Translate pt="O mais votado foi" en="The most popular was" />:
      </Instruction>
      <div className="task-result-values__cards">
        {winningCards.map((value) => (
          <div key={value.id} className="task-result-values__text-value">
            {value.text}
          </div>
        ))}
      </div>
    </>
  );
}
