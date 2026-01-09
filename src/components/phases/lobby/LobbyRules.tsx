import { motion } from 'motion/react';
// Ant Design Resources
import { Flex, Image, Space, Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { getAnimation } from 'utils/animations';
import { PUBLIC_URL } from 'utils/constants';
// Components
import { GameTags } from 'components/general/GameTags';
import { Translate } from 'components/language';
import { useGameInfoContext } from 'components/session/GameInfoContext';
// Internal
import { LobbyReadyButtons } from './LobbyReadyButtons';

type LobbyRulesProps = {
  /**
   * The game players
   */
  players: GamePlayers;
};

export function LobbyRules({ players }: LobbyRulesProps) {
  const info = useGameInfoContext();
  const { language } = useLanguage();
  return (
    <motion.div
      className="lobby-step__rules"
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 'auto' }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Flex
        vertical
        gap={6}
      >
        <Typography.Title
          level={4}
          style={{ marginTop: 0 }}
        >
          <Translate
            pt="Revise as regras"
            en="Review the rules"
          />
        </Typography.Title>
        <GameTags
          wrap
          size={[1, 10]}
          style={{ display: 'flex' }}
          gameCode={info.gameCode}
          tags={info.tags}
        />
        <Image.PreviewGroup
          fallback={`${PUBLIC_URL.RULES}no-rules.jpg`}
          preview={{
            countRender: (current, total) => (
              <Space
                orientation="vertical"
                size="small"
                className="text-center"
              >
                <span>{info.rules[language][current]}</span>
                <span>
                  {current}/{total}
                </span>
              </Space>
            ),
          }}
        >
          <ul className="lobby-step__rule-list">
            {info.rules[language].map((rule, index) => (
              <motion.li
                key={rule}
                className="lobby-step__rule"
                {...getAnimation('fadeIn', {
                  delay: 1 + index * 0.1,
                })}
              >
                {index > 0 && (
                  <Image
                    src={`${PUBLIC_URL.RULES}game-rule-${info.gameName}-${index}.jpg`}
                    width={96}
                    className="border-radius"
                    fallback={`${PUBLIC_URL.RULES}no-rules.jpg`}
                  />
                )}
                <Typography.Paragraph style={{ marginBottom: 0 }}>{rule}</Typography.Paragraph>
              </motion.li>
            ))}
          </ul>
        </Image.PreviewGroup>
      </Flex>
      <LobbyReadyButtons players={players} />
    </motion.div>
  );
}
