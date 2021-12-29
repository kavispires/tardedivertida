import clsx from 'clsx';
// Design Resources
import { Button, Tag } from 'antd';
// Images
import roundTitleEn from '../../images/round-title-en.svg';
import roundTitlePt from '../../images/round-title-pt.svg';
// Components
import { AvatarName } from '../avatars';
import { TimedButton } from './index';
import { useLanguage } from '../../hooks';
import { translate, Translate } from './Translate';

type Teams = {
  A: TeamObj;
  B: TeamObj;
};
type TeamObj = {
  name: string;
  score: number;
  members: string[];
};

type TeamProps = {
  players: GamePlayers;
  className?: string;
  team: TeamObj;
};

function Team({ team, players, className }: TeamProps) {
  return (
    <div className={className}>
      <h1>
        <Translate pt="Time" en="Team" /> {team.name}
      </h1>
      <ul className="round-announcement__team-members">
        {team.members.map((playerName) => (
          <li key={`team-member-${playerName}`} className="round-announcement__team-member">
            <AvatarName player={players[playerName]} />
          </li>
        ))}
      </ul>
      <Tag className="round-announcement__points" color="blue">
        {team.score}{' '}
        <Translate pt={team.score > 1 ? 'pontos' : 'ponto'} en={team.score > 1 ? 'points' : 'point'} />
      </Tag>
    </div>
  );
}

type RoundAnnouncementProps = {
  round: GameRound;
  onPressButton?: GenericFunction;
  buttonText?: string;
  time: number;
  teams?: Teams;
  players?: Players;
  className?: string;
  children?: any;
  unskippable?: boolean;
};

export function RoundAnnouncement({
  round,
  onPressButton,
  buttonText,
  time = 0,
  teams,
  players,
  className,
  children,
  unskippable = false,
}: RoundAnnouncementProps) {
  const language = useLanguage();

  return (
    <div className={clsx('round-announcement', className)}>
      {Boolean(teams?.A && players) && (
        <Team className="round-announcement__team-left" team={teams!.A} players={players!} />
      )}

      <div className="round-announcement__main">
        <div className="round-announcement__title">
          <img
            src={translate(roundTitlePt, roundTitleEn, language)}
            alt={translate('Rodada', 'Round', language)}
          />
        </div>
        <div className="round-announcement__round-wrapper">
          <div className="round-announcement__circle"></div>
          <div className="round-announcement__number">{round?.current ?? round ?? 0}</div>
        </div>

        {children}

        {Boolean(onPressButton) && !Boolean(time) && (
          <Button type="primary" onClick={onPressButton} className="round-announcement__go-button">
            {buttonText}
          </Button>
        )}

        {Boolean(onPressButton) && Boolean(time) && (
          <TimedButton
            label={buttonText || translate('Prosseguir', 'Continue', language)}
            type="primary"
            onClick={onPressButton}
            onExpire={onPressButton}
            duration={time}
            showTimer
            disabled={unskippable}
          />
        )}
      </div>

      {Boolean(teams?.B && players) && (
        <Team className="round-announcement__team-right" team={teams!.B} players={players!} />
      )}
    </div>
  );
}
