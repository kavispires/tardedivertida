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
import type { Sign } from '../utils/types';

type SignsKeyCardProps = {
  signs: Sign[];
  startingAttributes?: Sign[];
  phase?: string;
};

export function SignsKeyCard({ signs, startingAttributes = [], phase }: SignsKeyCardProps) {
  const { cache, setCache } = useCacheAlternative({ defaultValue: {} });
  const { language } = useLanguage();

  const updateCache = (signId: number | string, value: boolean) => {
    setCache((prev) => {
      const copy = { ...prev };
      copy[signId] = value;
      return copy;
    });
  };

  useEffect(() => {
    if (phase === PHASES.COMUNICACAO_ALIENIGENA.HUMAN_ASK && startingAttributes.length && isEmpty(cache)) {
      setCache((prev) => {
        const copy = { ...prev };
        signs.forEach((sign) => {
          if (startingAttributes.find((attr) => attr.signId === sign.signId)) {
            copy[sign.signId] = true;
          }
        });
        return copy;
      });
    }
  }, [startingAttributes, phase]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <div className="signs-grid">
        {orderBy(signs, `attribute.${language}`).map((sign) => {
          const isStarting = Boolean(startingAttributes.find((attr) => attr.signId === sign.signId));
          return (
            <div
              className={clsx('signs-grid__item', Boolean(cache[sign.signId]) && 'signs-grid__item--used')}
              key={sign.attribute[language]}
            >
              <Popconfirm
                title={
                  isStarting ? (
                    <Translate pt="Atributo inicial" en="Starting attribute" />
                  ) : (
                    <Translate pt="Usado" en="Used" />
                  )
                }
                description={
                  sign.description ? (
                    <span className="signs-grid__mini-description">
                      <DualTranslate>{sign.description}</DualTranslate>
                    </span>
                  ) : undefined
                }
                onConfirm={() => updateCache(sign.signId, true)}
                onCancel={() => updateCache(sign.signId, false)}
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
                  <DualTranslate>{sign.attribute}</DualTranslate>
                  {isStarting && <CheckSquareOutlined />}
                  {Boolean(cache[sign.signId]) && !isStarting && <CheckCircleFilled />}
                </TransparentButton>
              </Popconfirm>
              <SignCard id={`${sign.signId}`} className="transparent" />
            </div>
          );
        })}
      </div>
    </Space>
  );
}
