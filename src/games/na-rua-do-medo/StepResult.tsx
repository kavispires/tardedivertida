// Hooks
import { useLanguage } from 'hooks';
// Components

import { PlayersDecisionList } from './PlayersDecisionList';
import { PlayersDecisionResult } from './PlayersDecisionResult';
import { PlayerStats } from './PlayerStats';
import { Street } from './Street';
import { CardCountExplanation } from './RulesBlobs';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { AdminNextRoundButton } from 'components/admin';

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
  const { translate } = useLanguage();
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

      <AdminNextRoundButton buttonText={translate('Próxima Casa', 'Next House')} />

      <PlayerStats user={user} />
    </Step>
  );
}
