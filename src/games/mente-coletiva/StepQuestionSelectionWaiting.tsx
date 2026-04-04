// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Components
import { Translate } from 'components/language/Translate';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { Step, type StepProps } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
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
    <Step
      fullWidth
      className="m-step"
      announcement={announcement}
    >
      <StepTitle wait>
        <Translate
          pt="Aguarde..."
          en="Please wait..."
        />
      </StepTitle>

      <RuleInstruction type="wait">
        <PlayerAvatarName
          player={activePlayer}
          addressUser
        />{' '}
        <Translate
          pt="está escolhendo a pergunta da rodada."
          en="is choosing the question for the round."
        />
        <br />
      </RuleInstruction>

      <Pasture
        players={players}
        pastureSize={pastureSize}
        roundType={roundType}
      />
    </Step>
  );
}
