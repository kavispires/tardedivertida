// Ant Design Resources
import { Avatar as AntAvatar } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import type { UseStep } from 'hooks/useStep';
import { useTemporarilyHidePlayersBar } from 'hooks/useTemporarilyHidePlayersBar';
// Components
import { PlayerAvatar, PlayerAvatarName, NPCPlayerAvatar } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { ImageBlurButton, ImageCard } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { PopoverRule } from 'components/rules';
import { Step, type StepProps } from 'components/steps';
import { StepTitle } from 'components/text';
// Internal
import type { TableEntry } from './utils/types';
import { ScoringRules } from './components/RulesBlobs';
import { BookPages } from '../../components/game/BookPages';

type StepResolutionProps = {
  players: GamePlayers;
  story: string;
  storyteller: GamePlayer;
  table: TableEntry[];
  goToNextStep: UseStep['goToNextStep'];
} & Pick<StepProps, 'announcement'>;

export function StepResolution({
  players,
  story,
  storyteller,
  table,
  goToNextStep,
  announcement,
}: StepResolutionProps) {
  useTemporarilyHidePlayersBar();

  const cardWidth = useCardWidth(10, { minWidth: 75 });

  const solution = table.find((entry) => entry.playerId === storyteller.id);
  const otherCards = table.filter((entry) => entry.playerId !== storyteller.id);

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate pt="Solução" en="Solution" />
      </StepTitle>
      <PopoverRule content={<ScoringRules storyteller={storyteller} />} />

      <div className="c-story-book">
        <BookPages
          leftPage={
            <div className="c-story-book__selected-card">
              {solution && (
                <>
                  <ImageCard cardId={solution.cardId} cardWidth={160} />
                  <ImageBlurButton cardId={solution.cardId} />
                </>
              )}
            </div>
          }
          rightPage={
            <div className="c-story-book__solution">
              <p>
                <Translate pt="Era uma vez..." en="Once upon a time..." />
              </p>
              <p className="c-story-book__story">{story}</p>

              <div>
                <Translate pt="Votaram corretamente:" en="Voted correctly:" />
                <ul className="c-story-book__correct-players">
                  {solution?.votes
                    ?.filter((entry) => entry !== storyteller.id)
                    .map((playerId) => {
                      return (
                        <li key={`correct-vote-player-${playerId}`}>
                          <PlayerAvatarName player={players[playerId]} size="small" />
                        </li>
                      );
                    })}
                  {(solution?.votes?.length ?? 0) < 2 && (
                    <li className="c-story-book__nobody">
                      <Translate pt="Vixi, ninguém acertou..." en="Well, nobody got it..." />
                    </li>
                  )}
                </ul>
              </div>
            </div>
          }
        />
      </div>
      <ul className="c-other-cards">
        {otherCards.map((cardEntry: TableEntry, index) => {
          return (
            <li className="c-other-cards__entry" key={`other-card-votes-${cardEntry.playerId}-${index}`}>
              <div className="c-other-cards__player">
                {cardEntry.playerId === 'NPC' ? (
                  <NPCPlayerAvatar size="small" />
                ) : (
                  <PlayerAvatarName player={players[cardEntry.playerId]} size="small" />
                )}
              </div>

              <ImageCard cardId={cardEntry.cardId} cardWidth={cardWidth} className={'c-other-cards__card'} />
              <ImageBlurButton cardId={cardEntry.cardId} />

              <div className="c-other-cards__votes">
                <AntAvatar.Group size="small">
                  {(cardEntry?.votes ?? []).map((votePlayerId) => {
                    return (
                      <PlayerAvatar
                        avatarId={players[votePlayerId].avatarId}
                        key={`incorrect-vote-player-${votePlayerId}`}
                      />
                    );
                  })}
                </AntAvatar.Group>
              </div>
            </li>
          );
        })}
      </ul>
      <SpaceContainer>
        <TimedButton onClick={goToNextStep} onExpire={goToNextStep} duration={20}>
          <Translate pt="Continuar" en="Continue" />
        </TimedButton>
      </SpaceContainer>
    </Step>
  );
}
