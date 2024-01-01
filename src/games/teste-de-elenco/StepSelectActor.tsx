// Types
import type { ActingRole, FeatureFilm, SubmitMovieActorPayload } from './utils/types';
// Hooks
import { useMock } from 'hooks/useMock';
// Utils
import { getRandomItem } from 'utils/helpers';
// Components
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { ActorsBoard } from './components/ActorsBoard';
import { RoleBoard } from './components/RoleBoard';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { CastSummary } from './components/CastSummary';

type StepSelectActorProps = {
  user: GamePlayer;
  activeRole: ActingRole;
  onSubmitActor: (payload: SubmitMovieActorPayload) => void;
  movie: FeatureFilm;
} & AnnouncementProps;

export function StepSelectActor({
  user,
  announcement,
  activeRole,
  onSubmitActor,
  movie,
}: StepSelectActorProps) {
  useMock(() => {
    onSubmitActor({ actorId: getRandomItem(activeRole.selection) });
  });

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="x-small">
        <Translate pt={<>Selecione um ator!</>} en={<>Cast a role:</>} />
      </Title>

      <RoleBoard activeRole={activeRole} instruction="SELECT" movie={movie} />

      <ActorsBoard
        actors={activeRole.candidates}
        selection={activeRole.selection}
        user={user}
        onSubmitActor={onSubmitActor}
      />

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Se um ator receber mais de 50% dos votos, ele será escolhido para o papel!
              <br />
              Caso contrário, o papel vai o final da fila e vamos reselecioná-lo na próxima rodada.
              <br />
              Você ganha <PointsHighlight>1</PointsHighlight> por cada jogador que escolher o mesmo ator que
              você.
            </>
          }
          en={
            <>
              If an actor receives more than 50% of the votes, he will be chosen for the role!
              <br />
              Otherwise, the role goes to the end of the queue and we will reselect it in the next round.
              <br />
              You earn <PointsHighlight>1</PointsHighlight> for each player who chooses the same actor as you.
            </>
          }
        />
      </RuleInstruction>

      <CastSummary movie={movie} />
    </Step>
  );
}
