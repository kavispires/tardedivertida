// Ant Design Resources
import { FireFilled } from '@ant-design/icons';
import { Button, Flex, Popover, Typography } from 'antd';
// Utils
import { pluralize } from 'utils/helpers';
// Components
import { Translate } from 'components/language/Translate';
// Internal
import { useStreakData } from '../hooks/useStreakData';

export function StreakDisplay() {
  const { currentStreak, longestStreak, totalDaysPlayed } = useStreakData();

  let streakColor = currentStreak >= 7 ? '#ff4d4f' : currentStreak >= 3 ? '#fa8c16' : '#52c41a';
  if (currentStreak === 0) {
    streakColor = '#d9d9d9';
  }

  return (
    <Popover
      title={
        <Flex gap={6}>
          <FireFilled style={{ color: streakColor }} />
          <Translate
            pt="Sequência"
            en="Streak"
          />
        </Flex>
      }
      content={
        <div style={{ maxWidth: '80vw', minWidth: 128 }}>
          <Typography.Paragraph>
            <Translate
              pt={`Você está em uma sequência de ${currentStreak} ${pluralize(currentStreak, 'dia', 'dias')}!`}
              en={`You're on a ${currentStreak}-day streak!`}
            />
            <br />
            <Translate
              pt={`Sua maior sequência é de ${longestStreak} ${pluralize(longestStreak, 'dia', 'dias')}.`}
              en={`Your longest streak is ${longestStreak} ${pluralize(longestStreak, 'day', 'days')}.`}
            />
            <br />
            <Translate
              pt={`No total, você jogou ${totalDaysPlayed} ${pluralize(totalDaysPlayed, 'dia', 'dias')}.`}
              en={`In total, you've played for ${totalDaysPlayed} ${pluralize(totalDaysPlayed, 'day', 'days')}.`}
            />
          </Typography.Paragraph>
        </div>
      }
    >
      <Button
        type="text"
        style={{ color: 'white' }}
        icon={<FireFilled style={{ color: streakColor }} />}
      >
        {currentStreak}
      </Button>
    </Popover>
  );
}
