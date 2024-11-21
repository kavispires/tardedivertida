// Types
import type { GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { CandySidewalk, StreetCard } from './utils/types';
import { PlayerStats } from './components/PlayerStats';
import { Street } from './components/Street';
import { CardCountExplanation } from './components/RulesBlobs';
import { PlayersDecisionState } from './components/PlayersDecisionState';

type StepStreetEndProps = {
  street: StreetCard[];
  currentCard: StreetCard;
  candySidewalk: CandySidewalk;
  user: GamePlayer;
  isDoubleHorror: boolean;
  round: GameRound;
  players: GamePlayers;
  alreadyAtHomePlayerIds: PlayerId[];
  goingHomePlayerIds: PlayerId[];
  continuingPlayerIds: PlayerId[];
  candyInHand: number;
} & Pick<StepProps, 'announcement'>;

export function StepStreetEnd({
  street,
  currentCard,
  candySidewalk,
  user,
  isDoubleHorror,
  round,
  players,
  alreadyAtHomePlayerIds,
  goingHomePlayerIds,
  continuingPlayerIds,
  candyInHand,
  announcement,
}: StepStreetEndProps) {
  const { language } = useLanguage();

  const monsterName = currentCard?.name?.[language] ?? '';

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="medium">
        {isDoubleHorror ? (
          <Translate
            pt={<>Um segundo {monsterName} surgiu do nada!</>}
            en={<>A second {monsterName} came out of nowhere!</>}
          />
        ) : (
          <Translate pt="Todo mundo voltou pra casa..." en="Everybody went back home for now..." />
        )}
      </Title>

      <PopoverRule content={<CardCountExplanation />} />

      <RuleInstruction type={isDoubleHorror ? 'alert' : 'event'}>
        {isDoubleHorror && (
          <>
            <Translate
              pt={<>Jogamos todos os doces pra cima e corremos desesperados pra casa!</>}
              en={<>We threw all candy in the air and ran desperately home!</>}
            />
            <br />
          </>
        )}
        {round.current < round.total && monsterName && (
          <>
            <Translate
              pt={<>Uma carta do {monsterName} será removida, menos chances dele aparece novamente!</>}
              en={<>One of the {monsterName} will be removed, so less chances of it showing up again!</>}
            />
            <br />
          </>
        )}

        {round.current === round.total ? (
          <Translate
            pt="E a noite chegou ao fim... Hora de comer gostosuras!"
            en="And the night is over... Time to eat candy!"
          />
        ) : (
          <Translate pt="Próxima rua?" en="Let's hit the next street?" />
        )}
      </RuleInstruction>

      <PlayersDecisionState
        players={players}
        goingHomePlayerIds={[]}
        continuingPlayerIds={continuingPlayerIds}
        alreadyAtHomePlayerIds={[...goingHomePlayerIds, ...alreadyAtHomePlayerIds]}
        cashedInCandy={0}
        candyInHand={candyInHand}
        phase="STREET_END"
      />

      <Street street={street} currentCard={currentCard} candySidewalk={candySidewalk} />

      <HostNextPhaseButton>
        {round.current < round.total ? <Translate pt="Próxima Casa" en="Next House" /> : 'Game Over'}
      </HostNextPhaseButton>

      <PlayerStats user={user} />
    </Step>
  );
}
