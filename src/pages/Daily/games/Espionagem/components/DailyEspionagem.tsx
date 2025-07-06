import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Region } from 'pages/Daily/components/Region';
import { useState } from 'react';
// Ant Design Resources
import { BarChartOutlined, BulbOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Image, Layout, Modal, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { getAnimation } from 'utils/animations';
// Icons
import { DailyMovieGameIcon } from 'icons/DailyMovieGameIcon';
// Components
import { getSuspectImageId } from 'components/cards/SuspectCard';
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
    isLose,
    isComplete,
    onRelease,
    onSelectSuspect,
    onDeselectSuspect,
    onNeedClue,
    activeSuspectId,
  } = useEspionagemEngine(data, initialState);
  const width = useCardWidth(4, { margin: 32, maxWidth: 256, minWidth: 64 });

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

        {!isComplete ? (
          <Region>
            <Typography.Text strong>
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
            </Typography.Text>
          </Region>
        ) : (
          <Region className="center">
            <Typography.Text>
              {isWin && <Translate pt="Você achou o culpado!" en="You found the culprit!" />}
              {isLose && (
                <Translate
                  pt={
                    <>
                      <strong>Você liberou o culpado!</strong>
                      <br />
                      Agora crimes continuarão acontecendo.
                      <br />
                      <em>
                        Se você discorda das respostas e está revoltado, ajude a melhorar o jogo participando
                        do
                        <strong> Tá Na Cara</strong> na seção Contribua do TD!
                      </em>
                    </>
                  }
                  en={<>You released the culprit! Now crimes will keep happening.</>}
                />
              )}
            </Typography.Text>
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Region>
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
                    onClick={() => !isReleased && !isComplete && onSelectSuspect(suspect.id)}
                  >
                    <ImageCard
                      id={getSuspectImageId(suspect.id, 'gb')}
                      cardWidth={width}
                      className={clsx('espionagem-suspect-card', {
                        'espionagem-released-suspect': isReleased,
                        'espionagem-culprit-suspect': isComplete && data.culpritId === suspect.id,
                      })}
                      preview={false}
                    />
                    <Button
                      size="small"
                      shape="round"
                      block
                      // onClick={() => onSelectSuspect(suspect.id)}
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
            additionalStatements={data.additionalStatements}
            hearts={hearts}
            released={released}
            isComplete={isComplete}
            animate
          />

          {!isComplete && hearts > 0 && (
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
            hearts={hearts}
            statements={data.statements}
            additionalStatements={data.additionalStatements}
            suspects={data.suspects}
            released={released}
          />
        )}

        <Modal open={showResultModal} onCancel={() => setShowResultModal(false)} footer={null}>
          <ResultsModalContent
            challengeNumber={data.number}
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
