// Ant Design Resources
import { Avatar as AntAvatar } from 'antd';
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
        <AntAvatar className="game-info-drawer__round" size="small">
          {round.current}
        </AntAvatar>
        <span className="game-info-drawer__inline-separator">
          <Translate pt="de" en="out of" />
        </span>
        <AntAvatar className="game-info-drawer__round" size="small">
          {round.total}
        </AntAvatar>
      </li>

      {Boolean(groupScore) && (
        <li>
          <div className="game-info-drawer__label-inline">
            <Translate pt="Pontos:" en="Points:" />
          </div>
          <AntAvatar
            className="game-info-drawer__round"
            size="default"
            style={{ backgroundColor: 'gold', color: 'black' }}
          >
            {groupScore}
          </AntAvatar>
        </li>
      )}
    </ul>
  );
}
