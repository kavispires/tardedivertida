import { useMemo } from 'react';
// Ant Design Resources
import { TrophyOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Hooks
import type { UseStep } from '@hooks/useStep';
// Components
import { TimedButton } from '@components/buttons/TimedButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatar } from '@components/player/PlayerAvatar';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
import { Title } from '@components/text/Title';
// Internal
import type { DuetosGalleryEntry, ItemData, LeftOutEntry } from './utils/types';
import { Pair } from './components/Pair';

type StepResultProps = {
  players: GamePlayers;
  gallery: DuetosGalleryEntry[];
  leftOut: LeftOutEntry[];
  pool: ItemData[];
  goToNextStep: UseStep['goToNextStep'];
} & Pick<StepProps, 'announcement'>;

export function StepResult({ announcement, pool, goToNextStep, gallery, leftOut, players }: StepResultProps) {
  const galleryMatches = useMemo(() => gallery.filter((entry) => entry.players.length > 1), [gallery]);
  const galleryNoMatches = useMemo(() => gallery.filter((entry) => entry.players.length === 1), [gallery]);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Resultado"
          en="Results"
        />
      </StepTitle>
      <Title size="xx-small">
        <Translate
          pt="Pares Vencedores"
          en="Winnings Pairs"
        />
      </Title>
      {galleryMatches.length > 0 && (
        <RuleInstruction type="scoring">
          <Translate
            pt="Você ganha {points} por cada jogador que fez o mesmo par que você!"
            en="You get {points} for each player who did the same pair than you!"
            values={{ points: <PointsHighlight value="pontos" /> }}
          />
        </RuleInstruction>
      )}

      <SpaceContainer wrap>
        {galleryMatches.length === 0 && (
          <RuleInstruction type="event">
            <Translate
              pt="Ninguém deu match!"
              en="Nobody matched anything!"
            />
          </RuleInstruction>
        )}
        {galleryMatches.map((entry, index) => {
          return (
            <SpaceContainer
              key={entry.pairId}
              className="pairs-grid__pair"
              vertical
            >
              <SpaceContainer>
                <Avatar.Group max={{ count: 7 }}>
                  {entry.players.map((playerId) => (
                    <PlayerAvatar
                      avatarId={players[playerId].avatarId}
                      key={`${entry.pairId}-${playerId}`}
                      size="small"
                    />
                  ))}
                </Avatar.Group>
              </SpaceContainer>

              <Pair
                index={index % 6}
                placeholder={pool[0]}
                firstItem={entry.pair[0]}
                secondItem={entry.pair[1]}
              />
            </SpaceContainer>
          );
        })}
      </SpaceContainer>
      {leftOut.length > 1 && (
        <>
          <Title size="xx-small">
            <Translate
              pt="Sobras Vencedoras"
              en="Left Out Matches"
            />
          </Title>

          <RuleInstruction type="scoring">
            <Translate
              pt="Para o item que ficou sobrando, você também ganha {points} por cada jogador que deixou de fora o mesmo item que você!"
              en="For the item that was left over, you also get {points} for each player who left out the same item as you!"
              values={{ points: <PointsHighlight value="pontos" /> }}
            />
          </RuleInstruction>

          <SpaceContainer
            wrap
            style={{ alignItems: 'flex-start' }}
          >
            {leftOut.map((entry, index) => {
              return (
                <Space
                  key={entry.id}
                  className="results"
                  orientation="vertical"
                >
                  <SpaceContainer>
                    <Avatar.Group max={{ count: 7 }}>
                      {entry.players.map((playerId) => (
                        <PlayerAvatar
                          avatarId={players[playerId].avatarId}
                          key={`${entry.id}-${playerId}`}
                          size="small"
                        />
                      ))}
                    </Avatar.Group>
                  </SpaceContainer>

                  <Pair
                    index={index % 6}
                    placeholder={pool[0]}
                    firstItem={entry.item}
                  />
                </Space>
              );
            })}
          </SpaceContainer>
        </>
      )}
      <SpaceContainer>
        <TimedButton
          duration={45}
          onExpire={goToNextStep}
          onClick={goToNextStep}
          icon={<TrophyOutlined />}
        >
          <Translate
            pt="Ver Ranking"
            en="See Ranking"
          />
        </TimedButton>
      </SpaceContainer>
      {galleryNoMatches.length > 0 && (
        <>
          <Title size="xx-small">
            <Translate
              pt="Pares que não deram match"
              en="Pairs that didn't match"
            />
          </Title>

          <SpaceContainer
            wrap
            style={{ alignItems: 'flex-start' }}
          >
            {galleryNoMatches.map((entry, index) => {
              return (
                <SpaceContainer
                  key={entry.pairId}
                  className="pairs-grid__pair"
                  vertical
                >
                  <SpaceContainer>
                    <Avatar.Group max={{ count: 7 }}>
                      {entry.players.map((playerId) => (
                        <PlayerAvatar
                          avatarId={players[playerId].avatarId}
                          key={`${entry.pairId}-${playerId}`}
                          size="small"
                        />
                      ))}
                    </Avatar.Group>
                  </SpaceContainer>

                  <Pair
                    index={index % 6}
                    placeholder={pool[0]}
                    firstItem={entry.pair[0]}
                    secondItem={entry.pair[1]}
                  />
                </SpaceContainer>
              );
            })}
          </SpaceContainer>
        </>
      )}
    </Step>
  );
}
