import { useState } from 'react';
// Ant Design Resources
import { Layout, Modal } from 'antd';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
// Components
import { Translate } from 'components/language/Translate';
// Pages
import { DailyContent } from 'pages/Daily/components/DailyContent';
import { GameHeader } from 'pages/Daily/components/Header';
import { Menu } from 'pages/Daily/components/Menu';
import { RegionText } from 'pages/Daily/components/Region';
import { ShowResultsButton } from 'pages/Daily/components/ShowResultsButton';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyPanicoEntry } from '../utils/types';
import { usePanicoEngine } from '../utils/usePanicoEngine';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { Panel } from './Panel';
// Sass
import '../utils/styles.scss';

type DailyPanicoProps = {
  data: DailyPanicoEntry;
  currentUser: Me;
};

export function DailyPanico({ data }: DailyPanicoProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    onNextButton,
    onStart,
    activeButtonIndex,
    sessionStatus,
    buttons,
  } = usePanicoEngine(data, initialState);
  const [, ref] = useCardWidthByContainerRef(5, { margin: 48, gap: 12, maxWidth: 96, minWidth: 55 });

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
      <DailyContent ref={ref}>
        <RegionText>
          <Translate
            en={
              <>
                Follow the instructions to when and how to press the button.
                <br />
                Press 'Start' to begin and good luck!
              </>
            }
            pt={
              <>
                Siga as instruções de quando e como apertar o botão.
                <br />
                Aperte 'Iniciar' para começar e boa sorte!
              </>
            }
          />
        </RegionText>

        <Panel
          activeButtonIndex={activeButtonIndex}
          sessionStatus={sessionStatus}
          buttons={buttons}
          onNextButton={onNextButton}
          onStart={onStart}
        />

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
            totalButtons={0} // TODO
            farthestButtonIndex={0} // TODO
          />
        </Modal>
      </DailyContent>
    </Layout>
  );
}
