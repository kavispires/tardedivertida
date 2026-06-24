import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { Badge, Flex, Select, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useBooleanDictionary } from '@hooks/useBooleanDictionary';
import { useCache } from '@hooks/useCache';
import { useLanguage } from '@hooks/useLanguage';
import { useLoading } from '@hooks/useLoading';
// Utils
import { UNKNOWN_TEXT } from '@utils/constants';
// Icons
import { ArrowIcon } from '@icons/ArrowIcon';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { ItemCard } from '@components/cards/ItemCard';
import { DebugOnly } from '@components/debug/DebugOnly';
import { DevButton } from '@components/debug/DevButton';
import { Icon } from '@components/general/Icon';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatarStrip } from '@components/player/PlayerAvatarStrip';
import { PlayerFlex } from '@components/player/PlayerFlex';
import { alienAttributesUtils } from '@components/toolKits/AlienAttributes';
// Internal
import type { OfferingsStatus, PhaseBasicState, SubmitHumanInquiryPayload } from '../utils/types';
import { MAX_INQUIRY_OBJECTS, SPRITE_SIZE } from '../utils/constants';
import { HumanSignBoard } from './HumanSignBoard';
import { SelectableObjectsGrid } from './SelectableObjectsGrid';
import { InquirySuggestions } from './Suggestions';

type HumanInquiryProps = {
  items: PhaseBasicState['items'];
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  submitInquiry: (payload: SubmitHumanInquiryPayload) => void;
  user: GamePlayer;
  status: OfferingsStatus;
  knownSpriteIds: string[];
};

export function HumanInquiry({
  attributes,
  items,
  submitInquiry,
  user,
  startingAttributesIds,
  status,
  knownSpriteIds,
}: HumanInquiryProps) {
  const { isLoading } = useLoading();
  const { language } = useLanguage();
  const [attribute, setAttribute] = useState<string>('');
  const {
    dict: selected,
    updateDict: updateSelected,
    keys: objectsIds,
    setDict: setSelected,
  } = useBooleanDictionary({}, (d) => Object.keys(d).length < 5);

  const orderedAttributes = useMemo(
    () => orderBy(attributes, `attribute.${language}`),
    [attributes, language],
  );

  return (
    <SpaceContainer vertical>
      <Flex gap={6}>
        <InquirySuggestions
          items={items}
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          setAttribute={setAttribute}
          setSelected={setSelected}
        />
        <Select
          className="intention-select"
          defaultValue=""
          value={attribute}
          size="large"
          onChange={(value) => setAttribute(value)}
          options={[
            {
              value: '',
              label: (
                <Translate
                  pt="Selecione um atributo"
                  en="Select an attribute"
                />
              ),
            },
            ...orderedAttributes.map((attribute) => ({
              key: `attribute-${attribute.id}`,
              value: attribute.id,
              label: (
                <span
                  style={{
                    textDecoration: startingAttributesIds.includes(attribute.id) ? 'line-through' : 'none',
                  }}
                >
                  <DualTranslate>{attribute.name}</DualTranslate>
                </span>
              ),
            })),
          ]}
        />
        <Badge count={objectsIds.length}>
          <SendButton
            size="large"
            type="primary"
            disabled={!attribute || objectsIds.length < 1 || isLoading}
            onClick={() => submitInquiry({ objectsIds, intention: attribute })}
          >
            <Translate
              pt="Enviar Objetos"
              en="Submit Objects"
            />
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
      </Flex>
      <Space
        className="boards-container"
        wrap
      >
        <SelectableObjectsGrid
          items={items}
          selectedObjects={selected}
          selectObject={updateSelected}
          user={user}
          status={status}
        />
        <HumanSignBoard
          attributes={attributes}
          startingAttributesIds={startingAttributesIds}
          knownSpriteIds={knownSpriteIds}
        />
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
  const { cache } = useCache<Dictionary<string>>({});

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
    <DevButton
      onClick={onSubmitMockInquiry}
      size="large"
    >
      Submit Mock
    </DevButton>
  );
}

type HumanSelectedInquiryProps = {
  user: GamePlayer;
  attributes: PhaseBasicState['attributes'];
  items: PhaseBasicState['items'];
};

export function HumanSelectedInquiry({ attributes, items, user }: HumanSelectedInquiryProps) {
  const [attribute, objects] = useMemo(() => {
    const attribute = attributes.find((attr) => attr.id === user?.intention);
    const objects = items.filter((item) => user?.objectsIds?.includes(item.id));

    return [attribute, objects];
  }, [attributes, items, user]);

  return (
    <PlayerFlex
      avatarId={user.avatarId}
      gap={8}
      align="center"
      withBorder
      className="border-radius"
    >
      {/* Avatar */}
      <PlayerAvatarStrip player={user} />

      {/* Inquiry Objects */}
      {objects.map((obj) => (
        <ItemCard
          key={`inquiry-${obj.id}`}
          itemId={obj.id}
          width={SPRITE_SIZE}
        />
      ))}
      {Array(MAX_INQUIRY_OBJECTS - objects.length || 0)
        .fill(0)
        .map((_, i) => (
          <div
            key={`inquiry-placeholder-${i}`}
            style={{ width: SPRITE_SIZE, height: SPRITE_SIZE }}
          />
        ))}

      <Icon
        icon={<ArrowIcon />}
        size="small"
      />

      <Flex
        justify="center"
        align="center"
        className="border-radius px-2"
        style={{
          height: SPRITE_SIZE,
          backgroundColor: '#f0f0f0',
        }}
      >
        <DualTranslate>{attribute ? attribute.name : UNKNOWN_TEXT}</DualTranslate>?
      </Flex>
    </PlayerFlex>
  );
}
