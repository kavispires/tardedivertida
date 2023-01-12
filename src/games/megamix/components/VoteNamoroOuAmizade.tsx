// Components
import { Avatar } from 'components/avatars';
import { SpacePlayerCheckWrapper } from './SpacePlayerCheckWrapper';
import { Candidate } from './TaskNamoroOuAmizade';

export function VoteNamoroOuAmizade({ task, players, playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper playersList={playersList} paths={['data.value']}>
      {playersList.map((player) => {
        const index = task.data.heads.findIndex((head: PlainObject) => head.id === player.data.value);
        return (
          <div key={`vote-${player.id}`} className="player-vote">
            <Avatar id={player.avatarId} />
            <div>{player.name}</div>
            {index > -1 && (
              <Candidate
                key={`date-${player.id}`}
                head={task.data.heads[index]}
                body={task.data.bodies[index]}
                interest={task.data.interests[index]}
                need={task.data.needs[index]}
                funFact={task.data.funFacts[index]}
              />
            )}
          </div>
        );
      })}
    </SpacePlayerCheckWrapper>
  );
}
