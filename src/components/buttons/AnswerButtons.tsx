import clsx from 'clsx';
import type { ComponentProps } from 'react';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxMinusIcon } from 'icons/BoxMinusIcon';
import { BoxPlusIcon } from 'icons/BoxPlusIcon';
import { BoxXIcon } from 'icons/BoxXIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
// Internal
import { TransparentButton } from './TransparentButton';
// Sass
import './AnswerButtons.scss';

type AnswerButtonProps = {
  /**
   * The size of the icon
   */
  size?: number;
} & Omit<ComponentProps<typeof TransparentButton>, 'children'>;

export function AnswerYesButton({ className, ...props }: AnswerButtonProps) {
  return (
    <TransparentButton className={clsx('answer-button answer-button--yes', className)} {...props}>
      <IconAvatar icon={<BoxCheckMarkIcon />} size={64} />
      <div className="answer-button__label">
        <Translate pt="Sim" en="Yes" />
      </div>
    </TransparentButton>
  );
}

export function AnswerNoButton({ className, ...props }: AnswerButtonProps) {
  return (
    <TransparentButton className={clsx('answer-button answer-button--no', className)} {...props}>
      <IconAvatar icon={<BoxXIcon />} size={64} />
      <div className="answer-button__label">
        <Translate pt="Não" en="No" />
      </div>
    </TransparentButton>
  );
}

export function AnswerMaybeYesButton({ className, ...props }: AnswerButtonProps) {
  return (
    <TransparentButton className={clsx('answer-button answer-button--maybe-yes', className)} {...props}>
      <IconAvatar icon={<BoxPlusIcon color="#83d39c" />} size={64} />
      <div className="answer-button__label">
        <Translate pt="Meio Sim" en="Maybe Yes" />
      </div>
    </TransparentButton>
  );
}

export function AnswerKindaNoButton({ className, ...props }: AnswerButtonProps) {
  return (
    <TransparentButton className={clsx('answer-button answer-button--kinda-no', className)} {...props}>
      <IconAvatar icon={<BoxMinusIcon color="#e8818c" />} size={64} />
      <div className="answer-button__label">
        <Translate pt="Talvez Não" en="Kinda No" />
      </div>
    </TransparentButton>
  );
}
