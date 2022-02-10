// Components
import { Instruction, Translate } from '../../components';
import { CandyCount } from './CandyCount';

type DecisionExplanationProps = {
  user: GamePlayer;
  totalCandyInSidewalk: number;
};

export function DecisionExplanation({ user, totalCandyInSidewalk }: DecisionExplanationProps) {
  const isThereAnyCandy = Boolean(user.hand + totalCandyInSidewalk);

  return (
    <Instruction contained>
      {isThereAnyCandy ? (
        <Translate
          pt={
            <>
              Se você voltar pra sua casa você come todos os doces em mãos{' '}
              <CandyCount candyCount={user.hand} /> e divide os doces ainda na rua{' '}
              <CandyCount candyCount={totalCandyInSidewalk} /> com os jogadores que também decidirem voltar.
            </>
          }
          en={
            <>
              If you go back home you cash in all your candy in hand <CandyCount candyCount={user.hand} /> and
              divide all candy still in the street <CandyCount candyCount={totalCandyInSidewalk} /> with other
              players who also decide to go back.
            </>
          }
        />
      ) : (
        <Translate
          pt="Não tem doce nenhum ainda, então, melhor simplesmente continuar!"
          en="There's no candy yet, so why not just continue?"
        />
      )}
      <br />

      <Translate
        pt="Lembre-se que se dois monstros iguais aparecerem, todos entram em pânico, derrubam todos os doces em mãos e correm pra casa."
        en="Remember that if two of the same monster show up, you lose all candy in hand because you freaked out, dropped everything, and ran home."
      />
    </Instruction>
  );
}
