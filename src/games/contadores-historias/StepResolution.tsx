// Ant Design Resources
import { Avatar as AntAvatar, Space } from 'antd';
// Hooks
import { useCardWidth } from 'hooks';
// Components
import { Avatar, AvatarName, AvatarNPC } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { ImageBlurButton, ImageCard } from 'components/cards';
import { Translate } from 'components/language';
import { PopoverRule } from 'components/rules';
import { Step } from 'components/steps';
import { Title } from 'components/text';
import { BookPages } from './components/BookPages';
import { ScoringRules } from './components/RulesBlobs';

type StepResolutionProps = {
  players: GamePlayers;
  story: string;
  storyteller: GamePlayer;
  table: TableEntry[];
  goToNextStep: GenericFunction;
};

export function StepResolution({ players, story, storyteller, table, goToNextStep }: StepResolutionProps) {
  const cardWidth = useCardWidth(10, 32, 75);

  const solution = table.find((entry) => entry.playerId === storyteller.id);
  const otherCards = table.filter((entry) => entry.playerId !== storyteller.id);

  return (
    <Step fullWidth className="c-step-play-card">
      <Title>
        <Translate pt="Solução" en="Solution" />
      </Title>
      <PopoverRule content={<ScoringRules storyteller={storyteller} />} />

      <div className="c-story-book">
        <BookPages
          leftPage={
            <div className="c-story-book__selected-card">
              {solution && <ImageCard imageId={solution.cardId} cardWidth={175} />}
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
                  {solution &&
                    solution
                      .votes!.filter((entry) => entry !== storyteller.id)
                      .map((playerId) => {
                        return (
                          <li key={`correct-vote-player-${playerId}`}>
                            <AvatarName player={players[playerId]} size="small" />
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
                  <AvatarNPC size="small" />
                ) : (
                  <AvatarName player={players[cardEntry.playerId]} size="small" />
                )}
              </div>

              <ImageCard imageId={cardEntry.cardId} cardWidth={cardWidth} className={'c-other-cards__card'} />
              <ImageBlurButton cardId={cardEntry.cardId} />

              <div className="c-other-cards__votes">
                <AntAvatar.Group size="small">
                  {(cardEntry?.votes ?? []).map((votePlayerId) => {
                    return (
                      <Avatar
                        id={players[votePlayerId].avatarId}
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
      <Space className="space-container" align="center">
        <TimedButton onClick={goToNextStep} onExpire={goToNextStep} duration={20}>
          <Translate pt="Continuar" en="Continue" />
        </TimedButton>
      </Space>
    </Step>
  );
}
