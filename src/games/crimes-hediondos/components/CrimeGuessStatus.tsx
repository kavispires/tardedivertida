import clsx from 'clsx';
// Ant Design Resources
import { QuestionCircleFilled } from '@ant-design/icons';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxMinusIcon } from 'icons/BoxMinusIcon';
import { BoxOneIcon } from 'icons/BoxOneIcon';
import { BoxThreeIcon } from 'icons/BoxThreeIcon';
import { BoxTwoIcon } from 'icons/BoxTwoIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
import { LockIcon } from 'icons/LockIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { TextHighlight } from 'components/text';
// Internal
import { GUESS_STATUS } from '../utils/constants';

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
    case GUESS_STATUS.LOCKED:
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <IconAvatar icon={<LockIcon />} />
          <TextHighlight>
            <Translate
              pt="TRAVADO"
              en="LOCKED"
            />
          </TextHighlight>
          {withDescription && (
            <Translate
              pt="Você já tinha adivinhado esse corretamente"
              en="You already guessed this one correctly"
            />
          )}
        </span>
      );
    case GUESS_STATUS.CORRECT:
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <IconAvatar icon={<BoxCheckMarkIcon />} />
          <TextHighlight>
            <Translate
              pt="CORRETO"
              en="CORRECT"
            />
          </TextHighlight>
          {withDescription && (
            <Translate
              pt="Você acertou arma e objeto"
              en="You got the weapon and object correctly"
            />
          )}
        </span>
      );
    case GUESS_STATUS.ONE:
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <IconAvatar icon={<BoxOneIcon />} />
          <TextHighlight>
            <Translate
              pt="SOMENTE UM"
              en="ONE ONLY"
            />
          </TextHighlight>
          {withDescription && (
            <Translate
              pt="Um dos items está correto"
              en="One of the items is correct"
            />
          )}
        </span>
      );
    case GUESS_STATUS.TWO:
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <IconAvatar icon={<BoxTwoIcon />} />
          <TextHighlight>
            <Translate
              pt="DOIS"
              en="TWO"
            />
          </TextHighlight>
          {withDescription && (
            <Translate
              pt="Dois dos items estão corretos"
              en="Two of the items are correct"
            />
          )}
        </span>
      );
    case GUESS_STATUS.THREE:
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <IconAvatar icon={<BoxThreeIcon />} />
          <TextHighlight>
            <Translate
              pt="TRÊS"
              en="THREE"
            />
          </TextHighlight>
          {withDescription && (
            <Translate
              pt="Três dos items estão corretos"
              en="Three of the items are correct"
            />
          )}
        </span>
      );
    case GUESS_STATUS.WRONG:
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <IconAvatar icon={<BoxMinusIcon />} />
          <TextHighlight>
            <Translate
              pt="ERRADO"
              en="WRONG"
            />
          </TextHighlight>
          {withDescription && (
            <Translate
              pt="Você errou todas as coisas, mas está no quadrante certo"
              en="You got all things wrong but you are in the right group"
            />
          )}
        </span>
      );
    case GUESS_STATUS.WRONG_GROUP:
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <IconAvatar icon={<BoxXIcon />} />
          <TextHighlight>
            <Translate
              pt="GRUPO ERRADO"
              en="WRONG GROUP"
            />
          </TextHighlight>
          {withDescription && (
            <Translate
              pt="Você é tão burro que você escolheu items no grupo errado"
              en="You're so dumb you chose items in the wrong group"
            />
          )}
        </span>
      );
    default:
      return (
        <span className={clsx(baseClass, `${baseClass}--${status}`, className)}>
          <QuestionCircleFilled />
          <Translate
            pt="?"
            en="?"
          />
          );
          {withDescription && (
            <Translate
              pt="Recebido status desconhecido"
              en="Received unknown guess status"
            />
          )}
        </span>
      );
  }
}
