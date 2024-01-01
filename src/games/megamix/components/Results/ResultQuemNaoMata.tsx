// Types
import type { ResultComponentProps } from '../../utils/types';
// Components
import { Instruction } from 'components/text';
import { Translate } from 'components/language';
import { AvatarName } from 'components/avatars';

export function ResultQuemNaoMata({ winningValues, players }: ResultComponentProps) {
  return (
    <>
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate pt="Os jogadores mais foram" en="Most voted players are" />
        ) : (
          <Translate pt="O jogador mais votado foi" en="Most voted player is" />
        )}
        :
      </Instruction>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div key={value} className="track-result-values__text-value">
            <AvatarName player={players[value]} />
          </div>
        ))}
      </div>
    </>
  );
}
