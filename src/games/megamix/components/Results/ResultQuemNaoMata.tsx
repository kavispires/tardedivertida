// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultQuemNaoMata({ winningValues, players }: ResultComponentProps) {
  return (
    <>
      <Surface>
        {winningValues.length > 1 ? (
          <Translate
            pt="Os jogadores mais foram"
            en="Most voted players are"
          />
        ) : (
          <Translate
            pt="O jogador mais votado foi"
            en="Most voted player is"
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
            <PlayerAvatarName player={players[value]} />
          </div>
        ))}
      </div>
    </>
  );
}
