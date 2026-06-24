import clsx from 'clsx';
// Ant Design Resources
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popover, Tag } from 'antd';
// Types
import type { AchievementInfo } from 'types/game';
// Utils
import { UNKNOWN_TEXT } from '@utils/constants';
// Components
import { DebugOnly } from '@components/debug/DebugOnly';
import { DualTranslate } from '@components/language/DualTranslate';
// Internal
import { Medal } from './Medal';
// Sass
import styles from './Achievement.module.scss';

type AchievementProps = {
  /**
   * The achievement information object
   */
  achievement: AchievementInfo;
  /**
   * The achievement value (number of times achieved)
   */
  value?: number;
};

/**
 * Component that displays a single achievement with medal icon and description
 */
export function Achievement({ achievement, value }: AchievementProps) {
  return (
    <div className={clsx(styles.achievement, Boolean(value) && styles.achievementAchieved)}>
      <div className={styles.achievementMedal}>
        <Medal
          id={achievement.icon}
          className={clsx(!value && styles.achievementDisabledIcon)}
        />
      </div>
      <h4 className={styles.achievementTitle}>
        <DualTranslate>{achievement.title ?? UNKNOWN_TEXT}</DualTranslate>
      </h4>

      {Boolean(achievement.description) && (
        <div className={styles.achievementDescription}>
          <Popover
            content={
              <>
                <DualTranslate>{achievement.description ?? UNKNOWN_TEXT}</DualTranslate> ({value ?? 0})
              </>
            }
          >
            <Button
              icon={<QuestionCircleOutlined />}
              shape="circle"
              type="text"
              size="small"
            />
          </Popover>
          <DebugOnly
            div
            dev
          >
            <Tag>{achievement.id ?? '?'}</Tag>
          </DebugOnly>
        </div>
      )}
    </div>
  );
}
