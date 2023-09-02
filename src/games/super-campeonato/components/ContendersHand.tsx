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
  const cardWidth = useCardWidth(Math.max(contenders.length ?? 8, 5), { minWidth: 100 });

  return (
    <FloatingHand title={<Translate pt="Seus Competidores" en="Your Contenders" />}>
      <ul className="w-contenders-hand">
        {contenders.map((contender) => (
          <li key={contender.id} className="w-contenders-hand__entry">
            {Boolean(onSelect) && (
              <Button
                onClick={() => onSelect!(contender.id)}
                shape="round"
                ghost
                className="w-contenders-hand__button"
              >
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
