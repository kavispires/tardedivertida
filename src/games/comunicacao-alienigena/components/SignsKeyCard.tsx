import { CheckCircleFilled } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import clsx from 'clsx';
import { TransparentButton } from 'components/buttons';
import { SignCard } from 'components/cards/SignCard';
import { DualTranslate, Translate } from 'components/language';
import { useCache } from 'hooks/useCache';

type SignsKeyCardProps = {
  signs: Sign[];
};

export function SignsKeyCard({ signs }: SignsKeyCardProps) {
  const { cache, setCache } = useCache();

  const updateCache = (signId: number | string, value: boolean) => {
    setCache((prev) => {
      const copy = { ...prev };
      copy[signId] = value;
      return copy;
    });
  };

  return (
    <div className="signs-grid">
      {signs.map((sign) => (
        <div className={clsx('signs-grid__item', Boolean(cache[sign.signId]) && 'signs-grid__item--used')}>
          <Popconfirm
            title={<Translate pt="Usado" en="Used" />}
            onConfirm={() => updateCache(sign.signId, !(cache[sign.signId] ?? false))}
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
  );
}
