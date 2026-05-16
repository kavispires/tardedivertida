import { Fragment, useState } from 'react';
// Ant Design Resources
import { AimOutlined } from '@ant-design/icons';
import { Button, Layout, Modal } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Utils
import { pluralize } from 'utils/helpers';
// Icons
import { LiarIcon, OpposingArrowIcon } from 'icons/collection';
import { TraitorIcon } from 'icons/TraitorIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { Translate } from 'components/language/Translate';
import { TextHighlight } from 'components/text/TextHighlight';
// Pages
import { DailyContent } from 'pages/Daily/components/DailyContent';
import { GameHeader } from 'pages/Daily/components/Header';
import { Menu } from 'pages/Daily/components/Menu';
import { Region, RegionText } from 'pages/Daily/components/Region';
import { ShowResultsButton } from 'pages/Daily/components/ShowResultsButton';
// Internal
import { calculateArrowRotation, calculateEllipsePositions, getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyPirralhosEntry } from '../utils/types';
import { usePirralhosEngine } from '../utils/usePirralhosEngine';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { KidCard } from './KidCard';
import { SolveModal } from './SolveModal';

type DailyPirralhosProps = {
  data: DailyPirralhosEntry;
  currentUser: Me;
};

export function DailyPirralhos({ data }: DailyPirralhosProps) {
  const [initialState] = useState(getInitialState(data));
  const width = useCardWidth(3, { margin: 8, maxWidth: 192, minWidth: 64 });
  const [solveModalOpen, setSolveModalOpen] = useState(false);

  const {
    hearts,
    guesses,
    kids,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    assessments,
    assessKid,
    submitKid,
  } = usePirralhosEngine(data, initialState);

  // Calculate positions for kids in elliptical layout
  const positions = calculateEllipsePositions(kids.length);

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
            <IconAvatar
              icon={<TraitorIcon />}
              size="small"
            />{' '}
            {data.culpritsIds.length} {pluralize(data.culpritsIds.length, 'culpado')}
          </TextHighlight>
          <TextHighlight>
            <IconAvatar
              icon={<LiarIcon />}
              size="small"
            />{' '}
            {data.liarsIds.length} {pluralize(data.liarsIds.length, 'mentiroso')}
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
            culpritsIds={data.culpritsIds}
            liarsIds={data.liarsIds}
            kids={data.kids}
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
            kids={kids}
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
          style={{ marginTop: width / 1.85, minHeight: ([2.5, 3, 4, 4][kids.length - 4] * width) / 0.67 }}
        >
          {kids.map((kid, index) => {
            const position = positions[index];
            const nextPosition = positions[(index + 1) % kids.length]; // Wrap around for closed loop

            // Calculate midpoint for arrow position
            const arrowX = (position.x + nextPosition.x) / 2;
            const arrowY = (position.y + nextPosition.y) / 2;
            const arrowRotation = calculateArrowRotation(position.angle, nextPosition.angle);

            return (
              <Fragment key={kid.id}>
                {/* Kid positioned on ellipse */}
                <div
                  className="kids-container__item-wrapper"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                >
                  <KidCard
                    kid={kid}
                    index={index}
                    width={width}
                    assessKid={assessKid}
                    assessment={assessments[kid.id] ?? null}
                  />
                </div>

                {/* Arrow pointing to next kid */}
                <div
                  className="kids-container__arrow-wrapper"
                  style={{
                    left: `${arrowX}%`,
                    top: `${arrowY}%`,
                    transform: `rotate(${arrowRotation}deg)`,
                    zIndex: 16,
                  }}
                >
                  <IconAvatar
                    icon={<OpposingArrowIcon />}
                    size="small"
                  />
                </div>
              </Fragment>
            );
          })}
        </div>

        {guesses.length > 0 && (
          <RegionText>
            {guesses.map((guess, i) => (
              <div key={i}>{guess.toUpperCase()}</div>
            ))}
          </RegionText>
        )}
      </DailyContent>
    </Layout>
  );
}
