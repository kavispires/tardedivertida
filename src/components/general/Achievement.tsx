import clsx from 'clsx';
// Ant Design Resources
import { Button, Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// Types
import type { AchievementInfo } from 'types/achievements';
// Components
import { DualTranslate } from 'components/language';
import { Medal } from './Medal';

type AchievementProps = {
  achievement: AchievementInfo;
  value?: number;
};

const unknownText = { pt: 'Desconhecido', en: 'Unknown' };

export function Achievement({ achievement, value }: AchievementProps) {
  return (
    <div className={clsx('achievement', Boolean(value) && 'achievement--achieved')}>
      <div className="achievement__medal">
        <Medal id={achievement.icon} className={clsx(!value && 'achievement__disabled-icon')} />
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
