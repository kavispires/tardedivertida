import type { GamePlayer, GamePlayers } from 'types/player';
import type { Lodge } from '../utils/types';
import { LodgeIcon } from 'icons/LodgeIcon';
import { LODGE_COLORS } from '../utils/constants';
import { useMemo } from 'react';
import { orderBy } from 'lodash';
import { AvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { Container } from 'components/layout/Container';
import { BettingChipValue } from './BettingChipValue';

type CurrentBetsProps = {
  lodges: Lodge[];
  user: GamePlayer;
  betType: string;
};

export function CurrentBets({ lodges, user, betType }: CurrentBetsProps) {
  return (
    <div className="lodges">
      {lodges.map((lodge) => {
        const value = user?.[betType]?.[lodge.id] ?? 0;
        const total = user?.bets?.[lodge.id] ?? 0;
        return (
          <div key={lodge.id} className="lodge" style={{ width: 84 }}>
            <div className="lodge__icon">
              <LodgeIcon width={64} color={LODGE_COLORS[lodge.id]} />
              <span className="lodge__number">{lodge.id + 1}</span>
            </div>
            <div className="lodge__bet">
              <BettingChipValue value={total} />

              <BettingChipValue value={value} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type CurrentSkierBetsProps = {
  user: GamePlayer;
  players: GamePlayers;
};

export function CurrentSkierBets({ players, user }: CurrentSkierBetsProps) {
  const playersList = useMemo(
    () =>
      orderBy(
        Object.values(players).filter((player) => player.id !== user.id),
        ['name'],
        ['asc'],
      ),
    [players, user.id],
  );

  return (
    <Container title={<Translate pt="Suas apostas" en="Your bets" />}>
      <div className="skier-bets">
        {playersList.map((player) => (
          <div key={player.id} className="lodge">
            <div className="lodge__icon">
              <AvatarName player={player} />
            </div>

            <div className="lodge__bets">
              {user.skierBets !== undefined && (
                <div className="lodge__bet">
                  <BettingChipValue
                    title={<Translate pt="Apostas iniciais" en="Initial Bets" />}
                    value={user.skierBets[player.id] ?? 0}
                  />
                </div>
              )}
              {user.skiersBoost !== undefined && (
                <div className="lodge__bet">
                  <BettingChipValue
                    title={<Translate pt="Apostas de bônus" en="Bonus Bets" />}
                    value={user.skiersBoost[player.id] ?? 0}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
