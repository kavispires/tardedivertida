import { orderBy } from 'lodash';
import { useState } from 'react';
// Ant Design Resources
import { Badge, Button, Select, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { Item, OfferingsStatus, Sign } from '../utils/types';
import { HumanSignBoard } from './HumanSignBoard';
import { SelectableObjectsGrid } from './SelectableObjectsGrid';

type HumanInquiryProps = {
  signs: Sign[];
  startingAttributes: Sign[];
  items: Item[];
  submitInquiry: GenericFunction;
  user: GamePlayer;
  status: OfferingsStatus;
};

export function HumanInquiry({
  signs,
  items,
  submitInquiry,
  user,
  startingAttributes,
  status,
}: HumanInquiryProps) {
  const { isLoading } = useLoading();
  const { language } = useLanguage();
  const [attribute, setAttribute] = useState<string>('');
  const {
    dict: selected,
    updateDict: updateSelected,
    keys: objectsIds,
  } = useBooleanDictionary({}, (d) => Object.keys(d).length < 5);

  return (
    <SpaceContainer vertical>
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
        <Badge count={objectsIds.length}>
          <Button
            size="large"
            type="primary"
            disabled={!attribute || objectsIds.length < 1 || isLoading}
            onClick={() => submitInquiry({ objectsIds, intention: attribute })}
          >
            <Translate pt="Enviar Objetos" en="Submit Objects" />
          </Button>
        </Badge>
      </Space>
      <Space className="boards-container" wrap>
        <SelectableObjectsGrid
          items={items}
          selectedObjects={selected}
          selectObject={updateSelected}
          user={user}
          status={status}
        />
        <HumanSignBoard signs={signs} startingAttributes={startingAttributes} />
      </Space>
    </SpaceContainer>
  );
}
