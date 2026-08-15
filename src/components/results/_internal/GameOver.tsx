import { motion } from 'motion/react';
import { type ReactNode, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Ant Design Resources
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Progress, Space } from 'antd';
// Types
import type { GameState, GamePlayer } from 'types/game';
// Hooks
import { useCountdown } from '@hooks/useCountdown';
import { useLanguage } from '@hooks/useLanguage';
// Utils
import { AVATARS } from '@utils/avatars';
// Components
import { GameStrip } from '@components/game-identity/GameBanner';
import { HostButton } from '@components/host/HostButton';
import { HostOnlyContainer } from '@components/host/HostOnlyContainer';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { useGameInfoContext } from '@components/session/GameInfoContext';
import { Step, type StepProps } from '@components/steps/Step';
// Internal
import { RateGameWidget } from './RateGameWidget';
// Images
import gameOverTitle from '@assets/images/game-over-title.svg?url';
// Sass
import styles from './gameOver.module.scss';

const GameOverText = () => (
  <Translate
    pt="Jogo concluído"
    en="The game is over"
  />
);

type GameOverProps = {
  /**
   * The game state
   */
  state: GameState;
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
  /**
   * Custom rate widget text
   */
  rateWidgetCustomText?: ReactNode;
} & Pick<StepProps, 'announcement'>;

/**
 * Game over screen component that displays the final game state with rating widget and navigation options
 */
export function GameOver({ state, children, className, rateWidgetCustomText, announcement }: GameOverProps) {
  const info = useGameInfoContext();
  const { language } = useLanguage();
  const [hideGameOver, setShowGameBanner] = useState(false);

  const navigate = useNavigate();

  useCountdown({
    duration: 15,
    onExpire: () => setShowGameBanner(true),
  });

  const hasWinnerContent =
    (Boolean(state.winners) && state.winners.length > 0) || Boolean(state.group) || Boolean(state.team);

  return (
    <Step
      className={className}
      announcement={announcement}
      fullWidth
    >
      <div className={styles.gameOver__banner}>
        <GameStrip
          gameName={info.gameName}
          width={400}
          title={info.title}
          stripWidth={window.innerWidth + 64}
          showLogo={hideGameOver}
          className={styles.gameOver__strip}
        >
          {!hideGameOver && (
            <motion.img
              src={gameOverTitle}
              alt="Game Over"
              className={styles.gameOver__title}
              style={{ width: 400, transform: 'translate(-50%, -50%)' }}
              initial={{ opacity: 0, scale: 0.5, transform: 'translate(-50%, -50%)' }}
              animate={{ opacity: 1, scale: 1, transform: 'translate(-50%, -50%)' }}
              transition={{ delay: 4, duration: 2 }}
              exit={{ opacity: 0, scale: 0, transform: 'translate(-50%, -50%)' }}
            />
          )}
        </GameStrip>
      </div>

      {hasWinnerContent && state?.group?.outcome !== 'NON_WINNABLE_GAME' && (
        <Surface contained>
          {Boolean(state.winners) && state.winners.length > 0 && (
            <div className={styles.gameOver__winnerContainer}>
              <div className={styles.gameOver__text}>
                <GameOverText />{' '}
                {state.winners.length > 1 ? (
                  <Translate
                    pt="e os vencedores são"
                    en="and the winners are"
                  />
                ) : (
                  <Translate
                    pt="e o vencedor é"
                    en="and the winner is"
                  />
                )}
                :
              </div>
              <ul className={styles.gameOver__winners}>
                {state.winners.map((winner: GamePlayer) => {
                  return (
                    <li
                      className={styles.gameOver__winner}
                      key={`winner-${winner.name}`}
                    >
                      <PlayerAvatar
                        className={styles.gameOver__avatar}
                        avatarId={winner.avatarId ?? 25}
                      />
                      <div className={styles.gameOver__winnerName}>
                        <strong>{winner.name ?? '?'}</strong>,{' '}
                        {AVATARS[winner.avatarId].description[language]}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {Boolean(state.group) && (
            <div className={styles.gameOver__winner}>
              <div className={styles.gameOver__text}>
                <GameOverText />
              </div>
              <Progress
                type="circle"
                strokeColor={
                  state.group.outcome === 'WIN'
                    ? {
                        '0%': '#4ba226',
                        '100%': '#87d068',
                      }
                    : {
                        '0%': '#ff0000',
                        '70%': '#ff0000',
                        '100%': '#87d068',
                      }
                }
                percent={Math.round(((state.group.score ?? 0) * 100) / (state.group.goal ?? 1))}
              />
              <div className={styles.gameOver__text}>
                {state.group.outcome === 'WIN' ? (
                  <Translate
                    pt="Parabéns, vocês ganharam!"
                    en="Congratulations, you won!"
                  />
                ) : (
                  <Translate
                    pt="Não foi dessa vez, que vergonha heim!"
                    en="You lost! What a shame!"
                  />
                )}
              </div>
            </div>
          )}

          {Boolean(state.team) && (
            <div className={styles.gameOver__winner}>
              <div className={styles.gameOver__text}>
                <GameOverText />
              </div>
              <Progress
                type="circle"
                strokeColor={{
                  '0%': '#ff0000',
                  '70%': '#ff0000',
                  '100%': '#87d068',
                }}
                percent={state.team.score ?? 0}
              />
              <div className={styles.gameOver__text}>
                {state.team.victory ? (
                  <Translate
                    pt="Parabéns, vocês ganharam!"
                    en="Congratulations, you won!"
                  />
                ) : (
                  <Translate
                    pt="Não foi dessa vez, que vergonha heim!"
                    en="You lost! What a shame!"
                  />
                )}
              </div>
            </div>
          )}

          {!state.winners && !state.team && !state.group && (
            <div className={styles.gameOver__text}>
              <GameOverText />
            </div>
          )}
        </Surface>
      )}

      <RateGameWidget customText={rateWidgetCustomText} />

      {children}

      <Space
        align="center"
        orientation="vertical"
        className="full-width padding"
        style={{ marginTop: '48px' }}
      >
        <Space.Compact>
          <Button onClick={() => navigate('/')}>
            <Translate
              pt="Página Inicial"
              en="Home Page"
            />
          </Button>
          <Button>
            <Link
              to="/me"
              target="_blank"
            >
              <Translate
                pt="Meu Perfil"
                en="My Profile"
              />{' '}
              <ArrowRightOutlined style={{ rotate: '-45deg' }} />
            </Link>
          </Button>
        </Space.Compact>

        <HostOnlyContainer>
          <HostButton onClick={() => navigate('/hub')}>
            <Translate
              en="Go to Hub"
              pt="Ir para o Hub"
            />
          </HostButton>
        </HostOnlyContainer>
      </Space>
    </Step>
  );
}
