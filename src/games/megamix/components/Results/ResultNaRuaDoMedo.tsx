import { HouseCard } from '@games/na-rua-do-medo/components/HouseCard';
// Utils
import { LETTERS } from '@utils/constants';
// Components
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps, StreetCard } from '../../utils/types';

export function ResultNaRuaDoMedo({ track, winningValues, winningTeam, playersList }: ResultComponentProps) {
  if (track.variant === 'house') {
    const winningCards: StreetCard[] = track.data.options.filter((option: PlainObject) => {
      return winningValues.includes(option.id);
    });

    return (
      <>
        <Surface>
          <Translate
            pt="A escolha mais popular foi"
            en="The most popular choice was"
          />
          :
        </Surface>
        <div className="track-result-values__cards">
          {winningCards.map((card) => (
            <div
              key={card.id}
              className="track-result-values__text-value"
            >
              <HouseCard
                card={card}
                candyLeftover={0}
                preview={false}
              />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <Surface>
        <Translate
          pt="A rua mais votada foi"
          en="The most voted street was"
        />
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div
            key={value}
            className="track-result-values__text-value"
          >
            {LETTERS[Number(value)]}
          </div>
        ))}
      </div>
    </>
  );
}
