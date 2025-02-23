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

export function DailyTaNaCara({ data }: DailyTaNaCaraProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    questionIndex,
    totalQuestions,
    questionNumber,
    question,
    answer,
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
  } = useTaNaCaraEngine(data, initialState);

  const [width, ref] = useCardWidthByContainerRef(3, { margin: 24, gap: 12, maxWidth: 300, minWidth: 55 });

  return (
    <Layout className="app">
      <Header icon={<DailyDrawingGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content ref={ref}>
        <ImageCardPreloadHand hand={data?.testimonies?.[questionNumber]?.suspectsIds ?? []} />
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
            <Flex gap={8}>
              {question.suspectsIds.map((suspectId) => (
                <Flex key={suspectId} vertical>
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
                </Flex>
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

            {questionIndex === totalQuestions - 1 && (
              <Button
                className="mt-10"
                icon={<SaveFilled />}
                loading={isSaving}
                onClick={onComplete}
                type="primary"
              >
                <Translate pt="Cansei / Salvar" en="I'm done / save" />
              </Button>
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
