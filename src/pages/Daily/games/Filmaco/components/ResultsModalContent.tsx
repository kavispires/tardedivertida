import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { getDailyName, getSourceName, writeHeartResultString } from 'pages/Daily/utils';
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
// Internal
import { SETTINGS } from '../utils/settings';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challenge: number;
  text: string;
  win: boolean;
  hearts: number;
  solution: BooleanDictionary;
};

export function ResultsModalContent({ text, challenge, win, hearts, solution }: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = writeResult({
    game: dualTranslate(SETTINGS.NAME),
    challenge,
    remainingHearts: hearts,
    solution,
    language,
  });

  return (
    <SpaceContainer vertical>
      <Typography.Title level={2} className="center">
        {win ? (
          <>
            <IconAvatar icon={<TrophyIcon />} /> <Translate pt="Parabéns!" en="Congratulations!" />
          </>
        ) : (
          <>
            <IconAvatar icon={<BoxXIcon />} /> <Translate pt="Que pena!" en="Too bad!" />
          </>
        )}
      </Typography.Title>
      <Typography.Paragraph className="center">
        {win ? (
          <Translate pt="Você acertou o filme!" en="You guessed the movie!" />
        ) : (
          <Translate pt="Você errou o filme!" en="You missed the movie!" />
        )}
      </Typography.Paragraph>

      <TextHighlight className="result-answer">
        <Typography.Paragraph className="text-center">{text}</Typography.Paragraph>
      </TextHighlight>

      <CopyToClipboardResult result={result} rows={3} />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}

function writeResult({
  game,
  challenge,
  remainingHearts,
  solution,
  language,
}: {
  game: string;
  challenge: number;
  remainingHearts: number;
  solution: BooleanDictionary;
  language: Language;
}) {
  const totalLetters = Object.keys(solution).length;
  const guessedLetters = Object.values(solution).filter(Boolean).length;

  return [
    `${SETTINGS.EMOJI} ${getDailyName(language)} ${game} #${challenge}`,
    `${writeHeartResultString(remainingHearts, SETTINGS.HEARTS)} (${Math.round((guessedLetters / totalLetters) * 100)}%)`,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
