import { useEffect } from 'react';
import clsx from 'clsx';
// Design Resource
import { Button } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Utils
import { kebabToPascal } from '../../utils/helpers';
// Components
import { TimedButton } from './index';
import { Title } from './Title';
import * as IconIllustrations from '../icons';

const IconIllustrationsComponents: any = IconIllustrations;

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
  animated?: boolean;
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
  animated = true,
}: PhaseAnnouncementProps) {
  const { translate } = useLanguage();
  const durationPerRound = [15, 15, 10, 5, 5, 5]?.[currentRound] ?? 5;
  const Icon: any =
    IconIllustrationsComponents[kebabToPascal(type ?? 'multitask')] ?? IconIllustrationsComponents.Multitask;

  return (
    <div
      className={clsx(
        'phase-announcement',
        animated && 'animate__animated',
        animated && 'animate__backInDown',
        // animated && 'animate__backInRight',
        className
      )}
    >
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

type PhaseTimerResetProps = {
  setStep: GenericFunction;
};

/**
 * Component to be place in between sequential PhaseAnnouncement to reset the automatic timer
 * @param props
 * @returns
 */
export function PhaseTimerReset({ setStep }: PhaseTimerResetProps) {
  useEffect(() => {
    const delay = () => new Promise((res) => setTimeout(res, 100));
    const next = async () => {
      await delay();
      setStep((s: number) => s + 1);
    };

    next();
  }, []); // eslint-disable-line

  return <div></div>;
}
