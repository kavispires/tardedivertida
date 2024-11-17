// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Icons
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
// Components
import { AvatarName, IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import { Pasture } from './components/Pasture';

type StepQuestionSelectionWaitingProps = {
  activePlayer: GamePlayer;
  players: GamePlayers;
  roundType: number;
  pastureSize: number;
} & Pick<StepProps, 'announcement'>;

export function StepQuestionSelectionWaiting({
  announcement,
  activePlayer,
  players,
  roundType,
  pastureSize,
}: StepQuestionSelectionWaitingProps) {
  return (
    <Step fullWidth className="m-step" announcement={announcement}>
      <Title icon={<IconAvatar icon={<AnimatedClockIcon />} size="large" />}>
        <Translate pt="Aguarde..." en="Please wait..." />
      </Title>

      <RuleInstruction type="wait">
        <AvatarName player={activePlayer} addressUser />{' '}
        <Translate pt="está escolhendo a pergunta da rodada." en="is choosing the question for the round." />
        <br />
      </RuleInstruction>

      <Pasture players={players} pastureSize={pastureSize} roundType={roundType} />
    </Step>
  );
}
