import { useMemo } from 'react';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { findBetContenders } from '../utils/helpers';
// Components
import { FloatingHand } from 'components/cards';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { ContenderCard } from './ContenderCard';

type BetsFloatingHandProps = {
  bets: WBets;
  brackets: WBracket[];
  selectedContenderId?: CardId;
};

export function BetsFloatingHand({ bets, brackets, selectedContenderId = '' }: BetsFloatingHandProps) {
  const cardWidth = useCardWidth(5, 32, 100);

  const { quarterCard, semiCard, finalCard, selectedCard } = useMemo(
    () => findBetContenders(brackets, bets, selectedContenderId),
    [bets.final, bets.quarter, bets.semi] // eslint-disable-line
  );

  if (!quarterCard || !semiCard || !finalCard) return <></>;

  return (
    <FloatingHand>
      <div className="w-bets-floating-hand">
        <Title size="xx-small" level={3}>
          <Translate pt="Suas Apostas" en="Your Bets" />
        </Title>

        <ul className="w-floating-bets">
          <li className="w-floating-bets__entry">
            <span className="w-floating-bets__label">
              <Translate pt="Quartas de finais" en="Quarterfinals" />
            </span>
            <ContenderCard contender={quarterCard!} overlayColor="gray" size={cardWidth} />
          </li>

          <li className="w-floating-bets__entry">
            <span className="w-floating-bets__label">
              <Translate pt="Semifinais" en="Semifinals" />
            </span>
            <ContenderCard contender={semiCard!} overlayColor="gray" size={cardWidth} />
          </li>

          <li className="w-floating-bets__entry">
            <span className="w-floating-bets__label">
              <Translate pt="Final" en="Final" />
            </span>
            <ContenderCard contender={finalCard!} overlayColor="gray" size={cardWidth} />
          </li>

          {Boolean(selectedCard) && (
            <li className="w-floating-bets__entry w-floating-bets__entry--your-contender">
              <span className="w-floating-bets__label">
                <Translate pt="Seu competidor" en="Your contender" />
              </span>
              <ContenderCard contender={selectedCard!} overlayColor="gray" size={cardWidth} />
            </li>
          )}
        </ul>
      </div>
    </FloatingHand>
  );
}
