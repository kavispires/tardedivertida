import { useMemo } from 'react';
// Ant Design Resources
import { Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TextHighlight } from 'components/text';
// Pages
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
// Internal
import { SETTINGS } from '../utils/settings';
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  text: string;
  win: boolean;
  hearts: number;
  solution: BooleanDictionary;
};

export function ResultsModalContent({
  text,
  challengeNumber,
  win,
  hearts,
  solution,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: 'filmaco',
        language,
        challengeNumber,
        totalHearts: SETTINGS.HEARTS,
        remainingHearts: hearts,
        solution,
      }),
    [language, challengeNumber, hearts, solution],
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
            pt="Você acertou o filme!"
            en="You guessed the movie!"
          />
        ) : (
          <Translate
            pt="Você errou o filme!"
            en="You missed the movie!"
          />
        )}
      </Typography.Paragraph>

      <TextHighlight className="result-answer">
        <Typography.Paragraph className="text-center">{text}</Typography.Paragraph>
      </TextHighlight>

      <CopyToClipboardResult
        result={result}
        rows={3}
      />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
