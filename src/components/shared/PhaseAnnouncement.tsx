import clsx from 'clsx';
// Design Resource
import { Button } from 'antd';
// Hooks
import { useLanguage } from '../../hooks';
// Components
import { TimedButton } from './index';
import { translate } from './Translate';
import { Title } from './Title';
import * as IconIllustrations from '../icons';
import { camelCase, startCase } from 'lodash';

const IconIllustrationsComponents: any = IconIllustrations;

/**
 * Converts a string from kebab case to pascal base
 * @param str
 * @returns
 */
const kebabToPascal = (str: string): string => startCase(camelCase(str)).replace(/ /g, '');

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
}: PhaseAnnouncementProps) {
  const language = useLanguage();
  const durationPerRound = [15, 15, 10, 5, 5, 5]?.[currentRound] ?? 5;
  const Icon: any =
    IconIllustrationsComponents[kebabToPascal(type ?? 'multitask')] ?? IconIllustrationsComponents.Multitask;

  return (
    <div className={clsx('phase-announcement', className)}>
      <Title>{title}</Title>
      <Icon className="phase-announcement__icon" />

      {children}

      {withoutTimer ? (
        <Button type="primary" onClick={onClose}>
          {translate('Prosseguir', 'Continue', language, buttonText)}
        </Button>
      ) : (
        <TimedButton
          duration={duration || durationPerRound}
          type="text"
          label={translate('Prosseguir', 'Continue', language, buttonText)}
          onClick={onClose}
          onExpire={onClose}
          disabled={unskippable}
        />
      )}
    </div>
  );
}
