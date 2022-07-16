// Components

import { AvatarName } from 'components/avatars';
import { AnimatedClockIcon } from 'components/icons/AnimatedClockIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Pasture } from './components/Pasture';

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
        <IconAvatar icon={<AnimatedClockIcon />} size="large" />{' '}
        <Translate pt="Aguarde..." en="Please wait..." />
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
