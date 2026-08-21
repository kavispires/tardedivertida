import type { TextProps as AntdTextProps } from 'antd/es/typography/Text';
import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Components
import { useGameAppearance } from '@components/session/GameInfoContext';
// Sass
import styles from './Text.module.scss';

export type TextProps = AntdTextProps & {
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * The color scheme of the title (@default: the game info appearance color scheme or light)
   */
  colorScheme?: ColorScheme;
  /**
   * Optional custom class name
   */
  className?: string;
};

export function Text({ children, colorScheme, className, ...props }: TextProps) {
  const gameAppearance = useGameAppearance();
  const appliedColorScheme = colorScheme ?? gameAppearance.colorScheme ?? 'light';

  const colorClass =
    {
      light: styles.textLight,
      dark: styles.textDark,
    }[appliedColorScheme] ?? styles.textLight;

  return (
    <Typography.Text
      className={clsx(styles.text, colorClass, className)}
      {...props}
    >
      {children}
    </Typography.Text>
  );
}
