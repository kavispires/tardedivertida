import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import clsx from 'clsx';
import { IconAvatar } from 'components/avatars';
import { DualTranslate } from 'components/language';

type AchievementProps = {
  achievement: AchievementInfo;
  value?: number;
};

const unknownText = { pt: 'Desconhecido', en: 'Unknown' };

export function Achievement({ achievement, value }: AchievementProps) {
  return (
    <div className={clsx('achievement', Boolean(value) && 'achievement--achieved')}>
      <div className="achievement__medal">
        <IconAvatar
          icon={<achievement.Icon />}
          size="large"
          className={clsx(!value && 'achievement__disabled-icon')}
        />
      </div>
      <h4 className="achievement__title">
        <DualTranslate>{achievement.title ?? unknownText}</DualTranslate>
      </h4>

      {Boolean(achievement.description) && (
        <div className="achievement__description">
          <Popover
            content={
              <>
                <DualTranslate>{achievement.description ?? unknownText}</DualTranslate> ({value ?? 0})
              </>
            }
          >
            <Button icon={<QuestionCircleOutlined />} shape="circle" type="text" size="small" />
          </Popover>
        </div>
      )}
    </div>
  );
}
