// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CanvasSVG } from 'components/canvas';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultRetratoFalado({ track, winningValues, containerWidth }: ResultComponentProps) {
  const width = useCardWidth(winningValues.length + 1, {
    gap: 9,
    minWidth: 80,
    maxWidth: 200,
    containerWidth,
  });

  const winningArtworks: PlainObject[] = track.data.options.filter((option: PlainObject) => {
    return winningValues.includes(option.playerId);
  });

  return (
    <>
      <Instruction>
        <Translate
          pt="O monstro escolhido foi"
          en="The best monster was"
        />
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningArtworks.map((value) => (
          <div
            className="track-result-values__text-value"
            key={value.drawing}
          >
            <CanvasSVG
              drawing={value.drawing}
              width={width}
              className="a-drawing"
            />
          </div>
        ))}
      </div>
    </>
  );
}
