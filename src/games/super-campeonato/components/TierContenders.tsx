// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';
// Internal
import type { Bracket } from '../utils/type';

type TierContendersProps = {
  contenders: Bracket[][];
};

export function TierContenders({ contenders }: TierContendersProps) {
  const flatContenders = contenders.flat();
  const cardWidth = useCardWidth(flatContenders.length + 2, { gap: 16, minWidth: 30, maxWidth: 100 });

  return (
    <ul className="w-tier-contenders">
      {flatContenders.map((contender) => (
        <li
          className="w-tier-contender"
          key={`w-tier-contender-${contender.id}`}
        >
          <CharacterCard
            character={contender}
            overlayColor="gray"
            size={cardWidth}
          />
        </li>
      ))}
    </ul>
  );
}
