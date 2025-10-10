import clsx from 'clsx';
import { motion } from 'motion/react';
// Ant Design Resources
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
// Types
import type { Achievement, AchievementReference } from 'types/achievements';
import type { GamePlayers } from 'types/player';
// Utils
import { getAnimation } from 'utils/animations';
import { getAnimationClass } from 'utils/helpers';
// Components
import { PlayerAvatar } from 'components/avatars';
import { DualTranslate, Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
import { Instruction } from 'components/text';
// Internal
import { Medal } from './Medal';

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
   * Color scheme for the component
   */
  colorScheme?: ColorScheme;
};

const unknownText = { pt: 'Desconhecido', en: 'Unknown' };

export function Achievements({ players, achievements, reference, colorScheme }: AchievementsProps) {
  return (
    <TitledContainer
      title={<Translate pt="Medalhas" en="Achievements" />}
      titleProps={{
        colorScheme,
        size: 'small',
      }}
      className={clsx('achievements', getAnimationClass('fadeIn'))}
    >
      {achievements.length === 0 && (
        <Instruction contained>
          <Translate
            pt={
              <>
                Nenhuma medalha foi conquistada nesse jogo.
                <br />
                Para ganhar uma medalha, apenas uma jogador pode atender o pré-requisito.
              </>
            }
            en={
              <>
                No achievements were achieved in this game.
                <br />
                To win a medal, only one player can meet the condition.
              </>
            }
          />
        </Instruction>
      )}
      <ul className="achievements-list">
        {achievements.map((achievement, index) => {
          const { icon = 'star', ...achievementObj } = reference[achievement.type] ?? {};
          const player = players[achievement.playerId];
          return (
            <motion.li
              key={`achievement-${achievement.type}`}
              className={'achievements-entry'}
              {...getAnimation('flipInY', {
                duration: 2,
                delay: (index < achievements.length / 2 ? index : achievements.length - 1 - index) + 2.5,
              })}
            >
              <div className="achievement__medal">
                <Medal id={icon} />
              </div>
              <h4 className="achievement__title">
                <DualTranslate>{achievementObj.title ?? unknownText}</DualTranslate>
              </h4>
              <div className="achievement__avatar">
                <PlayerAvatar avatarId={player.avatarId} />
              </div>
              <div className="achievement__name">{player.name}</div>
              {Boolean(achievementObj.description) && (
                <div className="achievement__description">
                  <Popover
                    content={
                      <span>
                        <DualTranslate>{achievementObj.description ?? unknownText}</DualTranslate> (
                        {String(achievement.value)})
                      </span>
                    }
                  >
                    <Button icon={<QuestionCircleOutlined />} shape="circle" type="text" size="small" />
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
