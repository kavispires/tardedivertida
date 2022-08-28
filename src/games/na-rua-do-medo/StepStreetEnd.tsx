// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { PlayerStats } from './components/PlayerStats';
import { Street } from './components/Street';
import { CardCountExplanation } from './components/RulesBlobs';
import { PlayersDecisionList } from './components/PlayersDecisionList';
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { AdminNextPhaseButton } from 'components/admin';

type StepStreetEndProps = {
  street: NStreet;
  currentCard: NCard;
  candySidewalk: CandySidewalk;
  user: GamePlayer;
  isDoubleHorror: boolean;
  round: GameRound;
  players: GamePlayers;
  alreadyAtHomePlayerIds: PlayerId[];
};

export function StepStreetEnd({
  street,
  currentCard,
  candySidewalk,
  user,
  isDoubleHorror,
  round,
  players,
  alreadyAtHomePlayerIds,
}: StepStreetEndProps) {
  const { language } = useLanguage();

  const monsterName = currentCard?.name?.[language] ?? '';

  return (
    <Step fullWidth>
      <Title>
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

      <Instruction contained>
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
          </>
        )}
        <br />
        {round.current === round.total ? (
          <Translate
            pt="E a noite chegou ao fim... Hora de comer gostosuras!"
            en="And the night is over... Time to eat candy!"
          />
        ) : (
          <Translate pt="Próxima rua?" en="Let's hit the next street?" />
        )}
      </Instruction>
      <Street street={street} currentCard={currentCard} candySidewalk={candySidewalk} />

      <PlayersDecisionList
        playersIdsList={isDoubleHorror ? alreadyAtHomePlayerIds : Object.keys(players)}
        type="home"
        players={players}
      />

      <AdminNextPhaseButton>
        {round.current < round.total ? <Translate pt="Próxima Casa" en="Next House" /> : 'Game Over'}
      </AdminNextPhaseButton>

      <PlayerStats user={user} />
    </Step>
  );
}
