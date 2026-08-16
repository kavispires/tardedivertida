import { Fragment, useMemo, useState } from 'react';
// Ant Design Resources
import { AimOutlined } from '@ant-design/icons';
import { Button, Layout, Modal } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidth } from '@hooks/useCardWidth';
// Utils
import { pluralize } from '@utils/helpers';
// Icons
import { LiarIcon } from '@icons/LiarIcon';
import { OpposingArrowIcon } from '@icons/OpposingArrowIcon';
import { TraitorIcon } from '@icons/TraitorIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { TextHighlight } from '@components/text/TextHighlight';
// Pages
import { DailyContent } from '@pages/Daily/components/DailyContent';
import { GameHeader } from '@pages/Daily/components/Header';
import { Menu } from '@pages/Daily/components/Menu';
import { Region, RegionHint, RegionText } from '@pages/Daily/components/Region';
import { ShowResultsButton } from '@pages/Daily/components/ShowResultsButton';
// Internal
import { calculateEllipsePositions, getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyPirralhosEntry } from '../utils/types';
import { usePirralhosEngine } from '../utils/usePirralhosEngine';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { assessmentIconMap, KidCard } from './KidCard';
import { SolveModal } from './SolveModal';

type DailyPirralhosProps = {
  data: DailyPirralhosEntry;
  currentUser: Me;
};

export function DailyPirralhos({ data }: DailyPirralhosProps) {
  const [initialState] = useState(getInitialState(data));
  const width = useCardWidth(3, { margin: 8, maxWidth: 160, minWidth: 64 });
  const [solveModalOpen, setSolveModalOpen] = useState(false);

  const {
    hearts,
    guesses,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    assessments,
    assessKid,
    resetAssessments,
    submitKid,
  } = usePirralhosEngine(data, initialState);

  // Calculate positions for kids in elliptical layout

  const positions = calculateEllipsePositions(data.kids.length);

  const liarsCount = useMemo(() => {
    if (data.possibleLiars === data.liarsIds.length) {
      return data.liarsIds.length;
    }
    if (data.possibleLiars > data.liarsIds.length) {
      return `${data.liarsIds.length}-${data.possibleLiars}`;
    }
    if (data.possibleLiars < data.liarsIds.length) {
      return `${data.possibleLiars}-${data.liarsIds.length}`;
    }
    return data.liarsIds.length;
  }, [data.liarsIds, data.possibleLiars]);

  return (
    <Layout>
      <GameHeader
        settings={SETTINGS}
        number={data.number}
      />
      <Menu
        hearts={hearts}
        total={SETTINGS.HEARTS}
        openRules={!isComplete || hearts === SETTINGS.HEARTS}
        rules={<Rules date={data.id} />}
      />
      <DailyContent>
        <RegionText>
          <Translate
            pt="Quem pegou o brinquedo?"
            en="Who stole the toy?"
          />
        </RegionText>

        <RegionText>
          <TextHighlight>
            <Icon
              icon={<TraitorIcon />}
              size="small"
            />{' '}
            1{' '}
            <Translate
              pt="Culpado"
              en="Culprit"
            />
          </TextHighlight>
          <TextHighlight>
            <Icon
              icon={<LiarIcon />}
              size="small"
            />{' '}
            {liarsCount}{' '}
            <Translate
              pt={pluralize(data.liarsIds.length || data.possibleLiars, 'Mentiroso')}
              en={pluralize(data.liarsIds.length || data.possibleLiars, 'Liar')}
            />
          </TextHighlight>
        </RegionText>

        <ShowResultsButton
          isComplete={isComplete}
          setShowResultModal={setShowResultModal}
        />

        <Modal
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          footer={null}
        >
          <ResultsModalContent
            challengeNumber={data.number}
            win={isWin}
            hearts={hearts}
            culpritId={data.culpritId}
            liarsIds={data.liarsIds}
            kidsEntries={data.kids}
          />
        </Modal>

        <Modal
          open={solveModalOpen}
          onCancel={() => setSolveModalOpen(false)}
          footer={null}
          title={
            <Translate
              pt="Quem pegou o brinquedo?"
              en="Who stole the toy?"
            />
          }
        >
          <SolveModal
            kidsEntries={data.kids}
            guesses={guesses}
            assessments={assessments}
            onResolve={(kidId) => {
              submitKid(kidId);
              setSolveModalOpen(false);
            }}
          />
        </Modal>

        {!isComplete && (
          <Region>
            <Button
              icon={<AimOutlined />}
              onClick={() => setSolveModalOpen(true)}
            >
              <Translate
                pt="Resolver"
                en="Solve"
              />
            </Button>
          </Region>
        )}

        <div
          className="kids-container"
          style={{
            marginTop: width / 1.85,
            height:
              (width / 0.67) *
              (data.kids.length / 2 + [0, 0, 0, 0, 0.5, 0.5, 0.5, 0.4, 0.7, 0.7, 0.5][data.kids.length]),
          }}
        >
          {data.kids.map((entry, index) => {
            const position = positions[index];
            const nextPosition = positions[(index + 1) % data.kids.length]; // Wrap around for closed loop

            // Calculate midpoint for arrow position
            const arrowX = (position.x + nextPosition.x) / 2;
            const arrowY = (position.y + nextPosition.y) / 2;

            return (
              <Fragment key={`kid-${entry.kidId}-${index}`}>
                {/* Kid positioned on ellipse */}

                <div
                  className="kids-container__item-wrapper"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                >
                  <KidCard
                    kidEntry={entry}
                    index={index}
                    width={width}
                    assessKid={assessKid}
                    assessment={assessments[entry.kidId] ?? null}
                    triggerResolveModal={!isComplete ? () => setSolveModalOpen(true) : undefined}
                  />
                </div>

                {/* Arrow pointing to next kid */}
                <div
                  className="kids-container__arrow-wrapper"
                  style={{
                    left: `${arrowX}%`,
                    top: `${arrowY}%`,
                    transform: `rotate(${position.angle}deg)`,
                    zIndex: 16,
                  }}
                >
                  <Icon
                    icon={<OpposingArrowIcon />}
                    size="small"
                  />
                </div>
              </Fragment>
            );
          })}
        </div>

        <RegionHint className="pirralhos-hint">
          <Translate
            en="You can click the {unknownIcon} button on each kid to mark them as culprit {culpritIcon}, liar {liarIcon} or innocent {innocentIcon}."
            pt="Você pode clicar no botão {unknownIcon} em cada criança pra marcá-las como culpada {culpritIcon}, mentirosa {liarIcon} ou inocente {innocentIcon}."
            values={{
              unknownIcon: (
                <Icon
                  icon={assessmentIconMap.unknown}
                  size="small"
                />
              ),
              culpritIcon: (
                <Icon
                  icon={assessmentIconMap.culprit}
                  size="small"
                />
              ),
              liarIcon: (
                <Icon
                  icon={assessmentIconMap.liar}
                  size="small"
                />
              ),
              innocentIcon: (
                <Icon
                  icon={assessmentIconMap.innocent}
                  size="small"
                />
              ),
            }}
          />
          <Button
            className="ml-2"
            size="small"
            shape="round"
            variant="outlined"
            color="volcano"
            onClick={resetAssessments}
          >
            <Translate
              en="Reset all"
              pt="Limpar tudo"
            />
          </Button>
        </RegionHint>
      </DailyContent>
    </Layout>
  );
}
