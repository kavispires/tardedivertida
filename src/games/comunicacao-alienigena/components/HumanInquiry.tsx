import { useState } from 'react';
import { orderBy } from 'lodash';
// Ant Design Resources
import { Button, Select, Space } from 'antd';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useLoading } from 'hooks/useLoading';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { DualTranslate, Translate } from 'components/language';
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
  const { language } = useLanguage();
  const [attribute, setAttribute] = useState<string>('');
  const {
    dict: selected,
    updateDict: updateSelected,
    keys: objectsIds,
  } = useBooleanDictionary({}, (d) => Object.keys(d).length < 5);

  return (
    <Space className="space-container" direction="vertical">
      <Space>
        <Select
          className="intention-select"
          defaultValue=""
          size="large"
          onChange={(value) => setAttribute(value)}
        >
          <Select.Option value="">
            <Translate pt="Selecione um atributo" en="Select an attribute" />
          </Select.Option>
          {orderBy(signs, `attribute.${language}`).map((sign) => (
            <Select.Option key={`sign-${sign.key}`} value={sign.key}>
              <DualTranslate>{sign.attribute}</DualTranslate>
            </Select.Option>
          ))}
        </Select>
        <Button
          size="large"
          type="primary"
          disabled={!attribute || objectsIds.length < 1 || isLoading}
          onClick={() => submitInquiry({ objectsIds, intention: attribute })}
        >
          <Translate pt="Enviar Objetos" en="Submit Objects" /> ({objectsIds.length})
        </Button>
      </Space>
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
