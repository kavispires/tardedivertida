// Design Resources
import { Avatar as AntAvatar, Table } from 'antd';
import { Translate } from '../../shared';

type SectionMetaProps = {
  round: GameRound;
  groupScore?: number;
  pointsToVictory?: number;
  isTeamGame?: boolean;
  teams?: GameTeams;
};

export function SectionMeta({
  round,
  groupScore,
  pointsToVictory,
  isTeamGame = false,
  teams,
}: SectionMetaProps) {
  return (
    <ul className="game-info-drawer__meta">
      <li className="game-info-drawer__meta-item">
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
        <li className="game-info-drawer__meta-item">
          <div className="game-info-drawer__label-inline">
            <Translate pt="Pontos:" en="Points:" />
          </div>
          <AntAvatar className="game-info-drawer__round" size="default" style={{ backgroundColor: 'gold' }}>
            {groupScore ?? 0}
          </AntAvatar>
        </li>
      )}

      {Boolean(teams) && (
        <li className="game-info-drawer__meta-item">
          <div className="game-info-drawer__label-inline">
            <Translate pt="Pontos:" en="Points:" />
          </div>
          <Table
            size="small"
            pagination={false}
            columns={Object.entries(teams!).map(([teamId, teamObj]: [string, GameTeam]) => ({
              title: teamObj?.name ?? teamId,
              dataIndex: teamId,
              key: teamId,
              align: 'center',
            }))}
            dataSource={Object.entries(teams!).reduce(
              (acc: PlainObject[], [teamId, teamObj]: [string, GameTeam]) => {
                acc[0][teamId] = teamObj.score;
                return acc;
              },
              [{}]
            )}
          />
        </li>
      )}

      {Boolean(pointsToVictory) && (
        <div>
          <div className="game-info-drawer__label-inline">
            <Translate
              pt={`Pontos restantes para ${isTeamGame ? 'um time' : 'alguém'} ganhar:`}
              en={`Points left for ${isTeamGame ? 'a team' : 'someone'} to win:`}
            />
          </div>
          <AntAvatar className="game-info-drawer__round" size="small">
            {pointsToVictory}
          </AntAvatar>
        </div>
      )}
    </ul>
  );
}
