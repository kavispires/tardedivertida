import { motion } from 'framer-motion';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { Region } from 'pages/Daily/components/Region';
import { StepDots } from 'pages/Daily/components/StepDots';
import { useState } from 'react';
// Ant Design Resources
import {
  DislikeFilled,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LikeFilled,
  SaveFilled,
} from '@ant-design/icons';
import { Button, Divider, Flex, Layout, Space, Switch } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
// Utils
import { getAnimation } from 'utils/animations';
// Icons
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
import { DailyDrawingGameIcon } from 'icons/DailyDrawingGameIcon';
import { ThumbsUpIcon } from 'icons/ThumbsUpIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Card } from 'components/cards';
import { SuspectCard } from 'components/cards/SuspectCard';
import { ImageCardPreloadHand } from 'components/image-cards';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Instruction } from 'components/text';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyTaNaCaraEntry } from '../utils/types';
import { useTaNaCaraEngine } from '../utils/useTaNaCaraEngine';
import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { Rules } from './Rules';

type DailyTaNaCaraProps = {
  data: DailyTaNaCaraEntry;
  currentUser: Me;
};

const MotionFlex = motion(Flex);

export function DailyTaNaCara({ data }: DailyTaNaCaraProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    questionIndex,
    totalQuestions,
    question,
    answer,
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
  } = useTaNaCaraEngine(data, initialState);

  const [width, ref] = useCardWidthByContainerRef(3, { margin: 24, gap: 12, maxWidth: 300, minWidth: 55 });

  return (
    <Layout className="app">
      <Header icon={<DailyDrawingGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content ref={ref}>
        <ImageCardPreloadHand hand={data?.suspectsIds ?? []} />
        <div>
          <Menu hearts={0} total={0} openRules rules={<Rules />} />
          {alreadyPlayed && (
            <Instruction className="info-screen">
              <IconAvatar icon={<ThumbsUpIcon />} />
              <Translate pt="Você já jogou hoje!" en="You've already played today!" />
              <Translate pt="Volte amanhã para jogar novamente!" en="Come back tomorrow to play again!" />
              <Divider />
              <NextGameSuggestion />
            </Instruction>
          )}
        </div>

        {isPlaying && question && (
          <SpaceContainer vertical>
            <StepDots current={questionIndex} total={totalQuestions} />
            <Card hideHeader>{question.question}</Card>
            <Flex gap={8} wrap="wrap" justify="center">
              {suspects.map((suspectId, index) => (
                <MotionFlex
                  key={`${questionIndex}-${suspectId}`}
                  vertical
                  {...getAnimation('flipInY', { delay: 0.1 * index })}
                >
                  <SuspectCard
                    suspect={{
                      id: suspectId,
                      name: {
                        en: '',
                        pt: '',
                      },
                      gender: '',
                      ethnicity: '',
                      age: '',
                      build: '',
                      height: '',
                    }}
                    width={width}
                  />
                  <Switch
                    loading={isSaving}
                    checked={answer.related.includes(suspectId)}
                    onChange={(checked) => onUpdateAnswer(suspectId, checked)}
                    unCheckedChildren={
                      <>
                        <DislikeFilled /> <Translate pt="Não" en="No" />
                      </>
                    }
                    checkedChildren={
                      <>
                        <LikeFilled /> <Translate pt="Sim" en="Yes" />
                      </>
                    }
                  />
                </MotionFlex>
              ))}
            </Flex>

            <Space.Compact className="mt-10">
              <Button
                shape="round"
                onClick={onPrevious}
                icon={<DoubleLeftOutlined />}
                iconPosition="start"
                disabled={questionIndex === 0}
              >
                <Translate pt="Anterior" en="Previous" />
              </Button>
              <Button
                shape="round"
                onClick={onNext}
                icon={<DoubleRightOutlined />}
                iconPosition="end"
                disabled={questionIndex === totalQuestions - 1}
              >
                <Translate pt="Próximo" en="Next" />
              </Button>
            </Space.Compact>

            {(questionIndex > 4 || questionIndex === totalQuestions - 1) && (
              <>
                {questionIndex !== totalQuestions - 1 && (
                  <Instruction contained>
                    <Translate
                      pt="Você já respondeu ao mínimo de perguntas suficientes, se quiser parar, aperte salvar."
                      en="You've already answered the minimum amount of questions, if you want to stop, press save."
                    />
                  </Instruction>
                )}

                <Button
                  className={questionIndex !== totalQuestions - 1 ? 'mb-10' : 'my-10'}
                  icon={<SaveFilled />}
                  loading={isSaving}
                  onClick={onComplete}
                  type="primary"
                  size="large"
                >
                  <Translate pt="Cansei / Salvar" en="I'm done / save" />
                </Button>
              </>
            )}
          </SpaceContainer>
        )}

        {isSaving && (
          <Instruction className="info-screen">
            <IconAvatar icon={<AnimatedProcessingIcon />} />
            <Translate pt="Salvando" en="Saving" />
          </Instruction>
        )}

        {isIdle && !alreadyPlayed && (
          <Region>
            <Instruction contained>
              <Translate
                pt={
                  <>
                    Selecione todos os personagem que você acha que se encaixam na pergunta.
                    <br />
                    Se nenhum se encaixar, só não selecionar ninguém.
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
            </Instruction>

            <Switch
              checkedChildren="Incluir conteúdo sensível"
              unCheckedChildren="Não incluir conteúdo sensível"
              onChange={onToggleAllowNSFW}
              className="my-4"
              value={mode === 'nsfw'}
            />

            <Button type="primary" size="large" onClick={onStart} disabled={alreadyPlayed}>
              {isSaving ? <Translate pt="Salvando" en="Saving" /> : <Translate pt="Começar" en="Start" />}
            </Button>
          </Region>
        )}
      </Layout.Content>
    </Layout>
  );
}
