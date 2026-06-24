// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Components
import { CanvasSVG } from '@components/canvas/CanvasSVG';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultArteRuim({ track, winningValues, containerWidth }: ResultComponentProps) {
  const width = useCardWidth(winningValues.length + 1, {
    gap: 9,
    minWidth: 80,
    maxWidth: 200,
    containerWidth,
  });

  if (track.variant === 'drawings') {
    const winningArtworks: PlainObject[] = track.data.options.filter((option: PlainObject) => {
      return winningValues.includes(option.playerId);
    });

    return (
      <>
        <Surface>
          <Translate
            pt="A arte mais votada foi"
            en="The most popular art was"
          />
          :
        </Surface>
        <div className="track-result-values__cards">
          {winningArtworks.map((value) => (
            <div
              key={value.playerId}
              className="track-result-values__text-value"
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

  const winningCards: PlainObject[] = track.data.cards.filter((option: PlainObject) => {
    return winningValues.includes(option.id);
  });

  return (
    <>
      <Surface>
        <Translate
          pt="O mais votado foi"
          en="The most popular was"
        />
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningCards.map((value) => (
          <div
            key={value.id}
            className="track-result-values__text-value"
          >
            {value.text}
          </div>
        ))}
      </div>
    </>
  );
}
