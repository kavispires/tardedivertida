// Components
import { PlayerAvatarCard } from 'components/avatars';
import { Card } from 'components/cards';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultWhoSaidThis({ track, winningValues, players }: ResultComponentProps) {
  return (
    <>
      <Instruction>
        {winningValues.length > 1 ? (
          <Translate
            pt="Os votadas foram"
            en="Most voted ones are"
          />
        ) : (
          <Translate
            pt="O mais votada foi"
            en="Most voted one is"
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
