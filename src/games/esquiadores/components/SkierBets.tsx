import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
// Ant Design Resources
import { InputNumber } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { SubmitBetsPayload } from '../utils/types';
import { SKIER_BET_TYPES } from '../utils/constants';
import { ChipsHighlight } from './Highlights';
import { BettingChipValue } from './BettingChipValue';

type SkierBetsProps = {
  players: GamePlayers;
  onSubmitBets?: (payload: SubmitBetsPayload) => void;
  user: GamePlayer;
  betType: string;
};

export function SkierBets({ players, user, onSubmitBets, betType }: SkierBetsProps) {
  const playersList = useMemo(
    () =>
      orderBy(
        Object.values(players).filter((player) => player.id !== user.id),
        ['name'],
        ['asc'],
      ),
    [players, user.id],
  );

  const [bets, setBets] = useState(
    playersList.reduce((acc: NumberDictionary, player) => {
      acc[player.id] = 0;
      return acc;
    }, {}),
  );
  const [chipsLeft, setChipsLeft] = useState(user.chips ?? 0);

  return (
    <SpaceContainer orientation="vertical">
      <div className="skier-bets">
        {playersList.map((player) => (
          <div
            key={player.id}
            className="lodge"
          >
            <div className="lodge__icon">
              <PlayerAvatarName player={player} />
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
                    value={user[SKIER_BET_TYPES.SKIERS_BETS][player.id] ?? 0}
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
                    value={user[SKIER_BET_TYPES.SKIERS_BOOST][player.id] ?? 0}
                  />
                </div>
              )}
            </div>
            {onSubmitBets && (
              <div className="lodge__bet">
                <InputNumber
                  style={{ width: '100%' }}
                  type="number"
                  value={bets[player.id]}
                  min={0}
                  max={bets[player.id] + chipsLeft}
                  onChange={(value) => {
                    const bet = value as number;
                    const diff = bet - bets[player.id];
                    if (chipsLeft - diff >= 0) {
                      setBets({ ...bets, [player.id]: bet });
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
        <SpaceContainer>
          <ChipsHighlight>{chipsLeft}</ChipsHighlight>
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
        </SpaceContainer>
      )}
    </SpaceContainer>
  );
}
