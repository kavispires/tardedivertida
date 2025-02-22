import { motion } from 'framer-motion';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { Region } from 'pages/Daily/components/Region';
import { getDailyName, getSourceName } from 'pages/Daily/utils';
import { useMemo } from 'react';
// Ant Design Resources
import { Flex, Space, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimation } from 'utils/animations';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { SignCard } from 'components/cards/SignCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { SETTINGS } from '../utils/settings';
import type { DailyComunicacaoAlienigenaEntry } from '../utils/types';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challenge: number;
  guesses: string[];
  attributes: DailyComunicacaoAlienigenaEntry['attributes'];
  requests: DailyComunicacaoAlienigenaEntry['requests'];
  win: boolean;
  solution: string;
  width: number;
};

export function ResultsModalContent({
  guesses,
  attributes,
  requests,
  challenge,
  win,
  solution,
  width,
}: ResultsModalContentProps) {
  const { language, dualTranslate } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        game: dualTranslate(SETTINGS.NAME),
        challenge,
        guesses,
        solution,
        language,
      }),
    [challenge, dualTranslate, guesses, language, solution],
  );

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
          <Translate pt="O alienígena abduziu todos os itens!" en="The alien abducted all items!" />
        ) : (
          <Translate
            pt="O alienígena vai destruir a Terra porque você não entregou as coisas certas!"
            en="The alien will destroy Earth because you didn't deliver the right items!"
          />
        )}
      </Typography.Paragraph>

      <Region>
        <Flex className="alien-requests" gap={8}>
          {requests.map((request, index) => {
            return (
              <motion.div key={request.itemId} {...getAnimation('fadeIn', { delay: index * 0.2 })}>
                <ItemCard id={request.itemId} width={width} padding={0} className="transparent" />
              </motion.div>
            );
          })}
        </Flex>
      </Region>

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
    </SpaceContainer>
  );
}

function writeResult({
  game,
  challenge,
  guesses,
  solution,
  language,
}: {
  game: string;
  challenge: number;
  guesses: string[];
  solution: string;
  language: Language;
}) {
  const solutionItems = solution.split('-');

  const indexEmojis = ['🟤', '🟡', '🔵', '🟣'];

  const result = guesses.map((guess) => {
    const guessItems = guess.split('-');
    return guessItems
      .map((item, i) => {
        // Correct?
        if (item === solutionItems[i]) {
          return indexEmojis[i];
        }
        // Incorrect?
        if (solutionItems.includes(item)) {
          return '❌';
        }
        // Missing?
        return '👽';
      })
      .join('');
  });

  return [
    `${SETTINGS.EMOJI} ${getDailyName(language)} ${game} #${challenge}`,
    ...result,
    `https://www.kavispires.com/tardedivertida/#/${getSourceName(language)}`,
  ].join('\n');
}
