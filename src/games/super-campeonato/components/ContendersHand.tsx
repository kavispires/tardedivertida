// Ant Design Resources
import { Button } from 'antd';
// Components
import { FloatingHand } from 'components/cards';
import { Translate } from 'components/language';
import { useCardWidth } from 'hooks/useCardWidth';
import { ContenderCard } from './ContenderCard';

type ContendersHandProps = {
  contenders: WContender[];
  onSelect?: GenericFunction;
};

export function ContendersHand({ contenders, onSelect }: ContendersHandProps) {
  const cardWidth = useCardWidth(5, 32, 100);

  return (
    <FloatingHand>
      <ul className="w-contenders-hand">
        {contenders.map((contender) => (
          <li key={contender.id} className="w-contenders-hand__entry">
            {Boolean(onSelect) && (
              <Button onClick={() => onSelect!(contender.id)}>
                <Translate pt="Selecionar" en="Select" />
              </Button>
            )}
            <ContenderCard contender={contender} overlayColor="gray" size={cardWidth} />
          </li>
        ))}
      </ul>
    </FloatingHand>
  );
}
