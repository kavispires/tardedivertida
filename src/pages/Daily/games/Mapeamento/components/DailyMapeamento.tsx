import clsx from 'clsx';
import { useState } from 'react';
// Ant Design Resources
import { Layout, Modal, Typography } from 'antd';
// Types
import type { Me } from 'types/user';
// Components
import { Translate } from '@components/language/Translate';
// Pages
import { DailyContent } from '@pages/Daily/components/DailyContent';
import { GameHeader } from '@pages/Daily/components/Header';
import { Keyboard } from '@pages/Daily/components/Keyboard';
import { Menu } from '@pages/Daily/components/Menu';
import { RegionHint, RegionText } from '@pages/Daily/components/Region';
import { ShowResultsButton } from '@pages/Daily/components/ShowResultsButton';
// Internal
import { getInitialState } from '../utils/helpers';
import { SETTINGS } from '../utils/settings';
import type { DailyMapeamentoEntry } from '../utils/types';
import { useMapeamentoEngine } from '../utils/useMapeamentoEngine';
import { GuessedLocation, LocationFragments } from './GuessedLocation';
import { ResultsModalContent } from './ResultsModalContent';
import { Rules } from './Rules';

type DailyMapeamentoProps = {
  data: DailyMapeamentoEntry;
  currentUser: Me;
};

export function DailyMapeamento({ data }: DailyMapeamentoProps) {
  const [initialState] = useState(getInitialState(data));

  const {
    hearts,
    guesses,
    allClues,
    availableClues,
    locationFragments,
    submitLocation,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    keyboardMapping,
    hasFoundAllLetters,
  } = useMapeamentoEngine(data, initialState);

  const [typedLocation, setTypedLocation] = useState('');

  const handledTypedLetter = (letter: string) => {
    if (isComplete) return;
    setTypedLocation((prev) => prev + letter);
  };
  const handleBackspace = () => {
    if (isComplete) return;
    setTypedLocation((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (isComplete) return;

    const result = submitLocation(typedLocation);
    if (result) {
      setTypedLocation('');
    }
  };

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
            pt="Que lugar é esse?"
            en="What place is this?"
          />
        </RegionText>

        <ul className="mapeamento-clues">
          {allClues.map((clue, index) => {
            const available = availableClues.includes(clue);
            if (!isComplete && !available) {
              return null;
            }

            return (
              <li
                key={index}
                className="mapeamento-clues__clue"
              >
                <Typography.Text
                  type="secondary"
                  className="mapeamento-clues__clue-number"
                >
                  {index + 1}
                </Typography.Text>
                <Typography.Text
                  className={clsx('mapeamento-clues__clue-text', {
                    'mapeamento-clues__clue-text--unavailable': !available,
                  })}
                >
                  {clue}
                </Typography.Text>
              </li>
            );
          })}
        </ul>

        {!isWin && <LocationFragments fragments={locationFragments} />}
        {hasFoundAllLetters && !isComplete && (
          <RegionHint className="mt-0">
            <Translate
              pt="Parece que você encontrou todas as letras da palavra em tentativas diferentes! Agora, só falta digitar o nome completo."
              en=" It seems you found all the letters of the word in different attempts! Now, just type the full name."
            />
          </RegionHint>
        )}

        {isComplete && (
          <RegionText>
            <Translate
              pt="O lugar é:"
              en="The place is:"
            />{' '}
            <strong>{data.location}</strong>
          </RegionText>
        )}

        {!isComplete && (
          <GuessedLocation
            typedLocation={typedLocation}
            fragments={locationFragments}
          />
        )}

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
            guesses={guesses}
            location={data.location}
          />
        </Modal>

        <Keyboard
          onLetterClick={handledTypedLetter}
          onBackspaceClick={handleBackspace}
          onEnterClick={handleSubmit}
          disabled={isComplete}
          withNumbers
          withSpaceBar
          lettersState={keyboardMapping}
        />

        {locationFragments.includes('_') && (
          <RegionHint className="mt-6">
            <Translate
              pt={
                <>
                  O fragmento abaixo das dicas mostra partes da palavra que você acertou, os espaços em cinza
                  <span className="location-fragments__unknown">_</span> representam letras que você ainda não
                  acertou ou espaços.
                </>
              }
              en={
                <>
                  The fragment below the clues shows parts of the word you got right, the gray spaces
                  <span className="location-fragments__unknown">_</span>
                  represent letters you haven't guessed yet or spaces.
                </>
              }
            />
          </RegionHint>
        )}

        {guesses.length > 0 && (
          <RegionText>
            <div className="mt-2">
              <Translate
                pt="Suas tentativas:"
                en="Your guesses:"
              />
            </div>
            {guesses.map((guess, i) => (
              <div key={i}>{guess.toUpperCase()}</div>
            ))}
          </RegionText>
        )}
      </DailyContent>
    </Layout>
  );
}
