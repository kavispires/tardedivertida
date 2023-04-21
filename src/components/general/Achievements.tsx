import clsx from 'clsx';
// Ant Design Resources
import { Button, Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { MedalStarIcon } from 'icons/MedalStarIcon';
// Components
import { Avatar, IconAvatar } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
import { Title } from 'components/text';

type AchievementsProps = {
  players: GamePlayers;
  achievements: Achievement[];
  reference: AchievementReference;
};

const unknownText = { pt: 'Desconhecido', en: 'Unknown' };

export function Achievements({ players, achievements, reference }: AchievementsProps) {
  return (
    <div className={clsx('achievements', getAnimationClass('fadeIn'))}>
      <Title size="small" level={3}>
        <Translate pt="Medalhas" en="Achievements" />
      </Title>
      <ul className="achievements-list">
        {achievements.map((achievement, index) => {
          const { Icon = MedalStarIcon, ...achievementObj } = reference[achievement.type] ?? {};
          const player = players[achievement.playerId];
          return (
            <li
              key={`achievement-${achievement.type}`}
              className={clsx(
                'achievements-entry',
                getAnimationClass(
                  'flipInY',
                  index < achievements.length / 2 ? index : achievements.length - 1 - index
                )
              )}
            >
              <div className="achievement__medal">
                <IconAvatar icon={<Icon />} size="large" />
              </div>
              <h4 className="achievement__title">
                <DualTranslate>{achievementObj.title ?? unknownText}</DualTranslate>
              </h4>
              <div className="achievement__avatar">
                <Avatar id={player.avatarId} />
              </div>
              <div className="achievement__name">{player.name}</div>
              {Boolean(achievementObj.description) && (
                <div className="achievement__description">
                  <Popover
                    content={
                      <>
                        <DualTranslate>{achievementObj.description ?? unknownText}</DualTranslate> (
                        {achievement.value})
                      </>
                    }
                  >
                    <Button icon={<QuestionCircleOutlined />} shape="circle" type="text" size="small" />
                  </Popover>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
