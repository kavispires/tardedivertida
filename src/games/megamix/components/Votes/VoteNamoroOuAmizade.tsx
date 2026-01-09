// Components
import { PlayerAvatar } from 'components/avatars';
// Internal
import type { VoteComponentProps } from '../../utils/types';
import { SpacePlayerCheckWrapper } from '../SpacePlayerCheckWrapper';
import { Candidate } from '../Candidate';

export function VoteNamoroOuAmizade({ track, playersList }: VoteComponentProps) {
  return (
    <SpacePlayerCheckWrapper
      playersList={playersList}
      paths={['data.value']}
    >
      {playersList.map((player) => {
        const index = track.data.heads.findIndex((head: PlainObject) => head.id === player.data.value);
        return (
          <div
            key={`vote-${player.id}`}
            className="player-vote"
          >
            <PlayerAvatar avatarId={player.avatarId} />
            <div>{player.name}</div>
            {index > -1 && (
              <Candidate
                key={`date-${player.id}`}
                head={track.data.heads[index]}
                body={track.data.bodies[index]}
                interest={track.data.interests[index]}
                need={track.data.needs[index]}
                funFact={track.data.funFacts[index]}
              />
            )}
          </div>
        );
      })}
    </SpacePlayerCheckWrapper>
  );
}
