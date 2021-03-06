// Ant Design Resources
import { Button, Progress, Space } from 'antd';
// Images
import gameOverTitle from 'assets/images/game-over-title.svg';
// Utils
import { useLanguage } from 'hooks';
import { AVATARS } from 'utils/avatars';
// Components
import { Translate } from 'components/language';
import { Avatar } from 'components/avatars';
import { RateGameWidget } from './RateGameWidget';
import { useNavigate } from 'react-router-dom';
import { AdminOnlyButton } from 'components/admin';
import { ReactNode } from 'react';

const GameOverText = () => <Translate pt="Jogo concluído" en="The game is over" />;

type GameOverProps = {
  state: GameState;
  /**
   * The content of the component
   */
  children: ReactNode;
  /**
   * Optional custom class name
   */
  className?: string;
  showRateWidgetAfterContent?: boolean;
  rateWidgetCustomText?: any;
};

export function GameOver({
  state,
  children,
  className,
  showRateWidgetAfterContent,
  rateWidgetCustomText,
}: GameOverProps) {
  const { language } = useLanguage();

  const navigate = useNavigate();

  return (
    <div className={className}>
      <div className="game-over__title">
        <img src={gameOverTitle} alt="Game Over" />
      </div>

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
                    <strong>{winner.name ?? '?'}</strong>, {AVATARS[winner.avatarId].description[language]}
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
              state.group.victory
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
            percent={state.group.score ?? 0}
          />
          <div className="game-over__text">
            {state.group.victory ? (
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

      {!showRateWidgetAfterContent && <RateGameWidget customText={rateWidgetCustomText} />}

      {children}

      {showRateWidgetAfterContent && <RateGameWidget customText={rateWidgetCustomText} />}

      <Space align="center" direction="vertical" className="full-width padding">
        <Button onClick={() => navigate('/')}>
          <Translate pt="Página Inicial" en="Home Page" />
        </Button>

        <AdminOnlyButton onClick={() => navigate('/hub')} label="Hub" />
      </Space>
    </div>
  );
}
