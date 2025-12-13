import type { ComponentProps } from 'react';
// Ant Design Resources
import { Layout } from 'antd';
// Components
import { SnowEffect } from 'components/visual-effects/SnowEffect';

const { Content } = Layout;

type DailyContentProps = {
  children: React.ReactNode;
} & ComponentProps<typeof Content>;

export function DailyContent({ children, ...props }: DailyContentProps) {
  const month = new Date().getMonth();
  const componentEffect = () => {
    if (month === 11) {
      return <SnowEffect />;
    }
  };

  const backgroundOverride = () => {
    if (month === 11) {
      return {
        background: 'linear-gradient(#e50000, #810505)', // December theme
      };
    }

    return {};
  };

  return (
    <Content {...props} style={{ ...backgroundOverride(), ...props.style }}>
      {componentEffect()}
      {children}
    </Content>
  );
}
