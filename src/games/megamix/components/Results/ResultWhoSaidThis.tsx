// Components
import { Card } from 'components/cards/Card';
import { Translate } from 'components/language/Translate';
import { PlayerAvatarCard } from 'components/player/PlayerAvatarCard';
import { Instruction } from 'components/text/Instruction';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultWhoSaidThis({ track, winningValues, players }: ResultComponentProps) {
  return (
    <>
      <Instruction>
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
      </Instruction>

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
        <Card
          size="small"
          hideHeader
        >
          "{track.data.card.text}"
        </Card>
      </div>
    </>
  );
}
