import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { useMeasure } from 'react-use';
// Ant Design Resources
import { Layout, Modal, Rate, Tooltip, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Icons
import { DailyDiagramGameIcon } from 'icons/DailyDiagramGameIcon';
// Components
import { TransparentButton } from 'components/buttons';
import { DualTranslate, Translate } from 'components/language';
// Pages
import { DailyContent } from 'pages/Daily/components/DailyContent';
import { Header } from 'pages/Daily/components/Header';
import { Menu } from 'pages/Daily/components/Menu';
import { Region, RegionText } from 'pages/Daily/components/Region';
import { ShowResultsButton } from 'pages/Daily/components/ShowResultsButton';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyTeoriaDeConjuntosEntry } from '../utils/types';
import { useTeoriaDeConjuntosEngine } from '../utils/useTeoriaDeConjuntosEngine';
import { Diagram } from './Diagram';
import { InDiagramThings } from './InDiagramThings';
import { PlacementModal } from './PlacementModal';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { RulesHints } from './RulesHints';
import { Thing } from './Thing';

type DailyTeoriaDeConjuntosProps = {
  data: DailyTeoriaDeConjuntosEntry;
  currentUser: Me;
};

export function DailyTeoriaDeConjuntos({ data }: DailyTeoriaDeConjuntosProps) {
  const [initialState] = useState(getInitialState(data));
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
    isWeekend,
  } = useTeoriaDeConjuntosEngine(data, initialState);

  const [contentRef, contentMeasure] = useMeasure<HTMLDivElement>();

  const thingWidth = useMemo(() => {
    const totalWidth = contentMeasure.width / 6 - 16;
    return Math.min(Math.max(totalWidth, 48), 96);
  }, [contentMeasure.width]);

  return (
    <Layout className="app">
      <Header
        icon={<DailyDiagramGameIcon />}
        localStorageKey={SETTINGS.KEY}
      >
        <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <DailyContent ref={contentRef}>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS + (isWeekend ? 1 : 0)}
          openRules={true}
          rules={<Rules date={data.id} />}
        />

        <Region>
          <Typography.Text
            strong
            className="teoria-de-conjuntos-title"
          >
            {data.title}
          </Typography.Text>
          <Tooltip
            title={
              <Translate
                pt="Dificuldade"
                en="Difficulty"
              />
            }
          >
            <Rate
              disabled
              value={data.level}
              count={data.level}
            />
          </Tooltip>
        </Region>

        <Region>
          <Diagram
            width={Math.min(contentMeasure.width - 16, 600)}
            leftCircleChildren={
              isComplete ? (
                <InDiagramThings
                  things={rule1Things}
                  width={thingWidth}
                />
              ) : (
                <TransparentButton
                  onClick={() => onSelectArea(1)}
                  disabled={isComplete}
                  hoverType="none"
                >
                  <InDiagramThings
                    things={rule1Things}
                    width={thingWidth}
                  />
                </TransparentButton>
              )
            }
            rightCircleChildren={
              isComplete ? (
                <InDiagramThings
                  things={rule2Things}
                  width={thingWidth}
                />
              ) : (
                <TransparentButton
                  onClick={() => onSelectArea(2)}
                  disabled={isComplete}
                  hoverType="none"
                >
                  <InDiagramThings
                    things={rule2Things}
                    width={thingWidth}
                  />
                </TransparentButton>
              )
            }
            intersectionChildren={
              isComplete ? (
                <InDiagramThings
                  things={intersectingThings}
                  width={thingWidth}
                />
              ) : (
                <TransparentButton
                  onClick={() => onSelectArea(0)}
                  disabled={isComplete}
                  hoverType="none"
                >
                  <InDiagramThings
                    things={intersectingThings}
                    width={thingWidth}
                  />
                </TransparentButton>
              )
            }
          />
        </Region>

        {isComplete ? (
          <RegionText>
            <Translate
              pt="Você já completou o desafio!"
              en="You have already completed the challenge!"
            />
          </RegionText>
        ) : (
          <RegionText>
            <Translate
              pt="Selecione uma coisa e coloque na área correta:"
              en="Select a thing and place it in the correct area:"
            />
          </RegionText>
        )}

        <ShowResultsButton
          isComplete={isComplete}
          setShowResultModal={setShowResultModal}
        />

        <Region
          className="space-center"
          orientation="horizontal"
          wrap
        >
          {hand.map((thing) => (
            <TransparentButton
              key={thing.id}
              className={clsx('thing-button', getAnimationClass('heartBeat'))}
              activeClass="thing-button__active"
              onClick={() => onSelectThing(thing)}
              active={thing.id === activeThing?.id}
              disabled={isComplete}
              hoverType="none"
            >
              <Thing
                itemId={thing.id}
                name={thing.name}
                width={thingWidth}
              />
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
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          footer={null}
        >
          <ResultsModalContent
            challengeNumber={data?.number}
            isWin={isWin}
            hearts={hearts}
            guesses={guesses}
            data={data}
            isWeekend={isWeekend}
          />
        </Modal>
      </DailyContent>
    </Layout>
  );
}
