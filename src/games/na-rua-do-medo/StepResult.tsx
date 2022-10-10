// Hooks
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { PlayersDecisionList } from './components/PlayersDecisionList';
import { PlayersDecisionResult } from './components/PlayersDecisionResult';
import { PlayerStats } from './components/PlayerStats';
import { Street } from './components/Street';
import { CardCountExplanation } from './components/RulesBlobs';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { AdminNextPhaseButton } from 'components/admin';

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
      <Title>
        <Translate pt="Decisões" en="Decisions" />
      </Title>

      <PopoverRule content={<CardCountExplanation />} />

      <PlayersDecisionResult
        players={players}
        goingHomePlayerIds={goingHomePlayerIds}
        continuingPlayerIds={continuingPlayerIds}
        cashedInCandy={cashedInCandy}
        candyInHand={candyInHand}
      />

      <Street street={street} currentCard={currentCard} candySidewalk={candySidewalk} />

      {alreadyAtHomePlayerIds.length > 0 && (
        <PlayersDecisionList playersIdsList={alreadyAtHomePlayerIds} type="home" players={players} />
      )}

      <AdminNextPhaseButton autoTriggerTime={315}>
        <Translate pt="Próxima Casa" en="Next House" />
      </AdminNextPhaseButton>

      <PlayerStats user={user} />
    </Step>
  );
}
