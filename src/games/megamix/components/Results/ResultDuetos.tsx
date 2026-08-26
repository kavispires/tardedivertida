// Ant Design Resources
import { Flex } from 'antd';
// Components
import { ItemCard } from '@components/cards/ItemCard';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
// Internal
import type { ResultComponentProps } from '../../utils/types';

export function ResultDuetos({ winningValues }: ResultComponentProps) {
  return (
    <>
      <Surface>
        {winningValues.length > 1 ? (
          <Translate
            pt="As votadas foram"
            en="Most voted options are"
          />
        ) : (
          <Translate
            pt="A mais votada foi"
            en="Most voted option is"
          />
        )}
        :
      </Surface>
      <div className="track-result-values__cards">
        {winningValues.map((value) => (
          <div
            key={value}
            className="track-result-values__text-value"
          >
            <Value value={value} />
          </div>
        ))}
      </div>
    </>
  );
}

function Value({ value }: { value: string }) {
  const [item1Id, item2Id] = value.split('-');
  return (
    <Flex
      gap={8}
      justify="center"
      align="center"
      className="contained"
    >
      <ItemCard
        itemId={item1Id}
        width={48}
      />
      <span>+</span>
      <ItemCard
        itemId={item2Id}
        width={48}
      />
    </Flex>
  );
}
