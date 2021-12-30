// Components
import { SectionTeamPlayers } from './SectionTeamPlayers';

type SectionTeamsProps = {
  players: GamePlayers;
  teams: GameTeams;
};

export function SectionTeams({ players, teams }: SectionTeamsProps) {
  return (
    <div className="game-info-drawer__team-players">
      {Object.values(teams).map((team) => (
        <SectionTeamPlayers key={team.name} team={team} players={players} />
      ))}
    </div>
  );
}
