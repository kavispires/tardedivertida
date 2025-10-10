// Types
import type { GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
// Internal
import type { Summary } from '../utils/types';

type SummaryBoxProps = {
  summary: Summary;
  players: GamePlayers;
  round: GameRound;
};

export function SummaryBox({ summary, players, round }: SummaryBoxProps) {
  const playerA = Object.values(players).find((player) => player.side === 'A');
  const playerB = Object.values(players).find((player) => player.side === 'B');

  if (!playerA || !playerB) return null;

  return (
    <div className="cd-summary">
      <div className="cd-summary__entry">
        <div className="cd-summary__number">{round.total - round.current + 1}</div>
        <div className="cd-summary__entry-label">
          <Translate en="Rounds left" pt="Rodadas restantes" />
        </div>
      </div>

      <div className="cd-summary__entry">
        <div className="cd-summary__number cd-summary__number--left">{summary.deliverablesLeft}</div>
        <div className="cd-summary__entry-label">
          <Translate en="Items left" pt="Itens restantes" />
        </div>
      </div>

      <div className="cd-summary__entry">
        <div className="cd-summary__number cd-summary__number--A">{summary.deliverablesLeftForA}</div>
        <div className="cd-summary__entry-label">
          <PlayerAvatarName player={playerA} />
        </div>
      </div>

      <div className="cd-summary__entry">
        <div className="cd-summary__number cd-summary__number--B">{summary.deliverablesLeftForB}</div>
        <div className="cd-summary__entry-label">
          <PlayerAvatarName player={playerB} />
        </div>
      </div>
    </div>
  );
}
