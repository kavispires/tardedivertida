import { useMemo } from 'react';
// Ant Design Resources
import { Avatar as AntAvatar, Space } from 'antd';
// Components
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { TimedButton } from 'components/buttons';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Avatar } from 'components/avatars';
import { Pair } from './components/Pair';

type StepResultProps = {
  players: GamePlayers;
  gallery: DuetosGalleryEntry[];
  leftOut: LefOutEntry[];
  pool: ItemEntry[];
  goToNextStep: GenericFunction;
} & AnnouncementProps;

export function StepResult({ announcement, pool, goToNextStep, gallery, leftOut, players }: StepResultProps) {
  const galleryMatches = useMemo(() => gallery.filter((entry) => entry.players.length > 1), [gallery]);
  const galleryNoMatches = useMemo(() => gallery.filter((entry) => entry.players.length === 1), [gallery]);

  return (
    <Step fullWidth announcement={announcement}>
      <Title size="small">
        <Translate pt="Resultado" en="Results" />
      </Title>

      <Title size="xx-small">
        <Translate pt="Pares Vencedores" en="Winnings Pairs" />
      </Title>

      <RuleInstruction type="scoring">
        <Translate
          pt={
            <>
              Você ganha <PointsHighlight>pontos</PointsHighlight> por cada jogador que fez o mesmo par que
              você!
            </>
          }
          en={
            <>
              You get <PointsHighlight>points</PointsHighlight> for each player who did the same pair than
              you!
            </>
          }
        />
      </RuleInstruction>

      <Space wrap className="space-container">
        {galleryMatches.length === 0 && (
          <RuleInstruction type="event">
            <Translate pt="Ninguém deu match!" en="Nobody matched anything" />
          </RuleInstruction>
        )}
        {galleryMatches.map((entry, index) => {
          return (
            <Space key={entry.pairId} className="pairs-grid__pair space-container" direction="vertical">
              <Space className="space-container">
                <AntAvatar.Group maxCount={7}>
                  {entry.players.map((playerId) => (
                    <Avatar
                      id={players[playerId].avatarId}
                      key={`${entry.pairId}-${playerId}`}
                      size="small"
                    />
                  ))}
                </AntAvatar.Group>
              </Space>

              <Pair
                index={index % 6}
                placeholder={pool[0]}
                firstItem={entry.pair[0]}
                secondItem={entry.pair[1]}
              />
            </Space>
          );
        })}
      </Space>

      {leftOut.length > 1 && (
        <>
          <Title size="xx-small">
            <Translate pt="Sobras Vencedoras" en="Left Out Matches" />
          </Title>

          <RuleInstruction type="scoring">
            <Translate
              pt={
                <>
                  Para o item que ficou sobrando, você também ganha <PointsHighlight>pontos</PointsHighlight>{' '}
                  por cada jogador que deixou de fora o mesmo item que você!
                </>
              }
              en={
                <>
                  For the item that was left over, you also get <PointsHighlight>points</PointsHighlight> for
                  each player who left out the same item as you!
                </>
              }
            />
          </RuleInstruction>

          <Space wrap className="space-container">
            {leftOut.map((entry, index) => {
              return (
                <Space key={entry.id} className="results" direction="vertical">
                  <Space className="space-container">
                    <AntAvatar.Group maxCount={7}>
                      {entry.players.map((playerId) => (
                        <Avatar
                          id={players[playerId].avatarId}
                          key={`${entry.id}-${playerId}`}
                          size="small"
                        />
                      ))}
                    </AntAvatar.Group>
                  </Space>

                  <Pair index={index % 6} placeholder={pool[0]} firstItem={entry.item} />
                </Space>
              );
            })}
          </Space>
        </>
      )}

      <Space className="space-container" align="center">
        <TimedButton duration={45} onExpire={goToNextStep} onClick={goToNextStep}>
          <Translate pt="Ver Ranking" en="See Ranking" />
        </TimedButton>
      </Space>

      {galleryNoMatches.length > 0 && (
        <>
          <Title size="xx-small">
            <Translate pt="Pares que não deram match" en="Pairs that didn't match" />
          </Title>

          <Space wrap className="space-container">
            {galleryNoMatches.map((entry, index) => {
              return (
                <Space key={entry.pairId} className="pairs-grid__pair space-container" direction="vertical">
                  <Space className="space-container">
                    <AntAvatar.Group maxCount={7}>
                      {entry.players.map((playerId) => (
                        <Avatar
                          id={players[playerId].avatarId}
                          key={`${entry.pairId}-${playerId}`}
                          size="small"
                        />
                      ))}
                    </AntAvatar.Group>
                  </Space>

                  <Pair
                    index={index % 6}
                    placeholder={pool[0]}
                    firstItem={entry.pair[0]}
                    secondItem={entry.pair[1]}
                  />
                </Space>
              );
            })}
          </Space>
        </>
      )}
    </Step>
  );
}
