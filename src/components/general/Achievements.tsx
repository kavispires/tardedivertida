// Ant Design Resources
import { Button, Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Avatar } from 'components/avatars';
import { IconAvatar } from 'components/icons/IconAvatar';
import { Translate } from 'components/language';
import { Title } from 'components/text';

type AchievementsProps = {
  players: GamePlayers;
  achievements: Achievement[];
  reference: AchievementReference;
};

export function Achievements({ players, achievements, reference }: AchievementsProps) {
  const { language } = useLanguage();

  return (
    <div className="achievements">
      <Title size="small" level={3}>
        <Translate pt="Medalhas" en="Achievements" />
      </Title>
      <ul className="achievements-list">
        {achievements.map((achievement) => {
          const achievementObj = reference[achievement.type];
          const player = players[achievement.playerId];
          return (
            <li key={`achievement-${achievement.type}`} className="achievements-entry">
              <div className="achievement__medal">
                <IconAvatar icon={achievementObj.icon} size="large" />
              </div>
              <h4 className="achievement__title">{achievementObj.title[language] ?? 'Unknown'}</h4>
              <div className="achievement__avatar">
                <Avatar id={player.avatarId} />
              </div>
              <div className="achievement__name">{player.name}</div>
              {Boolean(achievementObj.description) && (
                <div className="achievement__description">
                  <Popover content={achievementObj.description![language]}>
                    <Button icon={<QuestionCircleOutlined />} shape="circle" type="ghost" size="small" />
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