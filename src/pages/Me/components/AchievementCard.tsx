import clsx from 'clsx';
// Ant Design Resources
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
// Types
import type { AchievementInfo } from 'types/game';
// Utils
import { UNKNOWN_TEXT } from '@utils/constants';
// Components
import { Medal } from '@components/achievements/Medal';
import { GameBanner } from '@components/game-identity/GameBanner';
import { DualTranslate } from '@components/language/DualTranslate';

type AchievementProps = {
  gameName: string;
  gameTitle: DualLanguageValue;
  achievement: AchievementInfo;
  value?: number;
  width: number;
};

export function AchievementCard({ gameName, gameTitle, achievement, value, width }: AchievementProps) {
  return (
    <div
      className={clsx('achievement-card', Boolean(value) && 'achievement-card--achieved')}
      style={{ width }}
    >
      <GameBanner
        gameName={gameName}
        width={width - 8}
        showLogo={false}
        className="achievement-card__banner"
      />

      <div className="achievement-card__content">
        <div className="achievement-card__game-title">
          <DualTranslate>{gameTitle}</DualTranslate>
        </div>

        <div className="achievement-card__medal">
          <Medal
            id={achievement.icon}
            className={clsx(!value && 'achievement-card__disabled-icon')}
          />
        </div>
        <h4 className="achievement-card__title">
          <DualTranslate>{achievement.title ?? UNKNOWN_TEXT}</DualTranslate>
        </h4>

        {Boolean(achievement.description) && (
          <div className="achievement-card__description">
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
          </div>
        )}
      </div>
    </div>
  );
}
