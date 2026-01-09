// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { TransparentButton } from 'components/buttons';
import { SuspectCard } from 'components/cards/SuspectCard';
import { Popconfirm } from 'components/general/Popconfirm';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { ActingRole, SubmitMovieActorPayload } from '../utils/types';

type ActorsBoardProps = {
  actors: ActingRole['candidates'];
  selection: CardId[];
  user: GamePlayer;
  onSubmitActor: (payload: SubmitMovieActorPayload) => void;
};

export function ActorsBoard({ actors, user, onSubmitActor, selection }: ActorsBoardProps) {
  const cardWidth = useCardWidth(4, {
    gap: 16,
    minWidth: 80,
    maxWidth: 150,
    margin: 16,
  });
  const { isLoading } = useLoading();
  const { language, translate } = useLanguage();

  return (
    <SpaceContainer
      className="actors-board"
      wrap
    >
      {selection.map((actorId) => {
        const actor = actors[actorId];
        const name = actor.name[language];

        return (
          <Popconfirm
            key={actor.id}
            title={translate(
              `Tem certeza que quer escolher ${name}?`,
              `Are you sure you want to choose ${name}?`,
            )}
            onConfirm={() => onSubmitActor({ actorId: actor.id })}
            type="yes-no"
            disabled={isLoading || user.ready}
          >
            <TransparentButton
              className="characters-table__character characters-table__character-button"
              disabled={isLoading || user.ready}
            >
              <SuspectCard
                suspect={actor}
                width={cardWidth}
              />
            </TransparentButton>
          </Popconfirm>
        );
      })}
    </SpaceContainer>
  );
}
