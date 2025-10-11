// Ant Design Resources
import { Avatar } from 'antd';
// Types
import type { MostVotesResult } from 'types/game';
import type { GamePlayers } from 'types/player';
// Components
import { PlayerAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { ExtendedObjectFeatureCard } from '../utils/types';
import { ObjectFeature } from './ObjectFeature';

type VotesProps = {
  votes: MostVotesResult[];
  features: Dictionary<ExtendedObjectFeatureCard>;
  players: GamePlayers;
};

export function Votes({ votes, players, features }: VotesProps) {
  return (
    <TitledContainer title={<Translate pt="Votos" en="Votes" />}>
      <div className="voting-track" style={{ gridTemplateColumns: `repeat(${votes.length}, 1fr)` }}>
        {votes.map((entry, index) => (
          <div key={index} className="voting-track__item">
            <ObjectFeature feature={features[entry.value]} width={32} />

            <Avatar.Group max={{ count: 5 }}>
              {entry.votes.map((playerId) => (
                <PlayerAvatar
                  key={playerId}
                  avatarId={players[playerId].avatarId}
                  alt={players[playerId].name}
                  size="small"
                />
              ))}
            </Avatar.Group>
          </div>
        ))}
      </div>
    </TitledContainer>
  );
}
