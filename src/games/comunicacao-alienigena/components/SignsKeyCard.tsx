import clsx from 'clsx';
import { isEmpty, orderBy } from 'lodash';
import { useEffect } from 'react';
// Ant Design Resources
import { CheckCircleFilled, CheckSquareOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Popover, Space } from 'antd';
// Hooks
import { useCacheAlternative } from 'hooks/useCache';
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { TransparentButton } from 'components/buttons';
import { SignCard } from 'components/cards/SignCard';
import { DualTranslate, Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import type { PhaseBasicState } from '../utils/types';

type SignsKeyCardProps = {
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  phase?: string;
};

export function SignsKeyCard({ attributes, startingAttributesIds = [], phase }: SignsKeyCardProps) {
  const { cache, setCache } = useCacheAlternative({ defaultValue: {} });
  const { language } = useLanguage();

  const updateCache = (signId: number | string, value: boolean) => {
    setCache((prev) => {
      const copy = { ...prev };
      copy[signId] = value;
      return copy;
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (phase === PHASES.COMUNICACAO_ALIENIGENA.HUMAN_ASK && startingAttributesIds.length && isEmpty(cache)) {
      setCache((prev) => {
        const copy = { ...prev };
        attributes.forEach((attribute) => {
          if (startingAttributesIds.find((attributeId) => attributeId === attribute.id)) {
            copy[attribute.id] = true;
          }
        });
        return copy;
      });
    }
  }, [startingAttributesIds, phase]);

  return (
    <Space direction="vertical">
      <Title level={3} size="xx-small">
        <Translate pt="Atributos e Símbolos" en="Attributes and Symbols" />
        <Popover
          content={
            <Translate
              pt="Você pode clicar no título do atributo para marcá-lo como usado"
              en="You may click on the title of an attribute to mark it as used"
            />
          }
          title={<Translate pt="Dica" en="Hint" />}
          arrow
        >
          <Button type="text" style={{ color: 'white' }} icon={<InfoCircleOutlined />} shape="circle" />
        </Popover>
      </Title>
      <div className="attributes-grid">
        {orderBy(attributes, `attribute.${language}`).map((attribute) => {
          const isStarting = Boolean(
            startingAttributesIds.find((attributeId) => attributeId === attribute.id),
          );
          return (
            <div
              className={clsx(
                'attributes-grid__item',
                Boolean(cache[attribute.id]) && 'attributes-grid__item--used',
              )}
              key={attribute.name[language]}
            >
              <Popconfirm
                title={
                  isStarting ? (
                    <Translate pt="Atributo inicial" en="Starting attribute" />
                  ) : (
                    <Translate pt="Usado?" en="Used?" />
                  )
                }
                description={
                  attribute.description ? (
                    <span className="attributes-grid__mini-description">
                      <DualTranslate>{attribute.description}</DualTranslate>
                    </span>
                  ) : undefined
                }
                onConfirm={() => updateCache(attribute.id, true)}
                onCancel={() => updateCache(attribute.id, false)}
                okText={<Translate pt="Sim" en="Yes" />}
                cancelText={<Translate pt="Não" en="No" />}
                okButtonProps={{
                  disabled: isStarting,
                }}
                cancelButtonProps={{
                  disabled: isStarting,
                }}
              >
                <TransparentButton>
                  <DualTranslate>{attribute.name}</DualTranslate>
                  {isStarting && <CheckSquareOutlined />}
                  {Boolean(cache[attribute.id]) && !isStarting && <CheckCircleFilled />}
                </TransparentButton>
              </Popconfirm>
              <SignCard id={`${attribute.spriteId}`} className="transparent" width={48} />
            </div>
          );
        })}
      </div>
    </Space>
  );
}
