import { Button, Layout, Modal, Rate, Tooltip, Typography } from 'antd';
import clsx from 'clsx';
import { TransparentButton } from 'components/buttons';
import { DualTranslate, Translate } from 'components/language';
import { DailyDiagramGameIcon } from 'icons/DailyDiagramGameIcon';
import { Region, TextRegion } from 'pages/Daily/components/Region';
import { wait } from 'pages/Daily/utils';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeasure } from 'react-use';
import { Me } from 'types/user';
import { getAnimationClass } from 'utils/helpers';

import { BarChartOutlined, CloudSyncOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';

import { Header } from '../../../components/Header';
import { Menu } from '../../../components/Menu';
import { SETTINGS } from '../utils/settings';
import { DailyTeoriaDeConjuntosEntry } from '../utils/types';
import { useTeoriaDeConjuntosEngine } from '../utils/useTeoriaDeConjuntosEngine';
import { Diagram } from './Diagram';
import { InDiagramThings } from './InDiagramThings';
import { PlacementModal } from './PlacementModal';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { Thing } from './Thing';
import { RulesHints } from './RulesHints';

type DailyTeoriaDeConjuntosProps = {
  data: DailyTeoriaDeConjuntosEntry;
  currentUser: Me;
};

export function DailyTeoriaDeConjuntos({ data }: DailyTeoriaDeConjuntosProps) {
  const {
    hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    hand,
    rule1Things,
    rule2Things,
    intersectingThings,
    activeThing,
    activeArea,
    onSelectThing,
    onSelectArea,
    onConfirmPlacement,
    guesses,
  } = useTeoriaDeConjuntosEngine(data);
  const queryClient = useQueryClient();
  const [contentRef, contentMeasure] = useMeasure<HTMLDivElement>();
  const navigate = useNavigate();

  const thingWidth = useMemo(() => {
    const totalWidth = contentMeasure.width / 6 - 16;
    return Math.min(Math.max(totalWidth, 48), 96);
  }, [contentMeasure.width]);

  return (
    <Layout className="app">
      <Header icon={<DailyDiagramGameIcon />}>
        <DualTranslate>{SETTINGS.NAME}</DualTranslate> #D{data.number}
      </Header>
      <Layout.Content ref={contentRef}>
        <Menu hearts={hearts} total={SETTINGS.HEARTS} openRules={true} rules={<Rules />} />

        <Region>
          <Typography.Text strong className="teoria-de-conjuntos-title">
            {data.title}
          </Typography.Text>
          <Tooltip title={<Translate pt="Dificuldade" en="Difficulty" />}>
            <Rate disabled value={data.level} count={data.level} />
          </Tooltip>
        </Region>

        <Region>
          <Diagram
            width={Math.min(contentMeasure.width - 16, 600)}
            leftCircleChildren={
              <TransparentButton onClick={() => onSelectArea(1)} disabled={isComplete}>
                <InDiagramThings things={rule1Things} width={thingWidth} />
              </TransparentButton>
            }
            rightCircleChildren={
              <TransparentButton onClick={() => onSelectArea(2)} disabled={isComplete}>
                <InDiagramThings things={rule2Things} width={thingWidth} />
              </TransparentButton>
            }
            intersectionChildren={
              <TransparentButton onClick={() => onSelectArea(0)} disabled={isComplete}>
                <InDiagramThings things={intersectingThings} width={thingWidth} />
              </TransparentButton>
            }
          />
        </Region>

        {isComplete ? (
          <TextRegion>
            <Translate pt="Você já completou o desafio!" en="You have already completed the challenge!" />
          </TextRegion>
        ) : (
          <TextRegion>
            <Translate
              pt="Selecione uma coisa e coloque na área correta:"
              en="Select a thing and place it in the correct area:"
            />
          </TextRegion>
        )}

        {isComplete && (
          <Region>
            <Button onClick={() => setShowResultModal(true)} type="primary" icon={<BarChartOutlined />}>
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>

            <Button
              onClick={async () => {
                navigate(`/diario/teoria-de-conjuntos`);
                await wait(250);
                queryClient.refetchQueries({
                  queryKey: ['teoria-de-conjuntos-demo'],
                });
              }}
              icon={<CloudSyncOutlined />}
            >
              <Translate pt="Jogar outro demo" en="Play another demo" />
            </Button>
          </Region>
        )}

        <Region className="space-center" direction="horizontal">
          {hand.map((thing) => (
            <TransparentButton
              key={thing.id}
              className={clsx('thing-button', getAnimationClass('heartBeat'))}
              activeClass="thing-button__active"
              onClick={() => onSelectThing(thing)}
              active={thing.id === activeThing?.id}
              disabled={isComplete}
            >
              <Thing itemId={thing.id} name={thing.name} width={thingWidth} />
            </TransparentButton>
          ))}
        </Region>

        <RulesHints />

        {activeThing && activeArea !== null && (
          <PlacementModal
            activeThing={activeThing}
            activeArea={activeArea}
            onSelectArea={onSelectArea}
            onConfirmPlacement={onConfirmPlacement}
            rule1Things={rule1Things}
            rule2Things={rule2Things}
            intersectingThings={intersectingThings}
          />
        )}

        <Modal
          title={<Translate pt="Resultado" en="Results" />}
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
        >
          <ResultsModalContent
            challenge={data?.number}
            isWin={isWin}
            hearts={hearts}
            guesses={guesses}
            title={data.title}
            data={data}
          />
        </Modal>
      </Layout.Content>
    </Layout>
  );
}