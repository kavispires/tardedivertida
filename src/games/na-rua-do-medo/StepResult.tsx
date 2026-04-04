import clsx from 'clsx';
// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { HostNextPhaseButton } from 'components/host/HostNextPhaseButton';
import { Translate } from 'components/language/Translate';
import { PopoverRule } from 'components/rules/PopoverRule';
import { Step } from 'components/steps/Step';
import { StepTitle } from 'components/text/StepTitle';
import { Title } from 'components/text/Title';
// Internal
import type { CandySidewalk, StreetCard } from './utils/types';
import { PlayerStats } from './components/PlayerStats';
import { Street } from './components/Street';
import { CardCountExplanation } from './components/RulesBlobs';
import { PlayersDecisionState } from './components/PlayersDecisionState';

type StepResultProps = {
  players: GamePlayers;
  street: StreetCard[];
  currentCard?: StreetCard;
  candySidewalk: CandySidewalk;
  cashedInCandy: number;
  user: GamePlayer;
  alreadyAtHomePlayerIds: UID[];
  continuingPlayerIds: UID[];
  goingHomePlayerIds: UID[];
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
  return (
    <Step
      fullWidth
      hidePlayersBar
    >
      <StepTitle
        className={clsx('n-title', getAnimationClass('fadeIn'))}
        level={2}
      >
        <Translate
          pt="Decisões"
          en="Decisions"
        />
        :
      </StepTitle>

      <Title
        size="small"
        level={3}
        className={clsx('n-subtitle', getAnimationClass('fadeIn', { delay: 1 }))}
      >
        {goingHomePlayerIds.length === 0 && (
          <Translate
            pt="Todos continuaram..."
            en="Everybody will continue..."
          />
        )}

        {goingHomePlayerIds.length === 1 && (
          <Translate
            pt="Olha o cagão voltando pra casa..."
            en="Look at this scared cat going back home..."
          />
        )}
        {goingHomePlayerIds.length > 1 && (
          <Translate
            pt="Olha os cagões voltando pra casa..."
            en="Look at these scared cats going back home..."
          />
        )}
      </Title>

      <HostNextPhaseButton
        autoTriggerTime={7}
        withWaitingTimeBar
      >
        <Translate
          pt="Próxima Casa"
          en="Next House"
        />
      </HostNextPhaseButton>

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

      <Street
        street={street}
        currentCard={currentCard}
        candySidewalk={candySidewalk}
      />

      <PlayerStats user={user} />
    </Step>
  );
}
