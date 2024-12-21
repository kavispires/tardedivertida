import { useMemo } from 'react';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { GamblingChipIcon } from 'icons/GamblingChipIcon';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';
import { FloatingHand } from 'components/general/FloatingHand';
import { ImageBlurButtonContainer } from 'components/image-cards';
import { Translate } from 'components/language';
// Internal
import type { Bet, Bracket } from '../utils/type';
import { findBetContenders } from '../utils/helpers';

type BetsFloatingHandProps = {
  bets: Bet;
  brackets: Bracket[];
  selectedContenderId?: CardId;
};

export function BetsFloatingHand({ bets, brackets, selectedContenderId = '' }: BetsFloatingHandProps) {
  const cardWidth = useCardWidth(5, { minWidth: 100 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const { quarterCard, semiCard, finalCard, selectedCard } = useMemo(
    () => findBetContenders(brackets, bets, selectedContenderId),
    [bets?.final, bets?.quarter, bets?.semi],
  );

  if (!quarterCard || !semiCard || !finalCard) return <></>;

  return (
    <FloatingHand title={<Translate pt="Suas Apostas" en="Your Bets" />} icon={<GamblingChipIcon />}>
      <div className="w-bets-floating-hand">
        <ul className="w-floating-bets">
          <li className="w-floating-bets__entry">
            <span className="w-floating-bets__label">
              <Translate pt="Quartas de finais" en="Quarterfinals" />
            </span>
            <CharacterCard character={quarterCard} overlayColor="gray" size={cardWidth} />
          </li>

          <li className="w-floating-bets__entry">
            <span className="w-floating-bets__label">
              <Translate pt="Semifinais" en="Semifinals" />
            </span>
            <CharacterCard character={semiCard} overlayColor="gray" size={cardWidth} />
          </li>

          <li className="w-floating-bets__entry">
            <span className="w-floating-bets__label">
              <Translate pt="Final" en="Final" />
            </span>
            <CharacterCard character={finalCard} overlayColor="gray" size={cardWidth} />
          </li>

          {!!selectedCard && (
            <li className="w-floating-bets__entry w-floating-bets__entry--your-contender">
              <span className="w-floating-bets__label">
                <Translate pt="Seu competidor" en="Your contender" />
              </span>
              <ImageBlurButtonContainer cardId={selectedCard.id}>
                <CharacterCard character={selectedCard} overlayColor="gray" size={cardWidth} />
              </ImageBlurButtonContainer>
            </li>
          )}
        </ul>
      </div>
    </FloatingHand>
  );
}
