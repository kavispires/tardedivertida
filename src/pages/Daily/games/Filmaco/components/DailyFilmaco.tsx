import { Button, Layout, Modal, Space, Typography } from 'antd';
import { ItemCard } from 'components/cards/ItemCard';
import { DualTranslate, Translate } from 'components/language';
import { useCardWidth } from 'hooks/useCardWidth';
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';
import { Keyboard } from 'pages/Daily/components/Keyboard';
import { Me } from 'types/user';

import { BarChartOutlined } from '@ant-design/icons';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { SETTINGS } from '../utils/settings';
import { DailyFilmacoEntry } from '../utils/types';
import { useFilmacoEngine } from '../utils/useFilmacoEngine';
import { Prompt } from './Prompt';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { Region } from 'pages/Daily/components/Region';

type DailyFilmacoProps = {
  data: DailyFilmacoEntry;
  currentUser: Me;
};

export function DailyFilmaco({ data }: DailyFilmacoProps) {
  const { hearts, guesses, showResultModal, setShowResultModal, isWin, isComplete, guessLetter, solution } =
    useFilmacoEngine(data);
  const width = useCardWidth(5, { margin: 64, maxWidth: 100, minWidth: 65 });

  return (
    <Layout className="app">
      <Header icon={<DailyMovieGameIcon />}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={<Rules />}
        />

        <Region>
          <Typography.Text strong>
            <Translate pt="Ano de Lançamento" en="Release Year" />: {data.year}
          </Typography.Text>
        </Region>

        <Space className="space-container" wrap>
          {data.itemsIds.map((itemId, index) => (
            <ItemCard key={`${itemId}-${index}`} id={itemId} width={width} />
          ))}
        </Space>

        <Prompt text={data.title} guesses={guesses} />

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
            text={data.title}
            solution={solution}
          />
        </Modal>

        <Keyboard lettersState={guesses} onLetterClick={guessLetter} disabled={isComplete} withNumbers />
      </Layout.Content>
    </Layout>
  );
}
