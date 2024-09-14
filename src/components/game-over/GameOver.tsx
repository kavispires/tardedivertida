import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { Button, Image, Progress, Space } from 'antd';
// Types
import type { GameState } from 'types/game';
import type { GamePlayer } from 'types/player';
// Types
import type { GameInfo } from 'types/game-info';
// Images
import gameOverTitle from 'assets/images/game-over-title.svg';
// Utils
import { useLanguage } from 'hooks/useLanguage';
import { AVATARS } from 'utils/avatars';
// Components
import { Translate } from 'components/language';
import { Avatar } from 'components/avatars';
import { HostOnlyButton } from 'components/host';
import { Instruction } from 'components/text';
import { RateGameWidget } from './RateGameWidget';
import { useCountdown } from 'hooks/useCountdown';
import { PUBLIC_URL } from 'utils/constants';
import { getAnimationClass } from 'utils/helpers';
import { Step, type StepProps } from 'components/steps';
import clsx from 'clsx';
// import { ConvertGuestToAccountModal } from 'components/auth/ConvertGuestToAccount';

const GameOverText = () => <Translate pt="Jogo concluído" en="The game is over" />;

type GameOverProps = {
  /**
   * The game info
   */
  info: GameInfo;
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
  rateWidgetCustomText?: any;
} & Pick<StepProps, 'announcement'>;

export function GameOver({
  state,
  info,
  children,
  className,
  rateWidgetCustomText,
  announcement,
}: GameOverProps) {
  const { language, dualTranslate } = useLanguage();
  const [showGameBanner, setShowGameBanner] = useState(false);

  const navigate = useNavigate();

  useCountdown({
    duration: 15,
    onExpire: () => setShowGameBanner(true),
  });

  const hasWinnerContent =
    (Boolean(state.winners) && state.winners.length > 0) || Boolean(state.group) || Boolean(state.team);

  return (
    <Step className={className} announcement={announcement} fullWidth>
      <div className="game-over__title">
        {showGameBanner ? (
          <Image
            src={`${PUBLIC_URL.BANNERS}${info.gameName}-${language}.jpg`}
            fallback={`${PUBLIC_URL.RULES}game-rule-not-found.jpg`}
            alt={dualTranslate(info.title)}
            preview={false}
            className={clsx(getAnimationClass('bounceInDown'), 'round-corners margin')}
          />
        ) : (
          <img src={gameOverTitle} alt="Game Over" className={getAnimationClass('bounceInDown')} />
        )}
      </div>

      {hasWinnerContent && state?.group?.outcome !== 'NON_WINNABLE_GAME' && (
        <Instruction contained>
          {Boolean(state.winners) && state.winners.length > 0 && (
            <div className="game-over__winner-container">
              <div className="game-over__text">
                <GameOverText />{' '}
                {state.winners.length > 1 ? (
                  <Translate pt="e os vencedores são" en="and the winners are" />
                ) : (
                  <Translate pt="e o vencedor é" en="and the winner is" />
                )}
                :
              </div>
              <ul className="game-over__winners">
                {state.winners.map((winner: GamePlayer) => {
                  return (
                    <li className="game-over__winner" key={`winner-${winner.name}`}>
                      <Avatar className="game-over__avatar" id={winner.avatarId ?? 25} />
                      <div className="game-over__winner-name">
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
            <div className="game-over__winner">
              <div className="game-over__text">
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
              <div className="game-over__text">
                {state.group.outcome === 'WIN' ? (
                  <Translate pt="Parabéns, vocês ganharam!" en="Congratulations, you won!" />
                ) : (
                  <Translate pt="Não foi dessa vez, que vergonha heim!" en="You lost! What a shame!" />
                )}
              </div>
            </div>
          )}

          {Boolean(state.team) && (
            <div className="game-over__winner">
              <div className="game-over__text">
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
              <div className="game-over__text">
                {state.team.victory ? (
                  <Translate pt="Parabéns, vocês ganharam!" en="Congratulations, you won!" />
                ) : (
                  <Translate pt="Não foi dessa vez, que vergonha heim!" en="You lost! What a shame!" />
                )}
              </div>
            </div>
          )}

          {!Boolean(state.winners) && !Boolean(state.team) && !Boolean(state.group) && (
            <div className="game-over__text">
              <GameOverText />
            </div>
          )}
        </Instruction>
      )}

      <RateGameWidget customText={rateWidgetCustomText} />

      {children}

      {/* <ConvertGuestToAccountModal /> */}

      <Space align="center" direction="vertical" className="full-width padding" style={{ marginTop: '48px' }}>
        <Button onClick={() => navigate('/')}>
          <Translate pt="Página Inicial" en="Home Page" />
        </Button>

        <HostOnlyButton onClick={() => navigate('/hub')}>Hub</HostOnlyButton>
      </Space>
    </Step>
  );
}
