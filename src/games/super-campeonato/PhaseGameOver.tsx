// Ant Design Resources
import { Badge, Divider, Space } from 'antd';
// Types
import type { PhaseProps } from 'types/game';
// Utils
import { getAvatarColorById } from '@utils/helpers';
// Icons
import { TrophyIcon } from '@icons/TrophyIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { CharacterCard } from '@components/cards/CharacterCard';
import { TextCard } from '@components/cards/TextCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { GameOverWrapper } from '@components/results/GameOverWrapper';
import { Title } from '@components/text/Title';
// Internal
import type { PastBattles } from './utils/type';
import { achievementsReference } from './utils/achievements';

export function PhaseGameOver({ state, players }: PhaseProps) {
  const pastBattles: PastBattles = state.pastBattles;

  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
    >
      <Title
        size="xx-small"
        className="padding"
      >
        <Translate
          pt="Campeão Ultimate"
          en="Ultimate Champion"
        />
      </Title>

      <SpaceContainer className="margin">
        <CharacterCard
          size={200}
          overlayColor="yellow"
          character={state.finalWinner}
        />
      </SpaceContainer>

      <Divider />

      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <Divider />

      <Title
        size="xx-small"
        className="padding"
      >
        <Translate
          pt="Resumo das Batalhas"
          en="Battles Summary"
        />
      </Title>

      <SpaceContainer className="margin">
        {pastBattles.map((battle, index) => {
          return (
            <Space
              orientation="vertical"
              key={battle.challenge.id}
              align="center"
              className="final-gallery"
            >
              <TextCard
                header={
                  <>
                    <Translate
                      en="Battle"
                      pt="Batalha"
                    />{' '}
                    {index + 1}
                  </>
                }
                color="purple"
                className="final-gallery__card"
              >
                {battle.challenge.text}
              </TextCard>
              {battle.contenders.map((contender, index) =>
                contender.playerId === 'CPU' ? (
                  <CharacterCard
                    key={`${battle.challenge.id}-${contender.id}`}
                    size={80}
                    overlayColor={index === 0 ? 'yellow' : 'gray'}
                    character={contender}
                    className="final-gallery__contender"
                  />
                ) : (
                  <Badge.Ribbon
                    key={`${battle.challenge.id}-${contender.id}`}
                    color={getAvatarColorById(players[contender.playerId]?.avatarId)}
                    styles={{ indicator: { zIndex: 30, padding: 0 } }}
                    text={
                      <PlayerAvatar
                        avatarId={players[contender.playerId]?.avatarId}
                        size="small"
                        alt={players[contender.playerId]?.name}
                      />
                    }
                  >
                    <CharacterCard
                      size={80}
                      overlayColor={index === 0 ? 'yellow' : 'gray'}
                      character={contender}
                      className="final-gallery__contender"
                    />
                  </Badge.Ribbon>
                ),
              )}
            </Space>
          );
        })}
      </SpaceContainer>
    </GameOverWrapper>
  );
}
