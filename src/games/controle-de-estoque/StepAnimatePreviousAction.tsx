// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { BossIdeaCard } from 'types/tdr';
// Icons
import { BossIdeaIcon } from 'icons/BossIdeaIcon';
// Components
import { TimedButton } from 'components/buttons/TimedButton';
import { HostNextPhaseButton } from 'components/host/HostNextPhaseButton';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PlayersTurnOrder } from 'components/players/PlayersTurnOrder';
import { Step, type StepProps } from 'components/steps/Step';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { Event, Good, Status, WarehouseSlot } from './utils/types';
import { BOSS_IDEAS_IDS, OUTCOME } from './utils/constants';
import { Warehouse } from './components/Warehouse';

type StepAnimatePreviousActionProps = {
  players: GamePlayers;
  user: GamePlayer;
  bossIdea: BossIdeaCard;
  goodsDict: Dictionary<Good>;
  warehouse: WarehouseSlot[];
  previousSupervisor?: GamePlayer;
  status: Status;
  currentGoodId: UID;
  event: Event;
  turnOrder: TurnOrder;
  goToNextStep: () => void;
} & Pick<StepProps, 'announcement'>;

export function StepAnimatePreviousAction({
  players,
  announcement,
  bossIdea,
  status,
  goodsDict,
  warehouse,
  event,
  turnOrder,
  goToNextStep,
}: StepAnimatePreviousActionProps) {
  const duration = bossIdea.id === BOSS_IDEAS_IDS.BLIND_BOX ? 15 : 9;
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle icon={<BossIdeaIcon />}>
        <DualTranslate>{bossIdea.title}</DualTranslate>
      </StepTitle>

      <RuleInstruction type="event">
        <Translate
          pt="Embalar os produtos os deixam protegidos!"
          en="Storing the packed goods keeps them protected!"
        />
      </RuleInstruction>

      <Warehouse
        goodsDict={goodsDict}
        warehouse={warehouse}
        event={event}
        bossIdeaId={bossIdea.id}
      />

      <SpaceContainer>
        {status.outcome !== OUTCOME.END_PHASE ? (
          <TimedButton
            type="primary"
            duration={duration}
            disabled
            onExpire={() => goToNextStep()}
          >
            <Translate
              pt="Continuando em..."
              en="Continuing in..."
            />
          </TimedButton>
        ) : (
          <HostNextPhaseButton
            withWaitingTimeBar
            autoTriggerTime={duration}
          >
            <Translate
              en="Go to Fulfillment Phase"
              pt="Ir para a Fase de Atendimento"
            />
          </HostNextPhaseButton>
        )}
      </SpaceContainer>

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
      />
    </Step>
  );
}
