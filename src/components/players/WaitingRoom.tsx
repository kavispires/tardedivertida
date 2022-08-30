// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { Translate } from 'components/language';
import { ReadyPlayersBar } from 'components/players';
import { Instruction, Title } from 'components/text';
import { WaitingRoomIcon } from 'components/icons/WaitingRoomIcon';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';

type WaitingRoomProps = {
  players: GamePlayers;
  title?: any;
  instruction?: any;
  children?: any;
};

export function WaitingRoom({ players, title, instruction, children }: WaitingRoomProps) {
  useTemporarilyHidePlayersBar();

  const { translate } = useLanguage();

  return (
    <div className="waiting-room">
      <Title>{translate('Pronto!', 'Done!', title)}</Title>
      <WaitingRoomIcon style={{ width: '6rem' }} />
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
