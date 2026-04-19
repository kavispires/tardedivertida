// Types
import type { GamePlayer } from 'types/game';
// Icons
import { LodgeIcon } from 'icons/LodgeIcon';
// Components
import { Translate } from 'components/language/Translate';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { Lodge } from '../utils/types';
import { LODGE_COLORS } from '../utils/constants';
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
          <div
            key={lodge.id}
            className="lodge"
            style={{ width: 84 }}
          >
            <div className="lodge__icon">
              <LodgeIcon
                width={64}
                color={LODGE_COLORS[lodge.id]}
              />
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
  /**
   * Current user player object
   */
  user: GamePlayer;
  /**
   * Array of lodge objects
   */
  lodges: Lodge[];
};

export function CurrentSkierBets({ lodges, user }: CurrentSkierBetsProps) {
  return (
    <TitledContainer
      title={
        <Translate
          pt="Suas apostas"
          en="Your bets"
        />
      }
    >
      <div className="skier-bets">
        {lodges.map((lodge) => (
          <div
            key={lodge.id}
            className="lodge"
          >
            <div className="lodge__icon">
              <LodgeIcon
                width={48}
                color={LODGE_COLORS[lodge.id]}
              />
              <span className="lodge__number">{lodge.id + 1}</span>
            </div>

            <div className="lodge__bets">
              {user.skiersBets !== undefined && (
                <div className="lodge__bet">
                  <BettingChipValue
                    title={
                      <Translate
                        pt="Apostas iniciais"
                        en="Initial Bets"
                      />
                    }
                    value={user.skiersBets[lodge.id] ?? 0}
                  />
                </div>
              )}
              {user.skiersBoost !== undefined && (
                <div className="lodge__bet">
                  <BettingChipValue
                    title={
                      <Translate
                        pt="Apostas de bônus"
                        en="Bonus Bets"
                      />
                    }
                    value={user.skiersBoost[lodge.id] ?? 0}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </TitledContainer>
  );
}
