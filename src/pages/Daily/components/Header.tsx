import { type ReactNode, useState } from 'react';
// Ant Design Resources
import { Layout, Typography } from 'antd';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { DualTranslate } from 'components/language/DualTranslate';
// Internal
import { DevResetLocalStorageButton } from './DevResetLocalStorageButton';

type HeaderProps = {
  icon: ReactNode;
  children: ReactNode;
  localStorageKey: string;
};

export function Header({ icon, children, localStorageKey }: HeaderProps) {
  const [count, setCount] = useState(0);

  return (
    <Layout.Header className="daily-header">
      <button
        type="button"
        onClick={localStorageKey ? () => setCount((prev) => prev + 1) : undefined}
        className="invisible-secret-button daily-header"
      >
        <IconAvatar
          icon={icon}
          className="daily-header__icon"
        />
        <Typography.Title
          level={1}
          className="daily-heading"
        >
          {children}
        </Typography.Title>
      </button>
      {count >= 5 && <DevResetLocalStorageButton localStorageKey={localStorageKey} />}
    </Layout.Header>
  );
}

type GameHeaderProps = {
  /**
   * Settings object containing hub icon, key, and name
   */
  settings: {
    HUB_ICON: React.ComponentType;
    KEY: string;
    NAME: DualLanguageValue;
  } & Record<string, unknown>;
  /**
   * Puzzle number
   */
  number: number;
};

export function GameHeader({ settings, number }: GameHeaderProps) {
  return (
    <Header
      icon={<settings.HUB_ICON />}
      localStorageKey={settings.KEY}
    >
      TD <DualTranslate>{settings.NAME}</DualTranslate> #{number}
    </Header>
  );
}
