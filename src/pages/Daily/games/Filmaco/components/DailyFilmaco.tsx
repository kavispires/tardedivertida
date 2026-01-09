import { useState } from 'react';
// Ant Design Resources
import { BarChartOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, Space, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';
// Components
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Pages
import { DailyContent } from 'pages/Daily/components/DailyContent';
import { DailyItem } from 'pages/Daily/components/DailyItem';
import { Keyboard } from 'pages/Daily/components/Keyboard';
import { Region } from 'pages/Daily/components/Region';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyFilmacoEntry } from '../utils/types';
import { useFilmacoEngine } from '../utils/useFilmacoEngine';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { Prompt } from './Prompt';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyFilmacoProps = {
  data: DailyFilmacoEntry;
  currentUser: Me;
};

export function DailyFilmaco({ data }: DailyFilmacoProps) {
  const [initialState] = useState(getInitialState(data));
  const { hearts, guesses, showResultModal, setShowResultModal, isWin, isComplete, guessLetter, solution } =
    useFilmacoEngine(data, initialState);
  const width = useCardWidth(5, { margin: 64, maxWidth: 100, minWidth: 65 });

  return (
    <Layout className="app">
      <Header
        icon={<DailyMovieGameIcon />}
        localStorageKey={SETTINGS.KEY}
      >
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <DailyContent>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={<Rules date={data.id} />}
        />

        <Region>
          {data?.isDoubleFeature ? (
            <Typography.Text strong>
              <Translate
                pt="Sessão Dupla"
                en="Double Feature"
              />{' '}
              {data.year}
            </Typography.Text>
          ) : (
            <Typography.Text strong>
              <Translate
                pt="Ano de Lançamento"
                en="Release Year"
              />
              : {data.year}
            </Typography.Text>
          )}
        </Region>

        <SpaceContainer wrap>
          {data.itemsIds.map((itemId, index) => (
            <DailyItem
              key={`${itemId}-${index}`}
              itemId={itemId}
              width={width}
            />
          ))}
        </SpaceContainer>

        <Prompt
          text={data.title}
          guesses={guesses}
        />

        {isComplete && (
          <Space
            className="results-container"
            orientation="vertical"
            align="center"
          >
            <Button
              onClick={() => setShowResultModal(true)}
              type="primary"
              icon={<BarChartOutlined />}
            >
              <Translate
                pt="Ver Resultado"
                en="Show Results"
              />
            </Button>
          </Space>
        )}

        <Modal
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          footer={null}
        >
          <ResultsModalContent
            challengeNumber={data.number}
            win={isWin}
            hearts={hearts}
            text={data.title}
            solution={solution}
          />
        </Modal>

        <Keyboard
          lettersState={guesses}
          onLetterClick={guessLetter}
          disabled={isComplete}
          withNumbers
        />
      </DailyContent>
    </Layout>
  );
}
