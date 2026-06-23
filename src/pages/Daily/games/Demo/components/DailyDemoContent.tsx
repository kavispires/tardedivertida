// Ant Design Resources
import { Layout } from 'antd';
// Hooks
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
// Icons
import { AnimatedProcessingIcon } from '@icons/AnimatedProcessingIcon';
// Components
import { DualTranslate } from '@components/language/DualTranslate';
// Pages
import { DailyContent } from '@pages/Daily/components/DailyContent';
import { Header } from '@pages/Daily/components/Header';
import { Menu } from '@pages/Daily/components/Menu';

type DailyDemoProps = {
  data: unknown;
};

export function DailyDemoContent({ data: _data }: DailyDemoProps) {
  const [_, ref] = useCardWidthByContainerRef(1, {
    margin: 72,
    gap: 0,
    maxWidth: 512,
    minWidth: 256,
  });
  return (
    <Layout>
      <Header
        icon={<AnimatedProcessingIcon />}
        localStorageKey=""
      >
        TD <DualTranslate>{{ en: 'Demo', pt: 'Demonstração' }}</DualTranslate>
      </Header>
      <DailyContent ref={ref}>
        <Menu
          hearts={0}
          total={1}
          openRules={true}
          rules={
            <>Não escrevi regras, estou testando alguma coisa que pedi pra vc testar também. Adivinhe!</>
          }
        />
      </DailyContent>
    </Layout>
  );
}
