// Components
import { AvatarIcon, AvatarName, Instruction, Step, Title, Translate } from '../../components';
import { Pasture } from './Pasture';

type StepQuestionSelectionWaitingProps = {
  activePlayer: GamePlayer;
  players: GamePlayers;
  roundType: number;
  pastureSize: number;
};

export function StepQuestionSelectionWaiting({
  activePlayer,
  players,
  roundType,
  pastureSize,
}: StepQuestionSelectionWaitingProps) {
  return (
    <Step fullWidth className="m-step">
      <Title>
        <AvatarIcon type="animated-clock" size="large" /> <Translate pt="Aguarde..." en="Please wait..." />
      </Title>

      <Instruction contained>
        <AvatarName player={activePlayer} addressUser />{' '}
        <Translate pt="está escolhendo a pergunta da rodada." en="is choosing the question for the round." />
        <br />
      </Instruction>

      <Pasture players={players} pastureSize={pastureSize} roundType={roundType} />
    </Step>
  );
}
