// Hooks
// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { Forest } from './components/Forest';
import { MapHighlight, TreeHighlight } from './components/Highlights';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { PlayerMap } from './components/PlayerMap';

type StepPathWaitingProps = {
  players: GamePlayers;
  forest: Tree[];
  activePlayer: GamePlayer;
} & AnnouncementProps;

export function StepPathWaiting({ players, announcement, forest, activePlayer }: StepPathWaitingProps) {
  const playerCount = Object.keys(players).length;
  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={<>Os jogadores estão seguindo o seu mapa!</>}
          en={<>Players are following your map!</>}
        />
      </Title>

      <Instruction contained>
        <Translate
          pt={
            <>
              Baseado no <MapHighlight>mapa de adjetivos</MapHighlight>, eles vão clicando nas{' '}
              <TreeHighlight>árvores</TreeHighlight> para escolher o caminho.
              <br />
              Cada árvore correta vale <PointsHighlight>1 ponto</PointsHighlight> por jogador que acertar. Por
              exemplo, 3 jogadores = 3 pontos.
              <br />
              Se somente um jogador acertar o caminho, ele ganha{' '}
              <PointsHighlight>{playerCount} pontos</PointsHighlight>.
              <br />
              Você, como criador do mapa ganha o mesmo número de pontos que os jogadores.
            </>
          }
          en={
            <>
              Based on the <MapHighlight>adjectives map</MapHighlight>, players will click on the{' '}
              <TreeHighlight>trees</TreeHighlight> to choose the path.
              <br />
              Each correct tree is worth <PointsHighlight>1 point</PointsHighlight> per player that guesses
              it. For example, 3 players = 3 points.
              <br />
              If only one player guesses the path, they earn{' '}
              <PointsHighlight>{playerCount} points</PointsHighlight>.
              <br />
              You as the map creator also earns the same number of points as the players.
            </>
          }
        />
      </Instruction>

      <PlayerMap map={activePlayer.map} />

      <Forest forest={forest} map={activePlayer.map} showPath />
    </Step>
  );
}
