import clsx from 'clsx';
import type { ComponentProps } from 'react';
// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
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
      <Translate pt="Sim" en="Yes" />
    </TransparentButton>
  );
}

export function AnswerNoButton({ className, ...props }: AnswerButtonProps) {
  return (
    <TransparentButton className={clsx('answer-button answer-button--no', className)} {...props}>
      <IconAvatar icon={<BoxXIcon />} size={64} />
      <Translate pt="Não" en="No" />
    </TransparentButton>
  );
}
