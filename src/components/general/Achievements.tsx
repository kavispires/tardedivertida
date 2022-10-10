import clsx from 'clsx';
// Ant Design Resources
import { Button, Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { Avatar } from 'components/avatars';
import { IconAvatar } from 'components/icons/IconAvatar';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { MedalStarIcon } from 'components/icons/MedalStarIcon';

type AchievementsProps = {
  players: GamePlayers;
  achievements: Achievement[];
  reference: AchievementReference;
};

export function Achievements({ players, achievements, reference }: AchievementsProps) {
  const { language, translate } = useLanguage();
  const unknownText = translate('Desconhecido', 'Unknown');

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
              className={clsx('achievements-entry', getAnimationClass('flipInY', index + 1))}
            >
              <div className="achievement__medal">
                <Popover content={`Total: ${String(achievement.value)}`}>
                  <IconAvatar icon={<Icon />} size="large" />
                </Popover>
              </div>
              <h4 className="achievement__title">{achievementObj.title?.[language] ?? unknownText}</h4>
              <div className="achievement__avatar">
                <Avatar id={player.avatarId} />
              </div>
              <div className="achievement__name">{player.name}</div>
              {Boolean(achievementObj.description) && (
                <div className="achievement__description">
                  <Popover content={achievementObj.description![language]}>
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
