import clsx from 'clsx';
import { motion } from 'motion/react';
// Ant Design Resources
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
// Types
import type { Achievement, AchievementReference, GamePlayers } from 'types/game';
// Utils
import { getAnimation } from '@utils/animations';
import { UNKNOWN_TEXT } from '@utils/constants';
import { getAnimationClass } from '@utils/helpers';
// Components
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { TitledContainer } from '@components/layout/TitledContainer';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
// Internal
import { Medal } from './Medal';
// Sass
import styles from './Achievements.module.scss';

type AchievementsProps = {
  /**
   * Players of the game
   */
  players: GamePlayers;
  /**
   * Achievements to be displayed
   */
  achievements: Achievement[];
  /**
   * Reference for the achievements
   */
  reference: AchievementReference;
  /**
   * Overriding color scheme for the component
   */
  colorScheme?: ColorScheme;
};

/**
 * Component that displays a list of achievements for players with medal icons and descriptions
 */
export function Achievements({ players, achievements, reference, colorScheme }: AchievementsProps) {
  return (
    <TitledContainer
      title={
        <Translate
          pt="Medalhas"
          en="Achievements"
        />
      }
      titleProps={{
        colorScheme,
        size: 'small',
      }}
      className={clsx(styles.achievements, getAnimationClass('fadeIn'))}
    >
      {achievements.length === 0 && (
        <Surface contained>
          <Translate
            en="No achievements were achieved in this game.
            <br/>
            To win a medal, only one player can meet the condition."
            pt="Nenhuma medalha foi conquistada nesse jogo.
            <br/>
            Para ganhar uma medalha, apenas uma jogador pode atender o pré-requisito."
          />
        </Surface>
      )}
      <ul className={styles.achievementsList}>
        {achievements.map((achievement, index) => {
          const { icon = 'star', ...achievementObj } = reference[achievement.type] ?? {};
          const player = players[achievement.playerId];
          return (
            <motion.li
              key={`achievement-${achievement.type}`}
              className={styles.achievementsEntry}
              {...getAnimation('flipInY', {
                duration: 2,
                delay: (index < achievements.length / 2 ? index : achievements.length - 1 - index) + 2.5,
              })}
            >
              <div className={styles.achievementMedal}>
                <Medal id={icon} />
              </div>
              <h4 className={styles.achievementTitle}>
                <DualTranslate>{achievementObj.title ?? UNKNOWN_TEXT}</DualTranslate>
              </h4>
              <div className={styles.achievementAvatar}>
                <PlayerAvatar avatarId={player.avatarId} />
              </div>
              <div className={styles.achievementName}>{player.name}</div>
              {Boolean(achievementObj.description) && (
                <div className={styles.achievementDescription}>
                  <Popover
                    content={
                      <span>
                        <DualTranslate>{achievementObj.description ?? UNKNOWN_TEXT}</DualTranslate> (
                        {String(achievement.value)})
                      </span>
                    }
                  >
                    <Button
                      icon={<QuestionCircleOutlined />}
                      shape="circle"
                      type="text"
                      size="small"
                    />
                  </Popover>
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>
    </TitledContainer>
  );
}
