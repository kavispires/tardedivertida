import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Badge, Select, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useBooleanDictionary } from 'hooks/useBooleanDictionary';
import { useCache } from 'hooks/useCache';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { SendButton } from 'components/buttons';
import { DebugOnly, DevButton } from 'components/debug';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { alienAttributesUtils } from 'components/toolKits/AlienAttributes';
// Internal
import type { OfferingsStatus, PhaseBasicState, SubmitHumanInquiryPayload } from '../utils/types';
import { HumanSignBoard } from './HumanSignBoard';
import { SelectableObjectsGrid } from './SelectableObjectsGrid';

type HumanInquiryProps = {
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  submitInquiry: (payload: SubmitHumanInquiryPayload) => void;
  user: GamePlayer;
  status: OfferingsStatus;
};

export function HumanInquiry({
  attributes,
  items,
  submitInquiry,
  user,
  startingAttributesIds,
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

  const orderedAttributes = useMemo(
    () => orderBy(attributes, `attribute.${language}`),
    [attributes, language],
  );

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
          {orderedAttributes.map((attribute) => (
            <Select.Option
              key={`attribute-${attribute.id}`}
              value={attribute.id}
              style={{
                textDecoration: startingAttributesIds.includes(attribute.id) ? 'line-through' : 'none',
              }}
            >
              <DualTranslate>{attribute.name}</DualTranslate>
            </Select.Option>
          ))}
        </Select>
        <Badge count={objectsIds.length}>
          <SendButton
            size="large"
            type="primary"
            disabled={!attribute || objectsIds.length < 1 || isLoading}
            onClick={() => submitInquiry({ objectsIds, intention: attribute })}
          >
            <Translate pt="Enviar Objetos" en="Submit Objects" />
          </SendButton>
        </Badge>
        <DebugOnly devOnly>
          <MockInquiryButton
            items={items}
            attributes={attributes}
            startingAttributesIds={startingAttributesIds}
            submitInquiry={submitInquiry}
          />
        </DebugOnly>
      </Space>
      <Space className="boards-container" wrap>
        <SelectableObjectsGrid
          items={items}
          selectedObjects={selected}
          selectObject={updateSelected}
          user={user}
          status={status}
        />
        <HumanSignBoard attributes={attributes} startingAttributesIds={startingAttributesIds} />
      </Space>
    </SpaceContainer>
  );
}

export function MockInquiryButton({
  items,
  attributes,
  startingAttributesIds,
  submitInquiry,
}: Pick<HumanInquiryProps, 'items' | 'attributes' | 'startingAttributesIds' | 'submitInquiry'>) {
  const { cache } = useCache();

  const onSubmitMockInquiry = () => {
    const inquiry = alienAttributesUtils.getInquirySuggestions(items, attributes, [
      ...startingAttributesIds,
      ...Object.keys(cache),
    ]);

    submitInquiry({
      objectsIds: inquiry[0].items.map((item) => item.id),
      intention: inquiry[0].attribute.id,
    });
  };

  return (
    <DevButton onClick={onSubmitMockInquiry} size="large">
      Submit Mock
    </DevButton>
  );
}
