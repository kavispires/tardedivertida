// Hooks
import { useLanguage } from '../../hooks';
// Components
import { Icons, Instruction, ReadyPlayersBar, Title, Translate } from '..';

type WaitingRoomProps = {
  players: GamePlayers;
  title?: any;
  instruction?: any;
  children?: any;
};

export function WaitingRoom({ players, title, instruction, children }: WaitingRoomProps) {
  const { translate } = useLanguage();
  return (
    <div className="waiting-room">
      <Title>{translate('Pronto!', 'Done!', title)}</Title>
      <Icons.WaitingRoom style={{ width: '6rem' }} />
      <Instruction>
        {Boolean(instruction) ? (
          instruction
        ) : (
          <Translate pt="Vamos aguardar os outros jogadores!" en="Please wait for the other players!" />
        )}
      </Instruction>
      {children}
      <ReadyPlayersBar players={players} />
    </div>
  );
}