import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
// Ant Design Resources
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Layout, Modal } from 'antd';
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
import { Region, RegionText } from 'pages/Daily/components/Region';
import { ShowResultsButton } from 'pages/Daily/components/ShowResultsButton';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyPanicoEntry } from '../utils/types';
import { usePanicoEngine } from '../utils/usePanicoEngine';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { Panel } from './Panel';
import { SoundSfxAlert } from './SoundSfxAlert';
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
    farthestButtonIndex,
  } = usePanicoEngine(data, initialState);
  const [, ref] = useCardWidthByContainerRef(5, { margin: 48, gap: 12, maxWidth: 96, minWidth: 55 });
  const queryClient = useQueryClient();

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
      <DailyContent
        ref={ref}
        className="panic-background"
        backgroundVariant="dark"
      >
        <RegionText className="mt-8 panic-invert">
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
          isComplete={isComplete}
          isWin={isWin}
          buttons={buttons}
          onNextButton={onNextButton}
          onStart={onStart}
        />

        <ShowResultsButton
          isComplete={isComplete}
          setShowResultModal={setShowResultModal}
        />

        <SoundSfxAlert />

        <Region className="mt-10">
          <Button
            onClick={() => {
              queryClient.refetchQueries({ queryKey: ['panico-demo'] });
            }}
            icon={<ReloadOutlined />}
            disabled={!isComplete}
          >
            <Translate
              pt="Criar nova sequência"
              en="Generate new sequence"
            />
          </Button>
        </Region>

        <Modal
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          footer={null}
        >
          <ResultsModalContent
            challengeNumber={data.number}
            win={isWin}
            hearts={hearts}
            totalButtons={data.buttons.length}
            farthestButtonIndex={farthestButtonIndex}
          />
        </Modal>
      </DailyContent>
    </Layout>
  );
}
