// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';
import { TurnOrder, WaitingRoom } from 'components/players';
import { Step } from 'components/steps';
import { Progress } from 'antd';
import { useMemo } from 'react';
import { PHASES } from 'utils/phases';

type GuesserWaitingRoomProps = {
  players: GamePlayers;
  instructionSuffix: {
    pt: string;
    en: string;
  };
  announcement?: JSX.Element;
  phase: string;
  turnOrder: TurnOrder;
  guesser: GamePlayer;
};

export function GuesserWaitingRoom({
  players,
  instructionSuffix,
  announcement,
  phase,
  turnOrder,
  guesser,
}: GuesserWaitingRoomProps) {
  const { language, translate } = useLanguage();

  const initialProgress = useMemo(() => {
    if (phase === PHASES.UE_SO_ISSO.WORD_SELECTION) {
      return 0;
    }

    if (phase === PHASES.UE_SO_ISSO.SUGGEST) {
      return 45;
    }

    return 90;
  }, []); // eslint-disable-line

  const additionalPercentage = useMemo(() => {
    if (phase === PHASES.UE_SO_ISSO.COMPARE) {
      return 0;
    }
    const playerCount = Object.keys(players).length;
    const readyPlayers = Object.values(players).reduce((sum, player) => {
      return sum + (player.ready ? 1 : 0);
    }, 0);

    return (45 * readyPlayers) / playerCount;
  }, [players, phase]);

  const instructionPrefix = translate(
    'Aguarde enquanto os outros jogadores',
    'Please wait while the other players'
  );
  console.log({ additionalPercentage });
  console.log('percentage', initialProgress + additionalPercentage, '%');

  return (
    <Step fullWidth announcement={announcement}>
      <WaitingRoom
        players={players}
        title={`${instructionPrefix} ${instructionSuffix[language]}.`}
        instruction={<Translate pt="Você é o(a) adivinhador(a)" en="You're the guesser" />}
      >
        <TurnOrder players={players} order={turnOrder} activePlayerId={guesser.id} />
        <Progress percent={initialProgress + additionalPercentage} status="active" showInfo={false} />
      </WaitingRoom>
    </Step>
  );
}
