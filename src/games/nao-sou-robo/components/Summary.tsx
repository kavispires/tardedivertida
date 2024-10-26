// Types
import type { GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
// Internal
import type { Robot } from '../utils/types';
import { CaptchaHighlight, EnergyHighlight, SuspicionHighlight } from './Highlights';
import { StatusBar } from 'components/general/StatusBar';
import { useMemo } from 'react';

type SummaryProps = {
  user: GamePlayer;
  robot: Robot;
};

export function Summary({ user, robot }: SummaryProps) {
  const entries = useMemo(
    () => [
      {
        key: 'captchas',
        title: <Translate pt="Captcha corretos (individual)" en="Captcha correct (individual)" />,
        value: <CaptchaHighlight>{(user.beat ?? []).filter(Boolean).length}/3</CaptchaHighlight>,
      },
      {
        key: 'suspicions',
        title: <Translate pt="Suspeita levantada (individual)" en="Suspicion caused (individual)" />,
        value: <SuspicionHighlight>{(user.suspicion ?? []).filter(Boolean).length}/3</SuspicionHighlight>,
      },
      {
        key: 'energy',
        title: <Translate pt="Pontos do Robô para revolução (grupo)" en="Robot Points to Doom (group)" />,
        value: (
          <EnergyHighlight>
            {robot.points}/{robot.goal}
          </EnergyHighlight>
        ),
      },
    ],
    [user, robot]
  );

  if (!user || !robot) return <></>;

  return <StatusBar entries={entries} />;
}
