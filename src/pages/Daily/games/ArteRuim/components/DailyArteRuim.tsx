import { Button, Layout, Modal, Space } from 'antd';
import { Translate } from 'components/language';
import { DailyArtGameIcon } from 'icons/DailyArtGameIcon';
import { Keyboard } from 'pages/Daily/components/Keyboard';
import { Me } from 'types/user';

import { BarChartOutlined } from '@ant-design/icons';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { SETTINGS } from '../utils/settings';
import { DailyArteRuimEntry } from '../utils/types';
import { useArteRuimEngine } from '../utils/useArteRuimEngine';
import { DrawingCarousel } from './DrawingCarousel';
import { Prompt } from './Prompt';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyArteRuimProps = {
  data: DailyArteRuimEntry;
  currentUser: Me;
};

export function DailyArteRuim({ data }: DailyArteRuimProps) {
  const { hearts, guesses, showResultModal, setShowResultModal, isWin, isComplete, guessLetter, solution } =
    useArteRuimEngine(data);

  return (
    <Layout className="app">
      <Header icon={<DailyArtGameIcon />}>
        TD <Translate pt="Diário" en="Daily" /> #{data.number}
      </Header>
      <Layout.Content>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={<Rules />}
        />

        <DrawingCarousel drawings={data.drawings} />

        <Prompt text={data.text} guesses={guesses} />

        {isComplete && (
          <Space className="results-container" direction="vertical" align="center">
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
        )}
        <Modal
          title={<Translate pt="Resultado" en="Results" />}
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
        >
          <ResultsModalContent
            challenge={data.number}
            win={isWin}
            hearts={hearts}
            text={data.text}
            solution={solution}
          />
        </Modal>

        <Keyboard lettersState={guesses} onLetterClick={guessLetter} disabled={isComplete} />
      </Layout.Content>
    </Layout>
  );
}
