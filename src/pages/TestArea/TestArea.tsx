import { useState } from 'react';
// Ant Design Resources
import { Space, Steps } from 'antd';
// Components
import { Translate } from 'components/language';
import { PageLayout } from 'components/layout/PageLayout';
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

const steps = [
  {
    key: 'language',
    title: '',
    content: LanguageTest,
  },
  {
    key: 'canvas',
    title: '',
    content: DrawingTest,
  },
  {
    key: 'resizing',
    title: '',
    content: ResizingTest,
  },
  {
    key: 'floating-hand',
    title: '',
    content: FloatingHandTest,
  },
  {
    key: 'timers',
    title: '',
    content: TimersTest,
  },
  {
    key: 'text-highlight',
    title: '',
    content: TextHighlightTest,
  },
  {
    key: 'ribbons',
    title: '',
    content: RibbonsTest,
  },
  {
    key: 'avatars',
    title: '',
    content: AvatarsTest,
  },
  {
    key: 'sounds',
    title: '',
    content: SoundsTest,
  },
  {
    key: 'icons',
    title: '',
    content: IconsTest,
  },
  {
    key: 'follower',
    title: '',
    content: MouseFollowingContentTest,
  },
  {
    key: 'done',
    title: '',
    content: CompleteTest,
  },
];

export type TestStepProps = {
  step: number;
  onResult: (stepIndex: number, value: boolean) => void;
  results?: boolean[];
};

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

  const Content = steps[current].content;

  return (
    <PageLayout className="container">
      <Space className="space-container full-width" direction="vertical">
        <Title level={1} size="large">
          <Translate pt="Área de Teste" en="Test Area" />
        </Title>

        <Steps current={current} items={steps} size="small" />

        <Content onResult={setResult} step={current} results={results} />

        <Results results={results} steps={steps} activeStep={current} />
      </Space>
    </PageLayout>
  );
}

export default TestArea;
