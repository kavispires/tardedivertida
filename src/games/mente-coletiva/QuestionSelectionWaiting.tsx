// Components
import { AvatarIcon, AvatarName, Instruction, Title, Translate } from '../../components';
import { Pasture } from './Pasture';
import { RoundType } from './RoundType';

type QuestionSelectionWaitingProps = {
  activePlayer: GamePlayer;
  players: GamePlayers;
  roundType: number;
};

export function QuestionSelectionWaiting({
  activePlayer,
  players,
  roundType,
}: QuestionSelectionWaitingProps) {
  return (
    <div className="m-step">
      <Title>
        <AvatarIcon type="animated-clock" size="large" /> <Translate pt="Aguarde..." en="Please wait..." />
      </Title>

      <RoundType roundType={roundType} />

      <Instruction contained>
        <AvatarName player={activePlayer} addressUser />{' '}
        <Translate pt="está escolhendo a pergunta da rodada." en="is choosing the question for the round." />
        <br />
      </Instruction>

      <Pasture players={players} />
    </div>
  );
}
