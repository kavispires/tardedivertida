import { useMemo } from 'react';
// Ant Design Resources
import { Button, Space, Typography } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers } from 'types/player';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { Container } from 'components/general/Container';
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { TurnOrder } from 'components/players';
import { Step } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import { CityLocationsDict, GalleryEntry } from './utils/types';
import { LocationCard } from './components/LocationCard';

type StepResultsProps = {
  players: GamePlayers;
  round: GameRound;
  onGoBack: () => void;
  isLastRound?: boolean;
  groupScore: number;
  correct: number;
  status: 'CONTINUE' | 'PERFECT';
  placements: number;
  cityLocationsDict: CityLocationsDict;
  gallery: GalleryEntry[];
  gameOrder: GameOrder;
  controllerId: PlayerId;
};

export function StepResults({
  players,
  onGoBack,
  round,
  status,
  correct,
  placements,
  gallery,
  cityLocationsDict,
  gameOrder,
  controllerId,
  groupScore,
}: StepResultsProps) {
  const correctProjects = useMemo(() => gallery.filter((entry) => entry.result === 'CORRECT'), [gallery]);
  const incorrectProjects = useMemo(() => gallery.filter((entry) => entry.result === 'INCORRECT'), [gallery]);
  const constructionWidth = useCardWidth(placements + 5, { maxWidth: 256 });

  return (
    <Step fullWidth>
      <Title size="small">
        <Translate pt="Resultado" en="Summary" />
      </Title>

      <RuleInstruction type="scoring">
        <Translate
          pt={
            <>
              O grupo ganha um ponto por cada projeto construído corretamente.
              <br />
              Nessa rodada, ganhamos <PointsHighlight>{correct}</PointsHighlight>. Total{' '}
              <PointsHighlight>{groupScore}</PointsHighlight>.
            </>
          }
          en={
            <>
              The group earns one point for each project built correctly.
              <br />
              This round, we earned <PointsHighlight>{correct}</PointsHighlight>. Total{' '}
              <PointsHighlight>{groupScore}</PointsHighlight>.
            </>
          }
        />
      </RuleInstruction>

      <Container title={<Translate pt="Projetos Corretos" en="Correct Projects" />}>
        {correctProjects.map((galleryEntry) => (
          <LocationCard
            key={galleryEntry.locationId}
            locationId={galleryEntry.locationId}
            cityLocationsDict={cityLocationsDict}
            width={constructionWidth}
            fontSize="small"
          />
        ))}
        {correctProjects.length === 0 && (
          <Typography.Text>
            <Translate pt="Nenhum projeto construído corretamente" en="No project built correctly" />
          </Typography.Text>
        )}
      </Container>

      {incorrectProjects.length > 0 && (
        <Container title={<Translate pt="Projetos Incorretos" en="Incorrect Projects" />}>
          {incorrectProjects.map((galleryEntry) => (
            <LocationCard
              key={galleryEntry.locationId}
              locationId={galleryEntry.locationId}
              cityLocationsDict={cityLocationsDict}
              width={constructionWidth}
              fontSize="small"
            />
          ))}
        </Container>
      )}

      {incorrectProjects.length > 0 && (
        <RuleInstruction type="event">
          <Translate
            pt="Quando um projeto não foi construído corretamente, o prefeito coloca o projeto em uma localização diagonal aleatória, fazendo o jogo ficar mais difícil."
            en="When a project was not built correctly, the mayor places the project in a random diagonal location, making the game more difficult."
          />
        </RuleInstruction>
      )}

      {status === 'PERFECT' && (
        <RuleInstruction type="event">
          <Translate
            pt={
              <>
                Todos os projetos foram construídos corretamente! Parabéns!
                <br />A partir de agora, serão {placements} projetos por rodada.
                <br />
                <PointsHighlight>1 ponto</PointsHighlight> extra!
              </>
            }
            en={
              <>
                All projects were built correctly! Congratulations!
                <br />
                From now on, there will be {placements} projects per round.
                <br />
                <PointsHighlight>1 bonus</PointsHighlight> point!
              </>
            }
          />
        </RuleInstruction>
      )}

      <TurnOrder players={players} activePlayerId={controllerId} order={gameOrder} />

      <Space className="space-container" align="center">
        <Button onClick={onGoBack}>
          <Translate pt="Ver resultado novamente" en="See results again" />
        </Button>
      </Space>
      <HostNextPhaseButton round={round} />
    </Step>
  );
}