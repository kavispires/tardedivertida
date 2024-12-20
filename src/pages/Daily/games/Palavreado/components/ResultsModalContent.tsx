import { chunk } from "lodash";
import { NextGameSuggestion } from "pages/Daily/components/NextGameSuggestion";
import {
  getDailyName,
  getSourceName,
  writeHeartResultString,
} from "pages/Daily/utils";
// Ant Design Resources
import { Divider, Space, Typography } from "antd";
// Hooks
import { useLanguage } from "hooks/useLanguage";
// Icons
import { BoxXIcon } from "icons/BoxXIcon";
import { TrophyIcon } from "icons/TrophyIcon";
// Components
import { IconAvatar } from "components/avatars";
import { Translate } from "components/language";
// Internal
import { SETTINGS } from "../utils/settings";
import { PalavreadoLetter } from "../utils/types";
import { CopyToClipboardResult } from "../../../components/CopyToClipboardResult";

type ResultsModalContentProps = {
  challenge: number;
  words: string[];
  isWin: boolean;
  hearts: number;
  letters: PalavreadoLetter[];
  swaps: number;
  size: number;
};

export function ResultsModalContent({
  challenge,
  words,
  isWin,
  hearts,
  letters,
  swaps,
  size,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = writeResult({
    game: dualTranslate(SETTINGS.NAME),
    challenge,
    remainingHearts: hearts,
    letters,
    language,
    swaps,
    size,
  });

  return (
    <Space direction="vertical" className="space-container">
      <Typography.Title level={2} className="center">
        {isWin ? (
          <>
            <IconAvatar icon={<TrophyIcon />} />{" "}
            <Translate pt="Parabéns!" en="Congratulations!" />
          </>
        ) : (
          <>
            <IconAvatar icon={<BoxXIcon />} />{" "}
            <Translate pt="Que pena!" en="Too bad!" />
          </>
        )}
      </Typography.Title>
      <Typography.Paragraph className="center">
        {isWin ? (
          <Translate
            pt="Você acertou as palavras!"
            en="You guessed the words!"
          />
        ) : (
          <Translate
            pt="Você não acertou todas as palavras!"
            en="You missed the words!"
          />
        )}
      </Typography.Paragraph>

      <Space className="result-answer" split={<Divider type="vertical" />}>
        {words.map((word) => (
          <Typography.Text key={word}>{word}</Typography.Text>
        ))}
      </Space>

      <CopyToClipboardResult result={result} rows={size + 2} />

      <NextGameSuggestion />
    </Space>
  );
}

function writeResult({
  game,
  challenge,
  remainingHearts,
  letters,
  language,
  swaps,
  size,
}: {
  game: string;
  challenge: number;
  remainingHearts: number;
  letters: PalavreadoLetter[];
  language: Language;
  swaps: number;
  size: number;
}) {
  const cleanUpAttempts = chunk(letters, size).map((row) =>
    row.map((letter) => {
      switch (letter.state) {
        case "0":
          return "🟥";
        case "1":
          return "🟦";
        case "2":
          return "🟪";
        case "3":
          return "🟫";
        case "4":
          return "🟧";
        default:
          return "⬜️";
      }
    }),
  );

  return [
    `${SETTINGS.ICON} ${getDailyName(language)} ${game} #${challenge}`,
    `${writeHeartResultString(remainingHearts, Math.max(SETTINGS.HEARTS, size), " ")} (${swaps} trocas)`,
    cleanUpAttempts
      .map((row) => row.join(" ").trim())
      .filter(Boolean)
      .join("\n"),
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join("\n");
}
