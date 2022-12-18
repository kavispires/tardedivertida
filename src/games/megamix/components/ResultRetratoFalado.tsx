import { CanvasSVG } from 'components/canvas';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
import { useCardWidth } from 'hooks/useCardWidth';

export function ResultRetratoFalado({ task, winningValues }: ResultComponentProps) {
  const width = useCardWidth(winningValues.length + 1, 9, 80, 200, 0, 'results-values');

  const winningArtworks: PlainObject[] = task.data.options.filter((option: PlainObject) => {
    return winningValues.includes(option.playerId);
  });

  return (
    <>
      <Instruction>
        <Translate pt="O monstro escolhido foi" en="The best monster was" />:
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
