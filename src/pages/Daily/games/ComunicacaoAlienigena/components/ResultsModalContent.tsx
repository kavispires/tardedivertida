import { motion } from 'framer-motion';
import { DailyItem } from 'pages/Daily/components/DailyItem';
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
import { Region } from 'pages/Daily/components/Region';
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
import { SignCard } from 'components/cards/SignCard';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import { SETTINGS } from '../utils/settings';
import type { DailyComunicacaoAlienigenaEntry } from '../utils/types';
import { writeResult } from '../utils/helpers';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

type ResultsModalContentProps = {
  challengeNumber: number;
  guesses: string[];
  attributes: DailyComunicacaoAlienigenaEntry['attributes'];
  requests: DailyComunicacaoAlienigenaEntry['requests'];
  win: boolean;
  solution: string;
  width: number;
  hearts: number;
};

export function ResultsModalContent({
  guesses,
  attributes,
  requests,
  challengeNumber,
  win,
  solution,
  width,
  hearts,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const result = useMemo(
    () =>
      writeResult({
        type: 'comunicacao-alienigena',
        language,
        challengeNumber,
        totalHearts: SETTINGS.HEARTS,
        remainingHearts: hearts,
        guesses,
        solution,
      }),
    [challengeNumber, guesses, language, solution, hearts],
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
                <DailyItem id={request.itemId} width={width} padding={0} className="transparent" />
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
