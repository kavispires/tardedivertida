import clsx from 'clsx';
// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { PlayerStats } from './components/PlayerStats';
import { Street } from './components/Street';
import { CardCountExplanation } from './components/RulesBlobs';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { VIPNextPhaseButton } from 'components/vip';
import { PlayersDecisionState } from './components/PlayersDecisionState';

type StepResultProps = {
  players: GamePlayers;
  street: NStreet;
  currentCard: NCard;
  candySidewalk: CandySidewalk;
  cashedInCandy: number;
  user: GamePlayer;
  alreadyAtHomePlayerIds: PlayerId[];
  continuingPlayerIds: PlayerId[];
  goingHomePlayerIds: PlayerId[];
  candyInHand: number;
};

export function StepResult({
  players,
  street,
  currentCard,
  candySidewalk,
  user,
  cashedInCandy,
  alreadyAtHomePlayerIds,
  continuingPlayerIds,
  goingHomePlayerIds,
  candyInHand,
}: StepResultProps) {
  useTemporarilyHidePlayersBar();

  return (
    <Step fullWidth>
      <Title size="medium" white className={clsx('n-title', getAnimationClass('fadeIn'))} level={2}>
        <Translate pt="Decisões" en="Decisions" />:
      </Title>

      <Title
        size="small"
        white
        level={3}
        className={clsx('n-subtitle', getAnimationClass('fadeIn', { delay: 1 }))}
      >
        {goingHomePlayerIds.length === 0 && (
          <Translate pt="Todos continuaram..." en="Everybody will continue..." />
        )}

        {goingHomePlayerIds.length === 1 && (
          <Translate pt="Olha o cagão voltando pra casa..." en="Look at this scared cat going back home..." />
        )}
        {goingHomePlayerIds.length > 1 && (
          <Translate
            pt="Olha os cagões voltando pra casa..."
            en="Look at these scared cats going back home..."
          />
        )}
      </Title>

      <PopoverRule content={<CardCountExplanation />} />

      <PlayersDecisionState
        players={players}
        goingHomePlayerIds={goingHomePlayerIds ?? []}
        continuingPlayerIds={continuingPlayerIds}
        alreadyAtHomePlayerIds={alreadyAtHomePlayerIds ?? []}
        cashedInCandy={cashedInCandy}
        candyInHand={candyInHand}
        phase="RESULT"
      />

      <Street street={street} currentCard={currentCard} candySidewalk={candySidewalk} />

      <VIPNextPhaseButton autoTriggerTime={10}>
        <Translate pt="Próxima Casa" en="Next House" />
      </VIPNextPhaseButton>

      <PlayerStats user={user} />
    </Step>
  );
}
