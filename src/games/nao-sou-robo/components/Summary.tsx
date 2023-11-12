import { Translate } from 'components/language';

import { CaptchaHighlight, EnergyHighlight, SuspicionHighlight } from './Highlights';

import { Divider, Tooltip } from 'antd';

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
      <Tooltip title={<Translate pt="Captcha corretos" en="Captcha correct" />}>
        <div>
          <CaptchaHighlight>{correctCaptcha}/3</CaptchaHighlight>
        </div>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title={<Translate pt="Suspeita levantada" en="Suspicion caused" />}>
        <div>
          <SuspicionHighlight>{suspicion}/3</SuspicionHighlight>
        </div>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title={<Translate pt="Pontos do Robô para revolução" en="Robot Points to Doom" />}>
        <div>
          <EnergyHighlight>
            {robot.points}/{robot.goal}
          </EnergyHighlight>
        </div>
      </Tooltip>
    </div>
  );
}
