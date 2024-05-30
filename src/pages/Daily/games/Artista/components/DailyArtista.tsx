import { Button, Divider, Layout, Space } from 'antd';
import { IconAvatar } from 'components/avatars';
import { Card } from 'components/cards';
import { DualTranslate, Translate } from 'components/language';
import { Instruction } from 'components/text';
import { AnimatedProcessingIcon } from 'icons/AnimatedProcessingIcon';
import { DailyDrawingGameIcon } from 'icons/DailyDrawingGameIcon';
import { ThumbsUpIcon } from 'icons/ThumbsUpIcon';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMeasure } from 'react-use';
import { Me } from 'types/user';
import { getAnimationClass } from 'utils/helpers';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { SETTINGS } from '../utils/settings';
import { DailyArtistaEntry } from '../utils/types';
import { useArtistaEngine } from '../utils/useArtistaEngine';
import { Canvas } from './Canvas';
import { Rules } from './Rules';
import { TimeHighlight } from 'components/metrics/TimeHighlight';

type DailyArtistaProps = {
  data: DailyArtistaEntry;
  currentUser: Me;
};

export function DailyArtista({ data, currentUser }: DailyArtistaProps) {
  const { cardNumber, card, onNextCard, isPlaying, isIdle, isSaving, alreadyPlayed, onStart } =
    useArtistaEngine(data, currentUser);

  // UI state
  const [contentRef, contentMeasure] = useMeasure<HTMLDivElement>();
  const [headerRef, headerMeasure] = useMeasure<HTMLDivElement>();
  const maxWidth = useMemo(() => {
    const width = contentMeasure.width - 24;
    const height = contentMeasure.height - headerMeasure.height - 24;
    return Math.max(Math.min(width, height, 500), 150);
  }, [contentMeasure.height, contentMeasure.width, headerMeasure.height]);

  return (
    <Layout className="app">
      <Header icon={<DailyDrawingGameIcon />}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content ref={contentRef}>
        <div ref={headerRef}>
          <Menu hearts={0} total={0} openRules rules={<Rules />} />
          {alreadyPlayed && (
            <Instruction className="info-screen">
              <IconAvatar icon={<ThumbsUpIcon />} />
              <Translate pt="Você já jogou hoje!" en="You've already played today!" />
              <Translate pt="Volte amanhã para jogar novamente!" en="Come back tomorrow to play again!" />
              <Divider />
              <Link to="/diario">
                <Translate pt="Jogar outros jogos" en="Play something else" />
              </Link>
            </Instruction>
          )}

          {!alreadyPlayed && !isSaving && (
            <Space className="space-container">
              <Card
                key={isPlaying ? card.id : 'none'}
                header={isPlaying ? `#${cardNumber}` : '?'}
                color="gold"
                className={!isPlaying ? 'invisible' : getAnimationClass('tada')}
              >
                {!isPlaying ? (
                  <>
                    Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut
                    labore et dolore.
                  </>
                ) : (
                  card.text
                )}
              </Card>
            </Space>
          )}
        </div>

        {isPlaying && (
          <Space className="space-container">
            <Canvas key={card.id} maxWidth={maxWidth} onNextCard={onNextCard} />
          </Space>
        )}

        {isSaving && (
          <Instruction className="info-screen">
            <IconAvatar icon={<AnimatedProcessingIcon />} />
            <Translate pt="Salvando" en="Saving" />
          </Instruction>
        )}

        {isIdle && !alreadyPlayed && (
          <Space className="space-container">
            <Space direction="vertical" className="space-container">
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
              <Button type="primary" size="large" onClick={onStart} disabled={alreadyPlayed}>
                {isSaving ? <Translate pt="Salvando" en="Saving" /> : <Translate pt="Começar" en="Start" />}
              </Button>
            </Space>
          </Space>
        )}
      </Layout.Content>
    </Layout>
  );
}
