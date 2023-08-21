import clsx from 'clsx';
import { orderBy } from 'lodash';
// Ant Design Resources
import { Popconfirm, Space } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
// Hooks
import { useCache } from 'hooks/useCache';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { TransparentButton } from 'components/buttons';
import { SignCard } from 'components/cards/SignCard';
import { DualTranslate, Translate } from 'components/language';
import { Title } from 'components/text';

type SignsKeyCardProps = {
  signs: Sign[];
};

export function SignsKeyCard({ signs }: SignsKeyCardProps) {
  const { cache, setCache } = useCache();
  const { language } = useLanguage();

  const updateCache = (signId: number | string, value: boolean) => {
    setCache((prev) => {
      const copy = { ...prev };
      copy[signId] = value;
      return copy;
    });
  };

  return (
    <Space direction="vertical">
      <Title level={3} size="xx-small">
        <Translate pt="Atributos e Símbolos" en="Attributes and Symbols" />
      </Title>
      <div className="signs-grid">
        {orderBy(signs, `attribute.${language}`).map((sign) => (
          <div
            className={clsx('signs-grid__item', Boolean(cache[sign.signId]) && 'signs-grid__item--used')}
            key={sign.attribute[language]}
          >
            <Popconfirm
              title={<Translate pt="Usado" en="Used" />}
              onConfirm={() => updateCache(sign.signId, true)}
              onCancel={() => updateCache(sign.signId, false)}
              okText={<Translate pt="Sim" en="Yes" />}
              cancelText={<Translate pt="Não" en="No" />}
            >
              <TransparentButton>
                <DualTranslate>{sign.attribute}</DualTranslate>
                {Boolean(cache[sign.signId]) && <CheckCircleFilled />}
              </TransparentButton>
            </Popconfirm>
            <SignCard id={`${sign.signId}`} />
          </div>
        ))}
      </div>
    </Space>
  );
}
