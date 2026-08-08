import { motion } from 'motion/react';
import { useState } from 'react';
// Ant Design Resources
import { DoubleLeftOutlined, DoubleRightOutlined, SaveFilled } from '@ant-design/icons';
import { Alert, Badge, Button, Divider, Flex, Layout, Segmented, Space, Switch, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { useLanguage } from '@hooks/useLanguage';
// Utils
import { getAnimation } from '@utils/animations';
// Icons
import { AnimatedProcessingIcon } from '@icons/AnimatedProcessingIcon';
import { ThumbsUpIcon } from '@icons/ThumbsUpIcon';
// Components
import { TripleStateButton } from '@components/buttons/TripleStateButton';
import { SuspectCard } from '@components/cards/SuspectCard';
import { TextCard } from '@components/cards/TextCard';
import { Icon } from '@components/general/Icon';
import { ImageCardPreloadHand } from '@components/image-cards/ImageCardPreloadHand';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
// Pages
import { DailyContent } from '@pages/Daily/components/DailyContent';
import { GameHeader } from '@pages/Daily/components/Header';
import { Menu } from '@pages/Daily/components/Menu';
import { NextGameSuggestion } from '@pages/Daily/components/NextGameSuggestion';
import { Region, RegionText } from '@pages/Daily/components/Region';
import { StepDots } from '@pages/Daily/components/StepDots';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyTaNaCaraEntry } from '../utils/types';
import { useTaNaCaraEngine } from '../utils/useTaNaCaraEngine';
import { Rules } from './Rules';

type DailyTaNaCaraProps = {
  data: DailyTaNaCaraEntry;
  currentUser: Me;
};

const MotionFlex = motion.create(Flex);

export function DailyTaNaCara({ data }: DailyTaNaCaraProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    questionIndex,
    totalQuestions,
    question,
    currentAnswers,
    suspects,
    onToggleAllowNSFW,
    onNext,
    onPrevious,
    onComplete,
    onStart,
    isPlaying,
    isIdle,
    isSaving,
    alreadyPlayed,
    onUpdateAnswer,
    mode,
    allSuspects,
    onChangeVariant,
    variant,
  } = useTaNaCaraEngine(data, initialState);

  const [width, ref] = useCardWidthByContainerRef(3, { margin: 24, gap: 12, maxWidth: 256, minWidth: 55 });
  const { translate } = useLanguage();

  const answerMinimumRequiredForTestimony =
    Object.values(currentAnswers.answers).filter((value) => value !== null).length > 3;

  return (
    <Layout>
      <GameHeader
        settings={SETTINGS}
        number={data.number}
      />
      <DailyContent ref={ref}>
        <ImageCardPreloadHand hand={allSuspects} />
        <div>
          <Menu
            hearts={0}
            total={0}
            openRules
            rules={<Rules date={data.id} />}
          />
          {alreadyPlayed && (
            <Surface className="info-screen">
              <Icon icon={<ThumbsUpIcon />} />
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
            </Surface>
          )}
        </div>
        {isPlaying && question && (
          <SpaceContainer
            vertical
            key={question.testimonyId}
          >
            <StepDots
              current={questionIndex}
              total={totalQuestions}
            />
            <TextCard
              header={
                question.nsfw ? translate({ pt: 'Conteúdo Sensível', en: 'Sensitive Content' }) : undefined
              }
              color="#ff69b4"
            >
              {question.question}
            </TextCard>
            <Flex
              gap={8}
              wrap="wrap"
              justify="center"
            >
              {suspects.map((suspectId, index) => (
                <MotionFlex
                  key={`q${questionIndex}-${suspectId}`}
                  vertical
                  {...getAnimation('flipInY', { delay: 0.1 * index })}
                  align="center"
                  justify="center"
                  gap={6}
                >
                  <Badge.Ribbon
                    text={data?.names?.[suspectId] ?? null}
                    color="orange"
                  >
                    <SuspectCard
                      suspect={{
                        id: suspectId,
                        name: {
                          en: '',
                          pt: '',
                        },
                        gender: '',
                        race: '',
                        age: '',
                        build: '',
                        height: '',
                        features: [],
                        deck: '',
                        persona: {
                          en: '',
                          pt: '',
                        },
                      }}
                      variant={variant}
                      width={width}
                    />
                  </Badge.Ribbon>

                  <TripleStateButton
                    size="small"
                    value={currentAnswers.answers[suspectId] ?? null}
                    onChange={(checked) => onUpdateAnswer(suspectId, checked)}
                  />
                </MotionFlex>
              ))}
            </Flex>

            {!answerMinimumRequiredForTestimony && (
              <Alert
                className="mx-4 mt-2"
                showIcon
                title={
                  <Translate
                    en="You must evaluate at least 4 people to proceed."
                    pt="Você deve avaliar pelo menos 4 pessoas para prosseguir."
                  />
                }
                type="warning"
              />
            )}

            <Space.Compact className="mt-4">
              <Button
                shape="round"
                onClick={onPrevious}
                icon={<DoubleLeftOutlined />}
                disabled={questionIndex === 0}
              >
                <Translate
                  pt="Anterior"
                  en="Previous"
                />
              </Button>
              <Button
                shape="round"
                onClick={onNext}
                icon={<DoubleRightOutlined />}
                iconPlacement="end"
                disabled={questionIndex === totalQuestions - 1 || !answerMinimumRequiredForTestimony}
              >
                <Translate
                  pt="Próximo"
                  en="Next"
                />
              </Button>
            </Space.Compact>

            {(questionIndex > 4 || questionIndex === totalQuestions - 1) && (
              <>
                {questionIndex !== totalQuestions - 1 && (
                  <Surface contained>
                    <Translate
                      pt="Você já respondeu ao mínimo de perguntas suficientes, se quiser parar, aperte salvar."
                      en="You've already answered the minimum amount of questions, if you want to stop, press save."
                    />
                  </Surface>
                )}

                <Button
                  className="mb-10 mt-4"
                  icon={<SaveFilled />}
                  loading={isSaving}
                  onClick={onComplete}
                  type="primary"
                  size="large"
                >
                  {questionIndex === totalQuestions - 1 ? (
                    <Translate
                      pt="Salvar e terminar"
                      en="Save and finish"
                    />
                  ) : (
                    <Translate
                      pt="Cansei / Salvar"
                      en="I'm done / save"
                    />
                  )}
                </Button>
              </>
            )}
          </SpaceContainer>
        )}
        {isSaving && (
          <Surface className="info-screen">
            <Icon icon={<AnimatedProcessingIcon />} />
            <Translate
              pt="Salvando"
              en="Saving"
            />
          </Surface>
        )}
        {isIdle && !alreadyPlayed && (
          <>
            <RegionText>
              <Translate
                pt={
                  <>
                    Avalie se cada personagem se encaixa ou não na pergunta.
                    <br />
                    Se você estiver em dúvida, deixe em branco.
                    <br />
                    Considere talvez, como "sim".
                  </>
                }
                en={
                  <>
                    Select all characters that you think fit the question.
                    <br />
                    If none fits, select "None".
                    <br />
                    Consider maybe, as "yes".
                  </>
                }
              />
            </RegionText>

            <Region>
              <Switch
                checkedChildren="Incluir conteúdo sensível"
                unCheckedChildren="Não incluir conteúdo sensível"
                onChange={onToggleAllowNSFW}
                className="my-4"
                value={mode === 'nsfw'}
              />

              <Button
                type="primary"
                size="large"
                onClick={onStart}
                disabled={alreadyPlayed}
              >
                {isSaving ? (
                  <Translate
                    pt="Salvando"
                    en="Saving"
                  />
                ) : (
                  <Translate
                    pt="Começar"
                    en="Start"
                  />
                )}
              </Button>
            </Region>
          </>
        )}

        {!alreadyPlayed && (
          <Region className="my-12">
            <Typography.Text strong>
              <Translate
                pt="Experimente em outros estilos:"
                en="Try in other styles:"
              />
            </Typography.Text>

            <Segmented<string>
              value={variant.toUpperCase()}
              options={['GB', 'RL', 'PX', 'FX']}
              onChange={(value) => onChangeVariant(value.toLowerCase())}
              size="small"
            />
          </Region>
        )}
      </DailyContent>
    </Layout>
  );
}
