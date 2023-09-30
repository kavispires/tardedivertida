import { ReadOutlined } from '@ant-design/icons';
import { Button, App } from 'antd';
import { Translate } from 'components/language';
import { messageContent } from 'components/pop-up';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { TimedTimerBar } from 'components/timers';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
import { useEffect, useMemo, useState } from 'react';
import { useCounter, useEffectOnce } from 'react-use';
import { MessageBoard } from './components/MessageBoard';
import { PlayerStatus } from './components/PlayerStatus';
import { PlayerTargetCardButton } from './components/PlayerTargetCardButton';
import { GeneralRules } from './components/RulesBlobs';

type StepTargetingProps = {
  user: GamePlayer;
  players: GamePlayers;
  onSubmitTarget: GenericFunction;
  onSubmitMessage: GenericComponent;
  messages: Record<PlayerId, QMessage>;
};

export function StepTargeting({
  players,
  user,
  onSubmitTarget,
  onSubmitMessage,
  messages,
}: StepTargetingProps) {
  const { message } = App.useApp();
  const { isLoading } = useLoading();
  const { translate } = useLanguage();
  const [isVotingDisabled, setIsVotingDisabled] = useState(false);
  const [votingCount, setVotingCount] = useCounter(3);

  // When voting count reaches 0, disable voting
  useEffect(() => {
    if (votingCount <= 0) {
      setIsVotingDisabled(true);
    }
  }, [votingCount]);

  // When time ends, disable voting
  const timeExpireDisableVoting = () => setIsVotingDisabled(true);

  const playerIds = Object.keys(players).sort();

  const { leftPlayersIds, rightPlayersIds } = useMemo(() => {
    const half = Math.ceil(playerIds.length / 2);
    const left: PlayerId[] = [];
    const right: PlayerId[] = [];

    playerIds.forEach((playerId, index) => {
      if (index < half) {
        left.push(playerId);
      } else {
        right.push(playerId);
      }
    });
    return {
      leftPlayersIds: left,
      rightPlayersIds: right,
    };
  }, [playerIds]);

  const targetCardWidth = Math.floor(100 / playerIds.length);

  const popRule = () => {
    message.info(
      messageContent(translate('Você controla!', 'You control!'), <GeneralRules />, 'rules', 20, 'rules')
    );
  };

  useEffectOnce(() => popRule());

  const onSelectTarget = (targetId: PlayerId) => {
    setVotingCount.dec();
    onSubmitTarget({ targetId });
  };

  return (
    <Step fullWidth className="q-target-grid">
      <div className="q-target-content">
        <Title size="small">
          <Translate pt="Escolha seu alvo!" en="Choose your target!" />
        </Title>
        <TimedTimerBar duration={90} steps={18} onExpire={timeExpireDisableVoting} />

        <Button shape={'round'} size="small" onClick={popRule} icon={<ReadOutlined />}>
          <Translate pt=" Regras" en=" Rules" />
        </Button>

        <MessageBoard
          messages={messages}
          onSubmitMessage={onSubmitMessage}
          disabled={Boolean(user.messaged) || isLoading}
          players={players}
          user={user}
        />
      </div>

      <div className="q-target-players q-target-players--left">
        {leftPlayersIds.map((playerId) => (
          <PlayerStatus key={playerId} player={players[playerId]} side="left" />
        ))}
      </div>

      <div className="q-target-players q-target-players--right">
        {rightPlayersIds.map((playerId) => (
          <PlayerStatus key={playerId} player={players[playerId]} side="right" />
        ))}
      </div>

      <div className="q-target-section">
        {isVotingDisabled ? (
          <>
            <h3>
              <Translate
                pt={<>Você não pode mais trocar seu alvo.</>}
                en={<>You can not change your target anymore.</>}
              />
            </h3>
            <p>
              <Translate
                pt={<>Aguarde enquanto o resultado é calculado.</>}
                en={<>Wait to see the outcome...</>}
              />
            </p>
          </>
        ) : (
          <>
            <h3>
              <Translate
                pt="Clique em um jogador para aportar sua arma"
                en="Click on a player to aim your gun"
              />
            </h3>
            <p>
              <Translate
                pt={
                  <>
                    Você pode trocar seu alvo {votingCount} vezes. Se você acha que será o alvo, use
                    "Emboscada" para contra-atacar.
                  </>
                }
                en={
                  <>
                    You may change your target {votingCount} times. If you think you are the target, use
                    "Ambush" to counterattack.
                  </>
                }
              />
            </p>
          </>
        )}

        <div className="q-target-cards">
          <PlayerTargetCardButton
            player={user}
            width={targetCardWidth}
            onClick={onSelectTarget}
            target={user.target}
            disabled={isVotingDisabled || isLoading}
            isAmbush
          />
          {playerIds
            .filter((id) => id !== user.id)
            .map((playerId) => (
              <PlayerTargetCardButton
                key={playerId}
                player={players[playerId]}
                width={targetCardWidth}
                target={user.target}
                onClick={onSelectTarget}
                disabled={isVotingDisabled || isLoading}
              />
            ))}
        </div>
      </div>
    </Step>
  );
}
