import clsx from 'clsx';
// Design Resources
import { Button, Tag } from 'antd';
// Images
import roundTitleEn from 'images/round-title-en.svg';
import roundTitlePt from 'images/round-title-pt.svg';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Hooks
import { useLanguage } from 'hooks';
// Components
import { AvatarName, TimedButton, Translate } from 'components';

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
  circleColor?: Color;
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
  circleColor = 'yellow',
}: RoundAnnouncementProps) {
  const { translate } = useLanguage();

  return (
    <div className={clsx('round-announcement', className)}>
      {Boolean(teams?.A && players) && (
        <Team className="round-announcement__team-left" team={teams!.A} players={players!} />
      )}

      <div className="round-announcement__main">
        <div className="round-announcement__title">
          <img src={translate(roundTitlePt, roundTitleEn)} alt={translate('Rodada', 'Round')} />
        </div>
        <div className={clsx('round-announcement__round-wrapper', getAnimationClass('zoomIn'))}>
          <div className={clsx('round-announcement__circle', `color-border--${circleColor}`)}></div>
          <div className={clsx('round-announcement__circle-2', `color-border--${circleColor}`)}></div>
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
            label={buttonText || translate('Prosseguir', 'Continue')}
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
