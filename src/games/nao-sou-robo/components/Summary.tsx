// Ant Design Resources
import { Divider, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
// Internal
import type { Robot } from '../utils/types';
import { CaptchaHighlight, EnergyHighlight, SuspicionHighlight } from './Highlights';

type SummaryProps = {
  user: GamePlayer;
  robot: Robot;
};

export function Summary({ user, robot }: SummaryProps) {
  if (!user || !robot) return <></>;

  const correctCaptcha = (user.beat ?? []).filter(Boolean).length;
  const suspicion = (user.suspicion ?? []).filter(Boolean).length;

  return (
    <div className="summary">
      <Tooltip title={<Translate pt="Captcha corretos (individual)" en="Captcha correct (individual)" />}>
        <div>
          <CaptchaHighlight>{correctCaptcha}/3</CaptchaHighlight>
        </div>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title={<Translate pt="Suspeita levantada (individual)" en="Suspicion caused (individual)" />}>
        <div>
          <SuspicionHighlight>{suspicion}/3</SuspicionHighlight>
        </div>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip
        title={<Translate pt="Pontos do Robô para revolução (group)" en="Robot Points to Doom (group)" />}
      >
        <div>
          <EnergyHighlight>
            {robot.points}/{robot.goal}
          </EnergyHighlight>
        </div>
      </Tooltip>
    </div>
  );
}
