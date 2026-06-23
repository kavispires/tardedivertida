import { useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
// Ant Design Resources
import { Layout, Button, Divider } from 'antd';
// Types
import type { Me } from 'types/user';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Icons
import { AnimatedProcessingIcon } from '@icons/AnimatedProcessingIcon';
import { ThumbsUpIcon } from '@icons/ThumbsUpIcon';
// Components
import { Card } from '@components/cards/Card';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { TimeHighlight } from '@components/metrics/TimeHighlight';
import { Instruction } from '@components/text/Instruction';
// Pages
import { DailyContent } from '@pages/Daily/components/DailyContent';
import { GameHeader } from '@pages/Daily/components/Header';
import { Menu } from '@pages/Daily/components/Menu';
import { NextGameSuggestion } from '@pages/Daily/components/NextGameSuggestion';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyPicacoEntry } from '../utils/types';
import { usePicacoEngine } from '../utils/usePicacoEngine';
import { Canvas } from './Canvas';
import { Rules } from './Rules';

type DailyPicacoProps = {
  data: DailyPicacoEntry;
  currentUser: Me;
};

export function DailyPicaco({ data, currentUser }: DailyPicacoProps) {
  const [initialState] = useState(getInitialState(data));
  const { cardNumber, card, onNextCard, isPlaying, isIdle, isSaving, alreadyPlayed, onStart } =
    usePicacoEngine(data, currentUser, initialState);

  // UI state
  const [contentRef, contentMeasure] = useMeasure<HTMLDivElement>();
  const [headerRef, headerMeasure] = useMeasure<HTMLDivElement>();
  const maxWidth = useMemo(() => {
    const width = contentMeasure.width - 24;
    const height = contentMeasure.height - headerMeasure.height - 24;
    return Math.max(Math.min(width, height, 500), 150);
  }, [contentMeasure.height, contentMeasure.width, headerMeasure.height]);

  return (
    <Layout>
      <GameHeader
        settings={SETTINGS}
        number={data.number}
      />
      <Menu
        hearts={0}
        total={0}
        openRules
        rules={<Rules date={data.id} />}
      />
      <DailyContent ref={contentRef}>
        <div ref={headerRef}>
          {alreadyPlayed && (
            <Instruction className="info-screen">
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
            </Instruction>
          )}

          {!alreadyPlayed && !isSaving && (
            <SpaceContainer>
              <Card
                key={isPlaying ? card.id : 'none'}
                header={isPlaying ? `#${cardNumber}` : '?'}
                color="gold"
                className={!isPlaying ? 'invisible' : getAnimationClass('tada')}
              >
                {!isPlaying
                  ? 'Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore.'
                  : card.text}
              </Card>
            </SpaceContainer>
          )}
        </div>

        {isPlaying && (
          <SpaceContainer>
            <Canvas
              key={card.id}
              maxWidth={maxWidth}
              onNextCard={onNextCard}
            />
          </SpaceContainer>
        )}

        {isSaving && (
          <Instruction className="info-screen">
            <Icon icon={<AnimatedProcessingIcon />} />
            <Translate
              pt="Salvando"
              en="Saving"
            />
          </Instruction>
        )}

        {isIdle && !alreadyPlayed && (
          <SpaceContainer>
            <SpaceContainer vertical>
              <Instruction contained>
                <Translate
                  pt={
                    <>
                      Você tem <TimeHighlight>{SETTINGS.DURATION / SETTINGS.DRAWINGS}</TimeHighlight> segundos
                      para fazer cada um dos {SETTINGS.DRAWINGS} desenhos.
                      <br />
                      Você <strong>NÃO</strong> pode usar letras ou números.
                      <br />O tempo começa assim que você aperta "Começar".
                    </>
                  }
                  en={
                    <>
                      You have <TimeHighlight>{SETTINGS.DURATION / SETTINGS.DRAWINGS}</TimeHighlight> seconds
                      to draw each of the {SETTINGS.DRAWINGS} drawings.
                      <br />
                      You <strong>CANNOT</strong> use letters or numbers.
                      <br />
                      The time starts as soon as you press "Start".
                    </>
                  }
                />
              </Instruction>
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
            </SpaceContainer>
          </SpaceContainer>
        )}
      </DailyContent>
    </Layout>
  );
}
