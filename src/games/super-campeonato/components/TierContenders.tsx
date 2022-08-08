import { useCardWidth } from 'hooks';
import { ContenderCard } from './ContenderCard';

type TierContendersProps = {
  contenders: WBracket[][];
};

export function TierContenders({ contenders }: TierContendersProps) {
  const flatContenders = contenders.flat();
  const cardWidth = useCardWidth(flatContenders.length + 2, 16, 30, 100);

  return (
    <ul className="w-tier-contenders">
      {flatContenders.map((contender) => (
        <li className="w-tier-contender">
          <ContenderCard contender={contender} overlayColor="gray" size={cardWidth} />
        </li>
      ))}
    </ul>
  );
}
