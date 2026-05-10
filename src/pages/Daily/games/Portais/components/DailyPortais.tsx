import { useMemo, useState } from 'react';
// Ant Design Resources
import { SendOutlined } from '@ant-design/icons';
import { Button, Flex, Layout, Modal, Typography } from 'antd';
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
import type { DailyPortaisEntry } from '../utils/types';
import { usePortaisEngine } from '../utils/usePortaisEngine';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';
import { Passcode } from './Passcode';
import { Corridor } from './Corridor';

type DailyPortaisProps = {
  data: DailyPortaisEntry;
  currentUser: Me;
};

export function DailyPortais({ data }: DailyPortaisProps) {
  const [initialState] = useState(getInitialState(data));
  const {
    hearts,
    showResultModal,
    setShowResultModal,
    isWin,
    isLose,
    isComplete,
    currentCorridorIndex,
    currentCorridorIndexes,
    currentCorridor,
    guesses,
    moves,
    onSlideWordPosition,
    onSubmitPasscode,
  } = usePortaisEngine(data, initialState);
  const [width, ref] = useCardWidthByContainerRef(3, { margin: 24, gap: 12, maxWidth: 250, minWidth: 55 });

  const latestGuess = guesses[currentCorridorIndex][guesses[currentCorridorIndex].length - 1];

  // biome-ignore lint/correctness/useExhaustiveDependencies: word length is not a dependency
  const currentGuess = useMemo(() => {
    // TODO: Adding the ? in line 61 solved the problem but I don't know why.
    const wordsLength = data.corridors[currentCorridorIndex].words[0].length;

    return currentCorridorIndexes
      .map((pos, index) => data.corridors[currentCorridorIndex].words[index]?.[wordsLength - 1 - pos])
      .join('');
  }, [currentCorridorIndex, currentCorridorIndexes]);

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
        {currentCorridor && !isComplete && (
          <>
            <Region key={`doors-${currentCorridor?.passcode}`}>
              <Corridor
                number={currentCorridorIndex + 1}
                imagesIds={currentCorridor.imagesIds}
                width={width}
                moves={moves[currentCorridorIndex]}
              />
            </Region>

            <RegionText>
              <Translate
                en="Arrange the words vertically to form the passcode"
                pt="Organize as palavras verticalmente para formar a palavra-chave"
              />
            </RegionText>

            <Region key={`passcode-${currentCorridor?.passcode}`}>
              <Passcode
                passcode={currentCorridor.passcode}
                latestGuess={latestGuess}
                words={currentCorridor.words}
                currentCorridorIndexes={currentCorridorIndexes}
                onSlideWordPosition={onSlideWordPosition}
                disabled={isLose}
              />
            </Region>

            <Region>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={onSubmitPasscode}
                disabled={currentGuess === latestGuess || isLose}
                className="mt-4"
              >
                <Translate
                  pt="Enviar palavra-chave"
                  en="Send passcode"
                />
              </Button>
            </Region>

            <Region>
              <Flex
                justify="center"
                vertical
              >
                {guesses[currentCorridorIndex]?.map((guess, index) => (
                  <Typography.Text
                    type="secondary"
                    key={`${guess}-${index}`}
                    keyboard
                    className="uppercase"
                  >
                    {guess}
                  </Typography.Text>
                ))}
              </Flex>
            </Region>
          </>
        )}

        {isComplete &&
          data.corridors.map((corridor, index) => {
            return (
              <Region key={corridor.passcode}>
                <Corridor
                  number={index + 1}
                  imagesIds={corridor.imagesIds}
                  width={width * 0.75}
                  passcode={corridor.passcode}
                  moves={moves[index]}
                />
              </Region>
            );
          })}

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
            corridors={data.corridors}
            guesses={guesses}
            currentCorridorIndex={currentCorridorIndex}
            moves={moves}
            hearts={hearts}
            goal={data.goal ?? 0}
          />
        </Modal>
      </DailyContent>
    </Layout>
  );
}
