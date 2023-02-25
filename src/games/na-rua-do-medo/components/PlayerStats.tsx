// Icons
import { HouseIcon } from 'icons/HouseIcon';
import { QuestionIcon } from 'icons/QuestionIcon';
import { TrickOrTreatIcon } from 'icons/TrickOrTreatIcon';
import { WalkIcon } from 'icons/WalkIcon';
// Components
import { AvatarStrip, IconAvatar } from 'components/avatars';
import { FloatingHand, ImageCard } from 'components/cards';
import { Translate } from 'components/language';

type PlayerStatsProps = {
  user: GamePlayer;
  omitDecision?: boolean;
};

export function PlayerStats({ user, omitDecision = false }: PlayerStatsProps) {
  return (
    <FloatingHand title={<Translate pt="Informações" en="Stats" />} icon={<TrickOrTreatIcon />}>
      <div className="n-player-stats">
        <AvatarStrip player={user} withName size="small" />
        <div className="n-player-stats__decision">
          <DecisionIcon decision={user.decision} omitDecision={omitDecision} />
        </div>
        <div className="n-player-stats__container n-player-stats__container--candy">
          <span className="n-player-stats__title">
            <Translate pt="Doces" en="Candy" />
          </span>
          <div className="n-player-stats__count">
            <span className="n-player-stats__count-label">
              <Translate pt="Em mão" en="In hand" />
            </span>
            <span className="n-player-stats__count-value">{user.hand}</span>
          </div>

          <div className="n-player-stats__count">
            <span className="n-player-stats__count-label">
              <Translate pt="Em casa (pontos)" en="At home (points)" />
            </span>
            <span className="n-player-stats__count-value">{user.totalCandy}</span>
          </div>
        </div>

        <div className="n-player-stats__container">
          <span className="n-player-stats__title">
            <Translate pt="Boladas" en="Jackpots" />
          </span>
          {user.jackpots?.length > 0 ? (
            <ul className="n-player-stats__jackpots">
              {user.jackpots.map((jackpot: NCard) => (
                <ImageCard
                  key={jackpot.id}
                  imageId={jackpot.key}
                  cardWidth={60}
                  className="n-player-stats__jackpot"
                />
              ))}
            </ul>
          ) : (
            <div className="n-player-stats__no-jackpot">
              <Translate
                pt="Você não coletou nenhuma bolada até o momento."
                en="You haven't gotten any jackpot yet."
              />
            </div>
          )}
        </div>
      </div>
    </FloatingHand>
  );
}

type DecisionIconProps = {
  decision: NDecision;
  omitDecision: boolean;
};

function DecisionIcon({ decision, omitDecision }: DecisionIconProps) {
  if (omitDecision) {
    return (
      <>
        <IconAvatar icon={<QuestionIcon />} shape="square" />
        <Translate pt="Decida" en="Decide" />
      </>
    );
  }

  return decision === 'CONTINUE' ? (
    <>
      <IconAvatar icon={<WalkIcon />} />
      <Translate pt="Continuando" en="Continuing" />
    </>
  ) : (
    <>
      <IconAvatar icon={<HouseIcon />} />
      <Translate pt="Em casa" en="At home" />
    </>
  );
}
