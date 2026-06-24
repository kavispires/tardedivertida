// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultOndaTelepatica({ winningValues }: ResultComponentProps) {
  return (
    <>
      <Surface>
        {winningValues.length > 1 ? (
          <Translate
            pt="As votadas foram"
            en="Most voted options are"
          />
        ) : (
          <Translate
            pt="A mais votada foi"
            en="Most voted option is"
          />
        )}
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div
            key={value}
            className="track-result-values__text-value"
          >
            {value === 'center' && (
              <Translate
                pt="Centro"
                en="Center"
              />
            )}
            {value === 'left' && (
              <Translate
                pt="Esquerda"
                en="Left"
              />
            )}
            {value === 'right' && (
              <Translate
                pt="Direita"
                en="Right"
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
