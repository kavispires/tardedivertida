import { useMemo } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { GamblingChipIcon } from 'icons/GamblingChipIcon';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';
import { FloatingHand } from 'components/general/FloatingHand';
import { ImageBlurButtonContainer } from 'components/image-cards/ImageBlurButtonContainer';
import { Translate } from 'components/language/Translate';
// Internal
import type { Bet, Bracket } from '../utils/type';
import { contenderWidthOptions, findBetContenders } from '../utils/helpers';

type BetsFloatingHandProps = {
  bets: Bet;
  brackets: Bracket[];
  selectedContenderIds?: UID[];
};

export function BetsFloatingHand({ bets, brackets, selectedContenderIds = [] }: BetsFloatingHandProps) {
  const cardWidth = useCardWidth(8, contenderWidthOptions);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only the bets are important
  const { quarterCard, semiCard, finalCard, selectedCards } = useMemo(
    () => findBetContenders(brackets, bets, selectedContenderIds),
    [bets?.final, bets?.quarter, bets?.semi],
  );

  const noSelection = (
    <span
      className="w-floating-bets__no-selection"
      style={{ width: cardWidth }}
    >
      ?
    </span>
  );

  return (
    <FloatingHand
      title={
        <Translate
          pt="Suas Apostas"
          en="Your Bets"
        />
      }
      icon={<GamblingChipIcon />}
    >
      <div className="w-bets-floating-hand">
        <ul className="w-floating-bets">
          <li className="w-floating-bets__entry">
            <span className="w-floating-bets__label">
              <Translate
                pt="Quartas de finais"
                en="Quarterfinals"
              />
            </span>
            {quarterCard ? (
              <CharacterCard
                character={quarterCard}
                overlayColor="gray"
                size={cardWidth}
              />
            ) : (
              noSelection
            )}
          </li>

          <li className="w-floating-bets__entry">
            <span className="w-floating-bets__label">
              <Translate
                pt="Semifinais"
                en="Semifinals"
              />
            </span>
            {semiCard ? (
              <CharacterCard
                character={semiCard}
                overlayColor="gray"
                size={cardWidth}
              />
            ) : (
              noSelection
            )}
          </li>

          <li className="w-floating-bets__entry">
            <span className="w-floating-bets__label">
              <Translate
                pt="Final"
                en="Final"
              />
            </span>
            {finalCard ? (
              <CharacterCard
                character={finalCard}
                overlayColor="gray"
                size={cardWidth}
              />
            ) : (
              noSelection
            )}
          </li>

          {selectedCards.length > 0 && (
            <li className="w-floating-bets__entry w-floating-bets__entry--your-contender">
              <span className="w-floating-bets__label">
                <Translate
                  pt="Seu(s) competidor(es)"
                  en="Your contender(s)"
                />
              </span>

              <Flex gap={3}>
                {selectedCards.map((selectedCard) => (
                  <ImageBlurButtonContainer
                    cardId={selectedCard.id}
                    key={selectedCard.id}
                  >
                    <CharacterCard
                      character={selectedCard}
                      overlayColor="gray"
                      size={cardWidth}
                    />
                  </ImageBlurButtonContainer>
                ))}
              </Flex>
            </li>
          )}
        </ul>
      </div>
    </FloatingHand>
  );
}
