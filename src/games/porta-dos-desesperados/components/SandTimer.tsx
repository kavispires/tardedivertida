import { useEffect } from 'react';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useCache } from 'hooks/useCache';
import { useCountdown } from 'hooks/useCountdown';
// Utils
import { formatTime, getRandomItem } from 'utils/helpers';
// Icons
import { MagicHourGlassIcon } from 'icons/MagicHourGlassIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
// Internal
import { ROUND_DURATION, TIMER_LEAD, TRAPS } from '../utils/constants';

type SandTimerProps = {
  trap: string;
  doors: string[];
  onDisableButtons: GenericComponent;
  onSubmitDoor: GenericComponent;
  onMakeReady: GenericFunction;
  user: GamePlayer;
};

export function SandTimer({
  user,
  trap,
  doors,
  onDisableButtons,
  onSubmitDoor,
  onMakeReady,
}: SandTimerProps) {
  const { setCache } = useCache();

  const handleExpire = () => {
    if (!user.doorId) {
      onSubmitDoor({ doorId: getRandomItem(doors), ready: true });
    } else if (!user.ready) {
      onMakeReady();
    }
  };

  const { timeLeft } = useCountdown({
    duration: ROUND_DURATION * 60 * (trap === TRAPS.HALF_TIME ? 0.5 : 1) + TIMER_LEAD,
    onExpire: handleExpire,
  });

  useEffect(() => {
    if ((timeLeft - TIMER_LEAD) % 30 === 0) {
      if (trap === TRAPS.DELAYING_DOORS) {
        setCache((prevState) => {
          const prevDoors = prevState.doors || [];
          prevDoors.push(prevDoors.length - 1 + 1);

          return { doors: prevDoors };
        });
      }
      if (trap === TRAPS.VANISHING_DOORS) {
        setCache((prevState) => {
          const prevDoors = prevState.doors || [];
          prevDoors.push(prevDoors.length - 2 + 1);

          return { doors: prevDoors };
        });
      }
    }
    return () => {};
  }, [timeLeft, setCache]); // eslint-disable-line react-hooks/exhaustive-deps

  if (timeLeft - TIMER_LEAD === 0) {
    onDisableButtons();
  }

  if (timeLeft - TIMER_LEAD < 0) {
    return (
      <div className="i-sand-timer i-sand-timer--negative">
        <IconAvatar icon={<MagicHourGlassIcon />} /> 0
      </div>
    );
  }

  return (
    <div className="i-sand-timer">
      <IconAvatar icon={<MagicHourGlassIcon />} /> {formatTime(timeLeft - TIMER_LEAD)}
    </div>
  );
}
