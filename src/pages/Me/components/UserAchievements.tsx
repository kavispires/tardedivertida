// Ant Design Resources
import { Col, Row } from 'antd';
// Types
import type { AchievementKey, AchievementReference } from 'types/achievements';
// Components
import { Achievement } from 'components/general/Achievement';

type UserAchievementsProps = {
  reference: AchievementReference;
  achievements: Record<AchievementKey, number>;
};

export function UserAchievements({ reference, achievements }: UserAchievementsProps) {
  return (
    <Row
      gutter={[8, 8]}
      align="stretch"
    >
      {Object.entries(reference).map(([achievementKey, info]) => {
        return (
          <Col
            xs={12}
            sm={8}
            md={8}
            lg={4}
            key={achievementKey}
          >
            <Achievement
              achievement={info}
              value={achievements?.[achievementKey]}
            />
          </Col>
        );
      })}
    </Row>
  );
}
