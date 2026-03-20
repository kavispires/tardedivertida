import { motion } from 'motion/react';
// Ant Design Resources
import { Flex, Image, Space, Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Utils
import { getAnimation } from 'utils/animations';
// Components
import { GameTags } from 'components/general/GameTags';
import { Translate } from 'components/language';
import { useGameInfoContext } from 'components/session/GameInfoContext';
// Internal
import { LobbyReadyButtons } from './LobbyReadyButtons';
// Sass
import styles from '../PhaseLobby.module.scss';

type LobbyRulesProps = {
  /**
   * The game players
   */
  players: GamePlayers;
};

export function LobbyRules({ players }: LobbyRulesProps) {
  const BASE_URL = useTDBaseUrl('assets');
  const info = useGameInfoContext();
  const { language } = useLanguage();
  return (
    <motion.div
      className={styles.lobbyStepRules}
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 'auto' }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Flex
        vertical
        gap={6}
      >
        <Flex
          justify="space-between"
          align="center"
        >
          <Typography.Title
            level={4}
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            <Translate
              pt="Revise as regras"
              en="Review the rules"
            />
          </Typography.Title>
          <Typography.Text
            italic
            type="secondary"
          >
            <Translate
              pt="Inspirado em"
              en="Inspired by"
            />{' '}
            {info.inspiredBy.split('').reverse().join('')}
          </Typography.Text>
        </Flex>

        <GameTags
          wrap
          size={[1, 10]}
          style={{ display: 'flex' }}
          gameCode={info.gameCode}
          mechanics={info.mechanics}
          features={info.features}
        />
        <Image.PreviewGroup
          fallback={`${BASE_URL}/rules/no-rules.jpg`}
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
          <ul className={styles.lobbyStepRuleList}>
            {info.rules[language].map((rule, index) => (
              <motion.li
                key={rule}
                className={styles.lobbyStepRule}
                {...getAnimation('fadeIn', {
                  delay: 0.5 + index * 0.1,
                })}
              >
                {index > 0 && (
                  <Image
                    src={`${BASE_URL}/rules/game-rule-${info.gameName}-${index}.jpg`}
                    width={96}
                    className="border-radius"
                    fallback={`${BASE_URL}/rules/no-rules.jpg`}
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
