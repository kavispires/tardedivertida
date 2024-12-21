import { type ReactNode, useMemo } from 'react';
// Ant Design Resources
import { Progress } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { Translate } from 'components/language';
import { TurnOrder, WaitingRoom } from 'components/players';
import { Step } from 'components/steps';

type GuesserWaitingRoomProps = {
  players: GamePlayers;
  instructionSuffix: {
    pt: string;
    en: string;
  };
  announcement?: ReactNode;
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
  }, [phase]);

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
    'Please wait while the other players',
  );

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
