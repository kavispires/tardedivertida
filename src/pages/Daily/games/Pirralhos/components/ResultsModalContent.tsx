import { useMemo } from 'react';
// Ant Design Resources
import { Flex, Typography } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Icons
import { BoxXIcon } from 'icons/BoxXIcon';
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { ImageCard } from 'components/image-cards/ImageCard';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Pages
import { NextGameSuggestion } from 'pages/Daily/components/NextGameSuggestion';
// Internal
import { SETTINGS } from '../utils/settings';
import { writeResult } from '../utils/helpers';
import type { GeneratedKid } from '../utils/types';
import { CopyToClipboardResult } from '../../../components/CopyToClipboardResult';

const { Text } = Typography;

type ResultsModalContentProps = {
  challengeNumber: number;
  win: boolean;
  hearts: number;
  culpritsIds: string[];
  liarsIds: string[];
  kids: GeneratedKid[];
};

export function ResultsModalContent({
  challengeNumber,
  win,
  hearts,
  culpritsIds,
  liarsIds,
  kids,
}: ResultsModalContentProps) {
  const { language } = useLanguage();

  const [culprits, liars] = useMemo(() => {
    return [
      kids.filter((kid) => culpritsIds.includes(kid.cardId)),
      kids.filter((kid) => liarsIds.includes(kid.cardId)),
    ];
  }, [kids, culpritsIds, liarsIds]);

  const result = useMemo(
    () =>
      writeResult({
        type: SETTINGS.ROUTE,
        challengeNumber,
        language,
        totalHearts: SETTINGS.HEARTS,
        remainingHearts: hearts,
      }),
    [challengeNumber, hearts, language],
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
            pt="Você encontrou o(a) mal-criado(a)!"
            en="You found the troublemaker!"
          />
        ) : (
          <Translate
            pt="Você não encontrou o(a) mal-criado(a)!"
            en="You missed the troublemaker!"
          />
        )}
      </Typography.Paragraph>

      <Flex
        vertical
        gap={12}
        align="center"
      >
        <Text strong>
          <Translate
            en="Troublemaker(s):"
            pt="Mal-criado(s):"
          />
        </Text>

        <Flex>
          {culprits.map((kid) => (
            <Flex
              key={kid.id}
              vertical
              align="center"
            >
              <ImageCard
                cardId={kid.cardId}
                cardWidth={48}
                preview={false}
              />
              <Text strong>
                <DualTranslate>{kid.name}</DualTranslate>
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      <Flex gap={6}>
        <Text strong>
          <Translate
            en="Liar(s):"
            pt="Mentiroso(s):"
          />
        </Text>

        {liars.map((kid) => (
          <Text
            strong
            key={kid.id}
          >
            <DualTranslate>{kid.name}</DualTranslate>
          </Text>
        ))}
      </Flex>

      <CopyToClipboardResult
        result={result}
        rows={3}
      />

      <NextGameSuggestion />
    </SpaceContainer>
  );
}
