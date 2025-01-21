// Ant Design Resources
import { UnorderedListOutlined } from '@ant-design/icons';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import type { UseStep } from 'hooks/useStep';
// Components
import { AvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { PhaseBetsState } from './utils/types';
import { BET_TYPES } from './utils/constants';
import { Mountain } from './components/Mountain';
import { Lodges } from './components/Lodges';

type StepResultsProps = {
  players: GamePlayers;
  user: GamePlayer;
  turnOrder: GameOrder;
  skier: GamePlayer;
  mountain: PhaseBetsState['mountain'];
  lodges: PhaseBetsState['lodges'];
  betType: string;
  animateFrom: number;
  animateTo: 'left' | 'right' | null;
  goToNextStep?: UseStep['goToNextStep'];
} & Pick<StepProps, 'announcement'>;

export function StepResults({
  announcement,
  players,
  turnOrder,
  user,
  skier,
  mountain,
  lodges,
  betType,
  animateFrom,
  animateTo,
  goToNextStep,
}: StepResultsProps) {
  let showLevel = 0;
  if (betType === BET_TYPES.BOOST) {
    showLevel = 1;
  }
  if (betType === BET_TYPES.FINAL) {
    showLevel = 2;
  }

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Uhuuuuu!" en="Weeeeeeeee" />
      </StepTitle>

      <RuleInstruction type="event">
        {betType === 'initial' && (
          <Translate
            pt={
              <>
                E <AvatarName player={skier} /> desceu a primeira descida...
              </>
            }
            en={
              <>
                And <AvatarName player={skier} /> finished the first slope...
              </>
            }
          />
        )}
        {betType === 'boost' && (
          <Translate
            pt={
              <>
                E lá vai <AvatarName player={skier} /> de novo...
              </>
            }
            en={
              <>
                And there goes <AvatarName player={skier} /> again...
              </>
            }
          />
        )}
        {betType === 'final' && (
          <Translate
            pt={
              <>
                <AvatarName player={skier} /> finalizou a descida e foi para uma cabana.
              </>
            }
            en={
              <>
                <AvatarName player={skier} /> finished the slope and went to a lodge.
              </>
            }
          />
        )}
      </RuleInstruction>

      {betType !== 'final' && (
        <HostNextPhaseButton withWaitingTimeBar autoTriggerTime={15}>
          Next
        </HostNextPhaseButton>
      )}

      <Mountain
        mountain={mountain}
        skier={skier}
        animateFrom={animateFrom}
        animateTo={animateTo}
        betType={betType}
        showLevel={showLevel}
      />

      <Lodges lodges={lodges} players={players} user={user} betType={betType} />

      {betType === 'final' && (
        <SpaceContainer>
          <TimedButton
            duration={12}
            onExpire={goToNextStep}
            onClick={goToNextStep}
            icon={<UnorderedListOutlined />}
          >
            <Translate pt="Ver Ranking" en="See Ranking" />
          </TimedButton>
        </SpaceContainer>
      )}

      <TurnOrder players={players} order={turnOrder} activePlayerId={skier.id} />
    </Step>
  );
}
