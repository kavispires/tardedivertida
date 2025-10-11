// Ant Design Resources
import { Avatar } from 'antd';
// Types
import type { GameRound } from 'types/game';
// Components
import { Translate } from 'components/language';

type SectionMetaProps = {
  round: GameRound;
  groupScore?: number;
};

export function SectionMeta({ round, groupScore }: SectionMetaProps) {
  return (
    <ul className="game-info-drawer__meta">
      <li>
        <div className="game-info-drawer__label-inline">
          <Translate pt="Rodada:" en="Round:" />
        </div>
        <Avatar className="game-info-drawer__round" size="small">
          {round.current}
        </Avatar>
        <span className="game-info-drawer__inline-separator">
          <Translate pt="de" en="out of" />
        </span>
        <Avatar className="game-info-drawer__round" size="small">
          {round.total}
        </Avatar>
      </li>

      {Boolean(groupScore) && (
        <li>
          <div className="game-info-drawer__label-inline">
            <Translate pt="Pontos:" en="Points:" />
          </div>
          <Avatar
            className="game-info-drawer__round"
            size="default"
            style={{ backgroundColor: 'gold', color: 'black' }}
          >
            {groupScore}
          </Avatar>
        </li>
      )}
    </ul>
  );
}
