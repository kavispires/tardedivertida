import { motion, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import { useState } from 'react';
// Ant Design Resources
import { SaveFilled } from '@ant-design/icons';
import { Button, Divider, Flex, Layout, Space, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Utils
import { getAnimation } from '@utils/animations';
// Icons
import { ThumbsUpIcon } from '@icons/ThumbsUpIcon';
// Components
import { IconAvatar } from '@components/avatars/IconAvatar';
import { AnswerNoButton, AnswerYesButton } from '@components/buttons/AnswerButtons';
import { ImageCard } from '@components/image-cards/ImageCard';
import { ImageCardPreloadHand } from '@components/image-cards/ImageCardPreloadHand';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Instruction } from '@components/text/Instruction';
// Pages
import { DailyContent } from '@pages/Daily/components/DailyContent';
import { GameHeader } from '@pages/Daily/components/Header';
import { Menu } from '@pages/Daily/components/Menu';
import { NextGameSuggestion } from '@pages/Daily/components/NextGameSuggestion';
import { Region, RegionHint, RegionText } from '@pages/Daily/components/Region';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyConexoesEntry } from '../utils/types';
import { useConexoesEngine } from '../utils/useConexoesEngine';
import { Rules } from './Rules';

type DailyConexoesProps = {
  data: DailyConexoesEntry;
  currentUser: Me;
};

const SWIPE_THRESHOLD = 120;

export function DailyConexoes({ data }: DailyConexoesProps) {
  const [initialState] = useState(getInitialState(data.id, data.number));
  const {
    state,
    session,
    currentPair,
    canSave,
    canComplete,
    hasAnyRelationships,
    onStart,
    onEvaluatePair,
    onSave,
    onComplete,
    isSaving,
  } = useConexoesEngine(data, initialState);

  const cardWidth = useCardWidth(2, { margin: 6, maxWidth: 256, minWidth: 64 });

  const alreadyPlayed = state.played;
  const isPlaying = session.screen === 'playing';
  const isIdle = session.screen === 'idle';

  // Get next pair for preloading
  const nextPair = session.pairs[session.currentPairIndex + 1];
  const preloadHand = nextPair ? [nextPair.imageId1, nextPair.imageId2] : [];

  return (
    <Layout>
      <GameHeader
        settings={SETTINGS}
        number={data.number}
      />
      <DailyContent>
        <div>
          <Menu
            hearts={0}
            total={0}
            openRules
            rules={<Rules date={data.id} />}
          />
          {alreadyPlayed && (
            <Instruction className="info-screen">
              <IconAvatar icon={<ThumbsUpIcon />} />
              <Translate
                pt="Você já jogou hoje!"
                en="You've already played today!"
              />
              <Translate
                pt="Volte amanhã para jogar novamente!"
                en="Come back tomorrow to play again!"
              />
              <Divider />
              <NextGameSuggestion />
            </Instruction>
          )}
        </div>

        {isPlaying && currentPair && (
          <SpaceContainer
            vertical
            key={currentPair.pairId}
          >
            <Region>
              <Typography.Text>
                <Translate
                  pt={`${session.evaluatedCount} pares avaliados`}
                  en={`${session.evaluatedCount} pairs evaluated`}
                />
                {session.evaluatedCount < SETTINGS.MIN_PAIRS && (
                  <>
                    {' '}
                    (
                    <Translate
                      pt={`mínimo ${SETTINGS.MIN_PAIRS}`}
                      en={`minimum ${SETTINGS.MIN_PAIRS}`}
                    />
                    )
                  </>
                )}
              </Typography.Text>
            </Region>

            <RegionText>
              <Translate
                pt="Essas duas imagens estão relacionadas?"
                en="Are these two images related?"
              />
            </RegionText>

            <SwipeableCardPair
              imageId1={currentPair.imageId1}
              imageId2={currentPair.imageId2}
              cardWidth={cardWidth}
              onEvaluate={onEvaluatePair}
            />

            <Region>
              <Space
                size="large"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <AnswerNoButton onClick={() => onEvaluatePair(false)} />

                <AnswerYesButton onClick={() => onEvaluatePair(true)} />
              </Space>
            </Region>

            <RegionHint>
              <Translate
                pt="A semelhança pode ser qualquer coisa: cor, forma, tema, 'pq tem essa coisa aqui que parece um triângulo'. Use seu próprio julgamento!"
                en="The similarity can be anything: color, shape, theme, etc. Use your judgment!"
              />
            </RegionHint>

            {canSave && hasAnyRelationships && (
              <Region>
                <Button
                  size="large"
                  type="default"
                  icon={<SaveFilled />}
                  onClick={onSave}
                  loading={isSaving}
                  block
                >
                  <Translate
                    pt="Salvar e Terminar"
                    en="Save and Finish"
                  />
                </Button>
              </Region>
            )}

            {canComplete && (
              <Region>
                <Button
                  size="large"
                  type="default"
                  onClick={onComplete}
                  block
                >
                  <Translate
                    pt="Cansei, Terminar"
                    en="I'm Done"
                  />
                </Button>
              </Region>
            )}
          </SpaceContainer>
        )}

        {isIdle && !alreadyPlayed && (
          <Region>
            <Instruction contained>
              <Translate
                pt={
                  <>
                    Você recebera pares de imagens para avaliar.
                    <br />
                    Você simplesmente tem que dizer se elas estão relacionadas ou não!
                    <br />
                    Pode ser pela cor, por um objeto em comum, tema parecido, forma, ou qualquer coisa que
                    faça sentido pra você!
                    <br />
                    <br />
                    Clique em Começar para avaliar os pares de imagens!
                  </>
                }
                en={
                  <>
                    You will receive pairs of images to evaluate.
                    <br />
                    You just have to say if they are related or not!
                    <br />
                    It can be by color, by a common object, similar theme, shape, or anything that makes sense
                    to you!
                    <br />
                    <br />
                    Click Begin to start evaluating the image pairs!
                  </>
                }
              />
            </Instruction>
            <Button
              type="primary"
              size="large"
              onClick={onStart}
            >
              <Translate
                pt="Começar"
                en="Begin"
              />
            </Button>
          </Region>
        )}
      </DailyContent>

      <ImageCardPreloadHand hand={preloadHand} />
    </Layout>
  );
}

type SwipeableCardPairProps = {
  imageId1: string;
  imageId2: string;
  cardWidth: number;
  onEvaluate: (isRelated: boolean) => void;
};

function SwipeableCardPair({ imageId1, imageId2, cardWidth, onEvaluate }: SwipeableCardPairProps) {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  // Transform x position to background color (green for right, red for left)
  const backgroundColor = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    ['rgba(255, 77, 79, 0.75)', 'rgba(255, 255, 255, 0)', 'rgba(82, 196, 26, 0.75)'],
  );

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const offset = info.offset.x;

    if (offset > SWIPE_THRESHOLD) {
      // Swipe right = related
      onEvaluate(true);
    } else if (offset < -SWIPE_THRESHOLD) {
      // Swipe left = unrelated
      onEvaluate(false);
    }

    // Reset position
    x.set(0);
  };

  return (
    <motion.div
      key={`${imageId1}-${imageId2}`} // Ensure unique key for animation
      style={{
        backgroundColor,
        borderRadius: '8px',
        padding: '16px',
        x,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      {...getAnimation('fadeIn')}
    >
      <Flex
        gap={16}
        justify="center"
        align="center"
      >
        <ImageCard
          cardId={imageId1}
          cardWidth={cardWidth}
          preview={false}
        />
        <ImageCard
          cardId={imageId2}
          cardWidth={cardWidth}
          preview={false}
        />
      </Flex>

      {isDragging && (
        <motion.div
          style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '14px',
            fontWeight: 500,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {x.get() > 10 ? (
            <span style={{ color: '#52c41a' }}>
              <Translate
                pt="Sim →"
                en="Yes →"
              />
            </span>
          ) : x.get() < -10 ? (
            <span style={{ color: '#ff4d4f' }}>
              <Translate
                pt="← Não"
                en="← No"
              />
            </span>
          ) : (
            <span style={{ color: '#8c8c8c' }}>
              <Translate
                pt="Deslize para avaliar"
                en="Swipe to evaluate"
              />
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
