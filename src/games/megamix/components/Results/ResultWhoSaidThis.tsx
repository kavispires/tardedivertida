// Components
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PlayerAvatarCard } from '@components/player/PlayerAvatarCard';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultWhoSaidThis({ track, winningValues, players }: ResultComponentProps) {
  return (
    <>
      <Surface>
        {winningValues.length > 1 ? (
          <Translate
            pt="O(a)s mais votado(a)s foram"
            en="Most voted players are"
          />
        ) : (
          <Translate
            pt="O(a) mais votado(a) foi"
            en="Most voted player is"
          />
        )}
        :
      </Surface>

      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div key={value}>
            <PlayerAvatarCard
              player={players[value]}
              withName
              size="small"
            />
          </div>
        ))}
      </div>
      <div className="track-result-values__cards">
        <TextCard size="small">"{track.data.card.text}"</TextCard>
      </div>
    </>
  );
}
