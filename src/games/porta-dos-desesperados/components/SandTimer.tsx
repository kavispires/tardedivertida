import { IconAvatar } from 'components/avatars/IconAvatar';
import { MagicHourGlassIcon } from 'icons/MagicHourGlassIcon';
import { useCountdown } from 'hooks/useCountdown';
import { getRandomItem } from 'utils/helpers';
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
  const handleExpire = () => {
    if (!user.doorId) {
      onSubmitDoor({ doorId: getRandomItem(doors), ready: true });
    } else if (!user.ready) {
      onMakeReady();
    }
  };

  const timer = useCountdown({
    duration: ROUND_DURATION * 60 * (trap === TRAPS.HALF_TIME ? 0.5 : 1) + TIMER_LEAD,
    onExpire: handleExpire,
  });

  if (timer.timeLeft - TIMER_LEAD === 0) {
    onDisableButtons();
  }

  if (timer.timeLeft - TIMER_LEAD < 0) {
    return (
      <div className="i-sand-timer i-sand-timer--negative">
        <IconAvatar icon={<MagicHourGlassIcon />} /> 0
      </div>
    );
  }

  return (
    <div className="i-sand-timer">
      <IconAvatar icon={<MagicHourGlassIcon />} /> {timer.timeLeft - TIMER_LEAD}...
    </div>
  );
}
