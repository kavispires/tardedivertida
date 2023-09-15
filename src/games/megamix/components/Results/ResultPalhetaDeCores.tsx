import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { SplatterSVG } from '../Tracks/TrackPalhetaDeFores';

export function ResultPalhetaDeCores({ winningTeam, winningValues, playersList }: ResultComponentProps) {
  return (
    <>
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate pt="As amostras mais selecionadas foram" en="The most selected swatches were" />
        ) : (
          <Translate pt="A amostra mais selecionada foi" en="The most selected swatch was" />
        )}
        :
        <Translate pt="Respostas mais dadas" en="Best answers" />:
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
