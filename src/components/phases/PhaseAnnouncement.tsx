import clsx from 'clsx';
// Design Resource
import { Button } from 'antd';
// Hooks
import { useLanguage } from 'hooks';
// Utils
import { getAnimationClass, kebabToPascal } from 'utils/helpers';
// Components
import { Icons, TimedButton, Title } from 'components';

const IconIllustrationsComponents: any = Icons;

type PhaseAnnouncementProps = {
  title: any;
  onClose: GenericFunction;
  buttonText?: string;
  children?: any;
  className?: string;
  currentRound?: number;
  duration?: number;
  type?: string;
  unskippable?: boolean;
  withoutTimer?: boolean;
  animationType?: AnimationType;
};
export function PhaseAnnouncement({
  buttonText,
  type,
  title,
  children,
  duration,
  currentRound = 0,
  onClose,
  className,
  withoutTimer = false,
  unskippable,
  animationType = 'backInDown',
}: PhaseAnnouncementProps) {
  const { translate } = useLanguage();
  const durationPerRound = [15, 15, 10, 5, 5, 5]?.[currentRound] ?? 5;
  const Icon: any =
    IconIllustrationsComponents[kebabToPascal(type ?? 'multitask')] ?? IconIllustrationsComponents.Multitask;

  return (
    <div className={clsx('phase-announcement', getAnimationClass(animationType), className)}>
      <Title>{title}</Title>
      <Icon className="phase-announcement__icon" />

      {children}

      {withoutTimer ? (
        <Button type="primary" onClick={onClose}>
          {translate('Prosseguir', 'Continue', buttonText)}
        </Button>
      ) : (
        <TimedButton
          duration={duration || durationPerRound}
          type="text"
          label={translate('Prosseguir', 'Continue', buttonText)}
          onClick={onClose}
          onExpire={onClose}
          disabled={unskippable}
        />
      )}
    </div>
  );
}
