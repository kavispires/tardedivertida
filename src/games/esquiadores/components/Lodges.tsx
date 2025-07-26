import { useState } from 'react';
// Ant Design Resources
import { InputNumber, Tooltip } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { GamblingChipIcon } from 'icons/GamblingChipIcon';
import { LodgeIcon } from 'icons/LodgeIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { AvatarGroup } from 'components/avatars/AvatarGroup';
import { SendButton } from 'components/buttons';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Internal
import type { Lodge, SubmitBetsPayload } from '../utils/types';
import { LODGE_COLORS } from '../utils/constants';
import { ChipsHighlight } from './Highlights';
import { BettingChipValue } from './BettingChipValue';

type LodgesProps = {
  lodges: Lodge[];
  players: GamePlayers;
  onSubmitBets?: (payload: SubmitBetsPayload) => void;
  user: GamePlayer;
  betType: string;
};

export function Lodges({ lodges, players, user, onSubmitBets, betType }: LodgesProps) {
  const lodgeWidth = useCardWidth(6, { gap: 32, margin: 64, maxWidth: 175 });
  const [bets, setBets] = useState(
    lodges.reduce((acc: NumberDictionary, lodge) => {
      acc[lodge.id] = 0;
      return acc;
    }, {}),
  );
  const [chipsLeft, setChipsLeft] = useState(user.chips ?? 0);

  return (
    <SpaceContainer direction="vertical">
      <div className="lodges">
        {lodges.map((lodge) => (
          <div key={lodge.id} className="lodge" style={{ width: lodgeWidth }}>
            <div className="lodge__icon">
              <LodgeIcon width={lodgeWidth / 3} color={LODGE_COLORS[lodge.id]} />
              <span className="lodge__number">{lodge.id + 1}</span>
            </div>

            <div className="lodge__players">
              <Tooltip
                title={
                  <Translate pt="Jogadores que apostaram nessa cabana" en="Players who bet on this lodge" />
                }
              >
                <IconAvatar icon={<GamblingChipIcon />} size="small" />
              </Tooltip>
              <AvatarGroup
                list={lodge.playersIds.map((pId) => players[pId])}
                size="small"
                user={user}
                maxCount={6}
              />
            </div>
            <div className="lodge__bets">
              {user.initial !== undefined && (
                <div className="lodge__bet">
                  <BettingChipValue
                    title={<Translate pt="Apostas iniciais" en="Initial Bets" />}
                    value={user.initial[lodge.id] ?? 0}
                  />
                </div>
              )}
              {user.boost !== undefined && (
                <div className="lodge__bet">
                  <BettingChipValue
                    title={<Translate pt="Apostas de bônus" en="Bonus Bets" />}
                    value={user.boost[lodge.id] ?? 0}
                  />
                </div>
              )}
              {user.final !== undefined && (
                <div className="lodge__bet">
                  <BettingChipValue
                    title={<Translate pt="Apostas finais" en="Final Bets" />}
                    value={user.final[lodge.id] ?? 0}
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
                  suffix={<Translate pt="fichas" en="chips" />}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {onSubmitBets && (
        <SpaceContainer>
          <ChipsHighlight>{chipsLeft}</ChipsHighlight>
          <SendButton size="large" onClick={() => onSubmitBets({ bets, betType })} disabled={chipsLeft > 0}>
            <Translate pt="Enviar apostas" en="Send bets" />
          </SendButton>
        </SpaceContainer>
      )}
    </SpaceContainer>
  );
}
