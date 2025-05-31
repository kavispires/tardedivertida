import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Region } from 'pages/Daily/components/Region';
import { useState } from 'react';
// Ant Design Resources
import { BarChartOutlined, BulbOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Image, Layout, Modal, Space, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAnimation } from 'utils/animations';
// Icons
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';
// Components
import { ImageCard } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyEspionagemEntry } from '../utils/types';
import { useEspionagemEngine } from '../utils/useEspionagemEngine';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { ReleaseModal } from './ReleaseModal';
import { Statements } from './Statements';

const MotionFlex = motion(Flex);

type DailyEspionagemProps = {
  data: DailyEspionagemEntry;
  currentUser: Me;
};

export function DailyEspionagem({ data }: DailyEspionagemProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    hearts,
    released,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    onRelease,
    onSelectSuspect,
    onDeselectSuspect,
    onNeedClue,
    activeSuspectId,
    statementsCutoffLength,
  } = useEspionagemEngine(data, initialState);
  const width = useCardWidth(5, { margin: 64, maxWidth: 128, minWidth: 64 });

  return (
    <Layout className="app">
      <Header icon={<DailyMovieGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={<Rules date={data.id} />}
        />

        <Region>
          <Typography.Text strong>
            <Translate pt="Quem é o culpado?" en="Who is the culprit?" />
          </Typography.Text>
        </Region>

        {isComplete && (
          <Space className="results-container" direction="vertical" align="center">
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
        )}

        <Region>
          <Image.PreviewGroup>
            <div className="espionagem-suspects-grid">
              {data.suspects.map((suspect, index) => {
                const isReleased = released.includes(suspect.id);
                return (
                  <MotionFlex
                    vertical
                    key={suspect.id}
                    align="center"
                    {...getAnimation('flipInY', { delay: 0.1 * index })}
                  >
                    <ImageCard
                      id={suspect.id}
                      cardWidth={width}
                      className={clsx('espionagem-suspect-card', {
                        'espionagem-released-suspect': isReleased,
                        'espionagem-culprit-suspect': isComplete && data.culpritId === suspect.id,
                      })}
                    />
                    <Button
                      size="small"
                      shape="round"
                      block
                      onClick={() => onSelectSuspect(suspect.id)}
                      disabled={isReleased || isComplete}
                    >
                      {isReleased ? <CheckCircleOutlined /> : <Translate pt="Liberar" en="Release" />}
                    </Button>
                  </MotionFlex>
                );
              })}
            </div>
          </Image.PreviewGroup>
        </Region>

        <Region>
          <Typography.Text strong>
            <Translate pt="Declarações" en="Statements" />
          </Typography.Text>
          <Statements
            statements={data.statements}
            statementsCutoffLength={statementsCutoffLength}
            released={released}
            isComplete={isComplete}
            animate
          />

          <Typography.Paragraph className="text-center">
            <Translate
              pt={
                <>
                  Libere alguém que <strong>não</strong> se encaixe nas declarações.
                </>
              }
              en={
                <>
                  Release someone who <strong>does not</strong> fit the statements.
                </>
              }
            />
          </Typography.Paragraph>

          {hearts > 0 && (
            <Button
              icon={<BulbOutlined />}
              onClick={() => onNeedClue()}
              type="primary"
              block
              disabled={isComplete}
            >
              <Translate pt="Preciso de mais dicas" en="I need more hints" />
            </Button>
          )}
        </Region>

        {activeSuspectId && (
          <ReleaseModal
            onRelease={onRelease}
            onDeselectSuspect={onDeselectSuspect}
            activeSuspectId={activeSuspectId}
            statementsCutoffLength={statementsCutoffLength}
            statements={data.statements}
            suspects={data.suspects}
            released={released}
          />
        )}

        <Modal open={showResultModal} onCancel={() => setShowResultModal(false)} footer={null}>
          <ResultsModalContent
            challenge={data.number}
            win={isWin}
            hearts={hearts}
            suspects={data.suspects}
            reason={data.reason}
            released={released}
            culpritId={data.culpritId}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}
