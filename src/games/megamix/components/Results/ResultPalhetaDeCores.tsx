// Components
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { ResultComponentProps } from '../../utils/types';
import { SplatterSVG } from '../Tracks/TrackPalhetaDeFores';

export function ResultPalhetaDeCores({ winningValues }: ResultComponentProps) {
  return (
    <>
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate pt="As amostras mais selecionadas foram" en="The most selected swatches were" />
        ) : (
          <Translate pt="A amostra mais selecionada foi" en="The most selected swatch was" />
        )}
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div key={value} className="track-result-values__text-value">
            <SplatterSVG color={value} style={{ color: value }} width={48} />
          </div>
        ))}
      </div>
    </>
  );
}
