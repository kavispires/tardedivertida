import { useState, type ComponentType } from 'react';
// Ant Design Resources
import { Steps } from 'antd';
// Components
import { Translate } from 'components/language';
import { PageLayout } from 'components/layout/PageLayout';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Title } from 'components/text';
// Internal
import { LanguageTest } from './components/LanguageTest';
import { DrawingTest } from './components/DrawingTest';
import { Results } from './components/Results';
import { ResizingTest } from './components/ResizingTest';
import { FloatingHandTest } from './components/FloatingHandTest';
import { TimersTest } from './components/TimersTest';
import { TextHighlightTest } from './components/TextHighlightTest';
import { RibbonsTest } from './components/RibbonsTest';
import { AvatarsTest } from './components/AvatarsTest';
import { CompleteTest } from './components/CompleteTest';
import { SoundsTest } from './components/SoundsTest';
import { IconsTest } from './components/IconsTest';
import { MouseFollowingContentTest } from './components/FollowerTest';

export type TestStepProps = {
  step: number;
  onResult: (stepIndex: number, value: boolean) => void;
  results?: boolean[];
};

type StepConfig = {
  key: string;
  title: string;
  component: ComponentType<TestStepProps>;
};

const stepConfigs: StepConfig[] = [
  {
    key: 'language',
    title: '',
    component: LanguageTest,
  },
  {
    key: 'canvas',
    title: '',
    component: DrawingTest,
  },
  {
    key: 'resizing',
    title: '',
    component: ResizingTest,
  },
  {
    key: 'floating-hand',
    title: '',
    component: FloatingHandTest,
  },
  {
    key: 'timers',
    title: '',
    component: TimersTest,
  },
  {
    key: 'text-highlight',
    title: '',
    component: TextHighlightTest,
  },
  {
    key: 'ribbons',
    title: '',
    component: RibbonsTest,
  },
  {
    key: 'avatars',
    title: '',
    component: AvatarsTest,
  },
  {
    key: 'sounds',
    title: '',
    component: SoundsTest,
  },
  {
    key: 'icons',
    title: '',
    component: IconsTest,
  },
  {
    key: 'follower',
    title: '',
    component: MouseFollowingContentTest,
  },
  {
    key: 'done',
    title: '',
    component: CompleteTest,
  },
];

const steps = stepConfigs.map(({ key, title }) => ({ key, title }));

function TestArea() {
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);

  const setResult = (stepIndex: number, value: boolean) => {
    setResults((prev) => {
      const newResults = [...prev];
      newResults[stepIndex] = value;
      return newResults;
    });
    setCurrent((prev) => prev + 1);
  };

  const Content = stepConfigs[current]?.component;

  return (
    <PageLayout className="container">
      <SpaceContainer className="full-width" vertical>
        <Title level={1} size="large">
          <Translate pt="Área de Teste" en="Test Area" />
        </Title>

        <Steps current={current} items={steps} size="small" />

        {Content && <Content onResult={setResult} step={current} results={results} />}

        <Results results={results} steps={steps} activeStep={current} />
      </SpaceContainer>
    </PageLayout>
  );
}

export default TestArea;
