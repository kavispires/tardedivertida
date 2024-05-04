import { Button, Layout, Modal, Space } from 'antd';
import { DualTranslate, Translate } from 'components/language';
import { DailyWordGameIcon } from 'icons/DailyWordGameIcon';
import { Me } from 'types/user';

import { BarChartOutlined } from '@ant-design/icons';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { SETTINGS } from '../utils/settings';
import { DailyPalavreadoEntry } from '../utils/type';
import { usePalavreadoEngine } from '../utils/usePalavreadoEngine';
import { Board } from './Board';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { Word } from './Word';

type DailyPalavreadoProps = {
  data: DailyPalavreadoEntry;
  currentUser: Me;
};

export function DailyPalavreado({ data }: DailyPalavreadoProps) {
  const {
    hearts,
    selection,
    guesses,
    letters,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    selectLetter,
    submitWord,
    latestWord,
  } = usePalavreadoEngine(data);

  return (
    <Layout className="app">
      <Header icon={<DailyWordGameIcon />}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content>
        <Menu hearts={hearts} total={SETTINGS.HEARTS} openRules={true} rules={<Rules />} />

        <Space className="space-container" direction="vertical" align="center">
          <Board letters={letters} onLetterSelection={selectLetter} selection={selection} />

          <Word
            letters={letters}
            onLetterSelection={selectLetter}
            selection={selection}
            onSubmitWord={submitWord}
            latestWord={latestWord}
          />
        </Space>

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
            challenge={data?.number}
            isWin={isWin}
            isLose={isLose}
            hearts={hearts}
            words={data.words}
            guesses={guesses}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
