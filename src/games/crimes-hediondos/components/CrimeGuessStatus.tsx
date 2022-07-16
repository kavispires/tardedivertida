import clsx from 'clsx';
// Ant Design Resources
import {
  CheckCircleFilled,
  CloseCircleFilled,
  LockFilled,
  MinusCircleFilled,
  QuestionCircleFilled,
  WarningFilled,
} from '@ant-design/icons';
// Components
import { Translate } from 'components/language';

type CrimeGuessStatusProps = {
  status: string;
  withDescription?: boolean;
  /**
   * Optional custom class name
   */
  className?: string;
};

export function CrimeGuessStatus({ status, withDescription = false, className = '' }: CrimeGuessStatusProps) {
  const baseClass = 'crime-guess-status';

  switch (status) {
    case 'LOCKED':
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <LockFilled color="gray" />
          <Translate pt="TRAVADO" en="LOCKED" />
          {withDescription && (
            <Translate
              pt=": Você já tinha adivinhado esse corretamente"
              en=": You already guessed this one correctly"
            />
          )}
        </span>
      );
    case 'CORRECT':
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <CheckCircleFilled color="green" />
          <Translate pt="CORRETO" en="CORRECT" />
          {withDescription && (
            <Translate pt=": Você acertou arma e objeto" en=": You got the weapon and object correctly" />
          )}
        </span>
      );
    case 'HALF':
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <MinusCircleFilled />
          <Translate pt="SOMENTE UM" en="ONE ONLY" />
          {withDescription && (
            <Translate pt=": Um dos items está correto" en=": One of the items is correct" />
          )}
        </span>
      );
    case 'WRONG':
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <CloseCircleFilled color="red" />
          <Translate pt="ERRADO" en="WRONG" />
          {withDescription && (
            <Translate pt=": Você errou ambos arma e objeto" en=": You got both weapon and object wrong" />
          )}
        </span>
      );
    case 'WRONG_GROUP':
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <WarningFilled color="red" />
          <Translate pt="GRUPO ERRADO" en="WRONG GROUP" />
          {withDescription && (
            <Translate
              pt=": Você é tão burro que você escolheu items no grupo errado"
              en=": You're so dumb you chose items in the wrong group"
            />
          )}
        </span>
      );
    default:
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <QuestionCircleFilled />
          <Translate pt="?" en="?" />
          );
          {withDescription && (
            <Translate pt=": Recebido status desconhecido" en=": Received unknown guess status" />
          )}
        </span>
      );
  }
}
