// Types
import type { GamePlayer } from 'types/game';
// Icons
import { UserStatsIcon } from '@icons/UserStatsIcon';
// Components
import { FixedMenuButton } from '@components/buttons/FixedMenuButton';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
// Internal
import type { Robot } from '../utils/types';
import { CaptchaHighlight, EnergyHighlight, SuspicionHighlight } from './Highlights';

type FloatingPlayerStatsProps = {
  user: GamePlayer;
  robot: Robot;
};

export function FloatingPlayerStats({ user, robot }: FloatingPlayerStatsProps) {
  if (!user || !robot) return null;

  const correctCaptcha = (user.beat ?? []).filter(Boolean).length;
  const suspicion = (user.suspicion ?? []).filter(Boolean).length;

  return (
    <FixedMenuButton
      type="popover"
      position={1}
      icon={
        <Icon
          icon={<UserStatsIcon />}
          size="small"
        />
      }
      content={
        <div>
          <strong>
            <Translate
              pt="Seus valores"
              en="Your stats"
            />
          </strong>
          <ul className="n-floating-player-stats">
            <li>
              <Translate
                pt="Acertou Captcha"
                en="Captcha correct"
              />
              : <CaptchaHighlight>{correctCaptcha}/3</CaptchaHighlight>
            </li>
            <li>
              <Translate
                pt="Levantou suspeita"
                en="Caused suspicion"
              />
              : <SuspicionHighlight>{suspicion}/3</SuspicionHighlight>
            </li>
            <li>
              <Translate
                pt="Pontuação"
                en="Score"
              />
              :{' '}
              <PointsHighlight
                value={user.score}
                omitText
              />
            </li>
            <li>
              <Translate
                pt="Robô"
                en="Robot"
              />
              :{' '}
              <EnergyHighlight>
                {robot.points}/{robot.goal}
              </EnergyHighlight>
            </li>
          </ul>
        </div>
      }
    />
  );
}
