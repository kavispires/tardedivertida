// Hooks
import { useLanguage } from '../../hooks';
// Components
import { AdminNextRoundButton, Instruction, Step, Title, Translate } from '../../components';
import { PlayerStats } from './PlayerStats';
import { Street } from './Street';

type StepStreetEndProps = {
  street: NStreet;
  currentCard: NCard;
  candySidewalk: CandySidewalk;
  totalCandyInSidewalk: number;
  user: GamePlayer;
  isDoubleHorror: boolean;
  round: GameRound;
};

export function StepStreetEnd({
  street,
  currentCard,
  candySidewalk,
  user,
  totalCandyInSidewalk,
  isDoubleHorror,
  round,
}: StepStreetEndProps) {
  const { language, translate } = useLanguage();
  const monsterName = currentCard.name[language];
  return (
    <Step fullWidth>
      <Title>
        {isDoubleHorror ? (
          <Translate
            pt={<>Um segundo {monsterName} surgiu do nada!</>}
            en={<>A second {monsterName} came out of nowhere!</>}
          />
        ) : (
          <Translate pt="Todo mundo voltou pra casa" en="Everybody went back home for now" />
        )}
      </Title>
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
        {round.current < round.total ? (
          <>
            <Translate
              pt={<>Uma carta do {monsterName} será removida, menos chances dele aparece novamente!</>}
              en={<>One of the {monsterName} will be removed, so less chances of it showing up again!</>}
            />
            <br />
            <Translate pt="Prontos pra próxima rua?" en="Ready for the next street?" />
          </>
        ) : (
          <Translate
            pt="E a noite chegou ao fim... Hora de comer gostosuras!"
            en="And the night is over... Time to eat candy!"
          />
        )}
      </Instruction>
      <Street street={street} currentCard={currentCard} candySidewalk={candySidewalk} />
      <PlayerStats user={user} />
      <AdminNextRoundButton
        buttonText={round.current < round.total ? translate('Próxima Casa', 'Next House') : 'Game Over'}
      />
    </Step>
  );
}
