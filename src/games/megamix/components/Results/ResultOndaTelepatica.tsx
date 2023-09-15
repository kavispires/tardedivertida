import { Instruction } from 'components/text';
import { Translate } from 'components/language';

export function ResultOndaTelepatica({ winningTeam, winningValues, playersList }: ResultComponentProps) {
  return (
    <>
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate pt="As votadas foram" en="Most voted ones are" />
        ) : (
          <Translate pt="A mais votada foi" en="Most voted one is" />
        )}
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div key={value} className="track-result-values__text-value">
            {value === 'center' && <Translate pt="Centro" en="Center" />}
            {value === 'left' && <Translate pt="Esquerda" en="Left" />}
            {value === 'right' && <Translate pt="Direita" en="Right" />}
          </div>
        ))}
      </div>
    </>
  );
}
