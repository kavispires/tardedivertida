import { useState } from 'react';
// Ant Design Resources
import { InputNumber, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { LodgeIcon } from 'icons/LodgeIcon';
// Components
import { SendButton } from 'components/buttons/SendButton';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { SpaceFloat } from 'components/layout/SpaceFloat';
// Internal
import type { Lodge, SubmitBetsPayload } from '../utils/types';
import { LODGE_COLORS, SKIER_BET_TYPES } from '../utils/constants';
import { ChipsHighlight } from './Highlights';
import { BettingChipValue } from './BettingChipValue';

type SkierBetsProps = {
  /**
   * Array of lodge objects
   */
  lodges: Lodge[];
  /**
   * Callback function to submit bets
   */
  onSubmitBets?: (payload: SubmitBetsPayload) => void;
  /**
   * Current user player object
   */
  user: GamePlayer;
  /**
   * Type of bet being placed
   */
  betType: string;
};

export function SkierBets({ lodges, user, onSubmitBets, betType }: SkierBetsProps) {
  const [bets, setBets] = useState(
    lodges.reduce((acc: Dictionary<number>, lodge) => {
      acc[lodge.id] = 0;
      return acc;
    }, {}),
  );
  const [chipsLeft, setChipsLeft] = useState(user.chips ?? 0);
  const lodgeWidth = useCardWidth(6, { gap: 16, margin: 32, maxWidth: 150 });

  return (
    <SpaceContainer orientation="vertical">
      <div className="skier-bets">
        {lodges.map((lodge) => (
          <div
            key={lodge.id}
            className="lodge"
            style={{ width: lodgeWidth }}
          >
            <div className="lodge__icon">
              <LodgeIcon
                width={lodgeWidth / 3}
                color={LODGE_COLORS[lodge.id]}
              />
              <span className="lodge__number">{lodge.id + 1}</span>
            </div>

            <div className="lodge__bets">
              {user[SKIER_BET_TYPES.SKIERS_BETS] !== undefined && (
                <div className="lodge__bet">
                  <BettingChipValue
                    title={
                      <Translate
                        pt="Apostas iniciais"
                        en="Initial Bets"
                      />
                    }
                    value={user[SKIER_BET_TYPES.SKIERS_BETS][lodge.id] ?? 0}
                  />
                </div>
              )}
              {user[SKIER_BET_TYPES.SKIERS_BOOST] !== undefined && (
                <div className="lodge__bet">
                  <BettingChipValue
                    title={
                      <Translate
                        pt="Apostas de bônus"
                        en="Bonus Bets"
                      />
                    }
                    value={user[SKIER_BET_TYPES.SKIERS_BOOST][lodge.id] ?? 0}
                  />
                </div>
              )}
            </div>
            {onSubmitBets && (
              <div className="lodge__bet">
                <InputNumber
                  style={{ width: '100%' }}
                  type="number"
                  value={bets[lodge.id]}
                  min={0}
                  max={bets[lodge.id] + chipsLeft}
                  onChange={(value) => {
                    const bet = value as number;
                    const diff = bet - bets[lodge.id];
                    if (chipsLeft - diff >= 0) {
                      setBets({ ...bets, [lodge.id]: bet });
                      setChipsLeft(chipsLeft - diff);
                    }
                  }}
                  suffix={
                    <Translate
                      pt="fichas"
                      en="chips"
                    />
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {onSubmitBets && (
        <SpaceFloat enabled={chipsLeft === 0}>
          <Tooltip
            title={
              <Translate
                pt="Fichas restantes a serem usadas"
                en="Remaining chips to be used"
              />
            }
          >
            <div>
              <ChipsHighlight>{chipsLeft}</ChipsHighlight>
            </div>
          </Tooltip>
          <SendButton
            size="large"
            onClick={() => onSubmitBets({ bets, betType })}
            disabled={chipsLeft > 0}
          >
            <Translate
              pt="Enviar apostas"
              en="Send bets"
            />
          </SendButton>
        </SpaceFloat>
      )}
    </SpaceContainer>
  );
}
