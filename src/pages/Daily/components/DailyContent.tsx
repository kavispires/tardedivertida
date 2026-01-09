import { type JSX, lazy, Suspense, useMemo, type ComponentProps } from 'react';
import { useLocation } from 'react-router-dom';
// Ant Design Resources
import { Layout } from 'antd';

const { Content } = Layout;

type DateRangeEffect = {
  // Start date in YYYY-MM-DD format
  startDate: string;
  // End date in YYYY-MM-DD format
  endDate: string;
  // Effect component to render
  component: React.LazyExoticComponent<() => JSX.Element>;
  // Background style override
  background?: string;
};

const DATE_RANGE_EFFECTS: DateRangeEffect[] = [
  // New Year Effect
  {
    startDate: '2025-12-31',
    endDate: '2026-01-10',
    component: lazy(() =>
      import('components/visual-effects/FireworksEffect').then((module) => ({
        default: module.FireworksEffect,
      })),
    ),
    background: 'linear-gradient(#ffffff, #d2f6ff, #000000)', // New Year theme
  },
  // Carnaval Effect
  {
    startDate: '2026-02-13',
    endDate: '2026-02-18',
    component: lazy(() =>
      import('components/visual-effects/ConfettiEffect').then((module) => ({
        default: module.ConfettiEffect,
      })),
    ),
    background: 'linear-gradient(#ffecb3, #ffe0b2, #ffccbc)', // Carnaval theme
  },
  // Valentine's Day Effect
  // {
  //   startDate: '2026-02-10',
  //   endDate: '2026-02-16',
  //   component: lazy(() =>
  //     import('components/visual-effects/ConfettiEffect').then((module) => ({
  //       default: module.ConfettiEffect,
  //     })),
  //   ),
  //   background: 'linear-gradient(#ffe6f0, #ffb3c6)', // Valentine's theme
  // },
  // Christmas Effect
  {
    startDate: '2026-12-01',
    endDate: '2027-12-26',
    component: lazy(() =>
      import('components/visual-effects/SnowEffect').then((module) => ({ default: module.SnowEffect })),
    ),
    background: 'linear-gradient(#cf3434, #810505)', // Christmas theme
  },
];

/**
 * Checks if the current date is within a date range
 */
function isDateInRange(startDate: string, endDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return today >= start && today <= end;
}

/**
 * Gets the active effect configuration for the current date
 */
function getActiveEffect(): DateRangeEffect | null {
  return DATE_RANGE_EFFECTS.find((effect) => isDateInRange(effect.startDate, effect.endDate)) ?? null;
}

type DailyContentProps = {
  children: React.ReactNode;
} & ComponentProps<typeof Content>;

export function DailyContent({ children, ...props }: DailyContentProps) {
  const { pathname } = useLocation();

  const activeEffect = useMemo(() => getActiveEffect(), []);

  const componentEffect = useMemo(() => {
    if (pathname.includes('/diario/hub') || pathname === '/diario') {
      if (activeEffect) {
        const EffectComponent = activeEffect.component;
        return (
          <Suspense fallback={null}>
            <EffectComponent />
          </Suspense>
        );
      }
    }
    return null;
  }, [pathname, activeEffect]);

  const backgroundOverride = useMemo(() => {
    if (activeEffect?.background) {
      return {
        background: activeEffect.background,
      };
    }

    return {};
  }, [activeEffect]);

  return (
    <Content
      {...props}
      style={{ ...backgroundOverride, ...props.style }}
    >
      {componentEffect}
      {children}
    </Content>
  );
}
