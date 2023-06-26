// Ant Design Resources
import { Button, Space } from 'antd';
// Hook
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useLoading } from 'hooks/useLoading';
// Components
import { Translate } from 'components/language';
import { HumanSignBoard } from './HumanSignBoard';
import { SelectableObjectsGrid } from './SelectableObjectsGrid';

type HumanInquiryProps = {
  signs: Sign[];
  items: Item[];
  submitInquiry: GenericFunction;
  user: GamePlayer;
};

export function HumanInquiry({ signs, items, submitInquiry, user }: HumanInquiryProps) {
  const { isLoading } = useLoading();
  const [selected, updateSelected] = useBooleanDictionary({}, (d) => Object.keys(d).length < 5);
  const objectsIds = Object.keys(selected);
  return (
    <Space className="space-container" direction="vertical">
      <Button
        size="large"
        type="primary"
        disabled={objectsIds.length < 1 || isLoading}
        onClick={() => submitInquiry({ objectsIds })}
      >
        <Translate pt="Enviar Objetos" en="Submit Objects" /> ({objectsIds.length})
      </Button>
      <Space className="boards-container" wrap>
        <SelectableObjectsGrid
          items={items}
          selectedObjects={selected}
          selectObject={updateSelected}
          user={user}
        />
        <HumanSignBoard signs={signs} />
      </Space>
    </Space>
  );
}
