import { NextGameSuggestion } from "pages/Daily/components/NextGameSuggestion";
import { getDailyName, getSourceName } from "pages/Daily/utils";
import { useMemo } from "react";
// Ant Design Resources
import { Flex, Space, Typography } from "antd";
// Hooks
import { useLanguage } from "hooks/useLanguage";
// Icons
import { BoxXIcon } from "icons/BoxXIcon";
import { TrophyIcon } from "icons/TrophyIcon";
// Components
import { IconAvatar } from "components/avatars";
import { SignCard } from "components/cards/SignCard";
import { Translate } from "components/language";
// Internal
import { SETTINGS } from "../utils/settings";
import type { DailyComunicacaoAlienigenaEntry } from "../utils/types";
import { CopyToClipboardResult } from "../../../components/CopyToClipboardResult";

type ResultsModalContentProps = {
  challenge: number;
  guesses: string[];
  attributes: DailyComunicacaoAlienigenaEntry["attributes"];
  win: boolean;
  hearts: number;
  solution: string;
  width: number;
};

export function ResultsModalContent({
  guesses,
  attributes,
  challenge,
  win,
  hearts,
  solution,
  width,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        game: dualTranslate(SETTINGS.NAME),
        challenge,
        remainingHearts: hearts,
        guesses,
        solution,
        language,
      }),
    [challenge, dualTranslate, guesses, hearts, language, solution],
  );

  return (
    <Space direction="vertical" className="space-container">
      <Typography.Title level={2} className="center">
        {win ? (
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
        {win ? (
          <Translate
            pt="O alienígena abduziu todos os itens!"
            en="The alien abducted all items!"
          />
        ) : (
          <Translate
            pt="O alienígena vai destruir a Terra porque você não estregou as coisas certas!"
            en="The alien will destroy Earth because you didn't deliver the right items!"
          />
        )}
      </Typography.Paragraph>

      <Space direction="vertical">
        {attributes.map((attribute) => (
          <Flex key={attribute.id} gap={6}>
            <SignCard id={attribute.spriteId} width={width} />
            <Flex vertical>
              <Typography.Text strong>{attribute.name}</Typography.Text>
              <Typography.Text italic>{attribute.description}</Typography.Text>
            </Flex>
          </Flex>
        ))}
      </Space>

      <CopyToClipboardResult result={result} rows={3} />

      <NextGameSuggestion />
    </Space>
  );
}

function writeResult({
  game,
  challenge,
  remainingHearts,
  guesses,
  solution,
  language,
}: {
  game: string;
  challenge: number;
  remainingHearts: number;
  guesses: string[];
  solution: string;
  language: Language;
}) {
  const solutionItems = solution.split("-");

  const indexEmojis = ["🟤", "🟡", "🔵", "🟣"];

  const result = guesses.map((guess, index) => {
    const guessItems = guess.split("-");
    return guessItems
      .map((item, i) => {
        // Correct?
        if (item === solutionItems[i]) {
          return indexEmojis[i];
        }
        // Incorrect?
        if (solutionItems.includes(item)) {
          return "❌";
        }
        // Missing?
        return "👽";
      })
      .join("");
  });

  return [
    `${SETTINGS.ICON} ${getDailyName(language)} ${game} #${challenge}`,
    ...result,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join("\n");
}
