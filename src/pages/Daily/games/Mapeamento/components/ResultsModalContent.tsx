import { useMemo } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TextHighlight } from 'components/text/TextHighlight';
// Pages
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
// Internal
import { SETTINGS } from '../utils/settings';
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  win: boolean;
  hearts: number;
  guesses: string[];
  location: string;
};

export function ResultsModalContent({
  challengeNumber,
  win,
  hearts,
  guesses,
  location,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: SETTINGS.ROUTE,
        challengeNumber,
        language,
        totalHearts: SETTINGS.HEARTS,
        remainingHearts: hearts,
        guesses,
      }),
    [challengeNumber, hearts, language, guesses],
  );

  return (
    <SpaceContainer vertical>
      <Typography.Title
        level={2}
        className="center"
      >
        {win ? (
          <>
            <IconAvatar icon={<TrophyIcon />} />{' '}
            <Translate
              pt="Parabéns!"
              en="Congratulations!"
            />
          </>
        ) : (
          <>
            <IconAvatar icon={<BoxXIcon />} />{' '}
            <Translate
              pt="Que pena!"
              en="Too bad!"
            />
          </>
        )}
      </Typography.Title>
      <Typography.Paragraph className="center">
        {win ? (
          <Translate
            pt="Você acertou a palavra!"
            en="You guessed the word!"
          />
        ) : (
          <Translate
            pt="Você errou a palavra!"
            en="You missed the word!"
          />
        )}
      </Typography.Paragraph>

      <TextHighlight className="result-answer">
        <Typography.Paragraph className="text-center">{location}</Typography.Paragraph>
      </TextHighlight>

      <CopyToClipboardResult
        result={result}
        rows={3}
      />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
