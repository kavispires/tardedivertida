// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { ContenderCard } from './ContenderCard';

type TierContendersProps = {
  contenders: WBracket[][];
};

export function TierContenders({ contenders }: TierContendersProps) {
  const flatContenders = contenders.flat();
  const cardWidth = useCardWidth(flatContenders.length + 2, { gap: 16, minWidth: 30, maxWidth: 100 });

  return (
    <ul className="w-tier-contenders">
      {flatContenders.map((contender) => (
        <li className="w-tier-contender" key={`w-tier-contender-${contender.id}`}>
          <ContenderCard contender={contender} overlayColor="gray" size={cardWidth} />
        </li>
      ))}
    </ul>
  );
}
