import { useMemo, type ComponentProps } from 'react';
import { useLocation } from 'react-router-dom';
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
  const { pathname } = useLocation();

  const componentEffect = useMemo(() => {
    if (pathname.includes('/diario/hub') || pathname === '/diario') {
      if (month === 11) {
        return <SnowEffect />;
      }
    }
    return null;
  }, [pathname, month]);

  const backgroundOverride = useMemo(() => {
    if (month === 11) {
      return {
        background: 'linear-gradient(#cf3434, #810505)', // December theme
      };
    }

    return {};
  }, [month]);

  return (
    <Content {...props} style={{ ...backgroundOverride, ...props.style }}>
      {componentEffect}
      {children}
    </Content>
  );
}
