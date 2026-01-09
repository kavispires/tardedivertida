// Ant Design Resources
import { Button } from 'antd';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CharacterCard } from 'components/cards/CharacterCard';
import { FloatingHand } from 'components/general/FloatingHand';
import { Translate } from 'components/language';
// Internal
import type { FightingContender } from '../utils/type';

type ContendersHandProps = {
  contenders: FightingContender[];
  onSelect?: GenericFunction;
};

export function ContendersHand({ contenders, onSelect }: ContendersHandProps) {
  const cardWidth = useCardWidth(Math.max(contenders.length ?? 8, 5), { minWidth: 100 });

  return (
    <FloatingHand
      title={
        <Translate
          pt="Seus Competidores"
          en="Your Contenders"
        />
      }
    >
      <ul className="w-contenders-hand">
        {contenders.map((contender) => (
          <li
            key={contender.id}
            className="w-contenders-hand__entry"
          >
            {!!onSelect && (
              <Button
                onClick={() => onSelect(contender.id)}
                shape="round"
                ghost
                className="w-contenders-hand__button"
              >
                <Translate
                  pt="Selecionar"
                  en="Select"
                />
              </Button>
            )}
            <CharacterCard
              character={contender}
              overlayColor="gray"
              size={cardWidth}
            />
          </li>
        ))}
      </ul>
    </FloatingHand>
  );
}
