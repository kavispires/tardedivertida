// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { Tree } from './utils/types';
import { Forest } from './components/Forest';
import { MapHighlight, TreeHighlight } from './components/Highlights';
import { PlayerMap } from './components/PlayerMap';

type StepPathWaitingProps = {
  players: GamePlayers;
  forest: Tree[];
  activePlayer: GamePlayer;
} & Pick<StepProps, 'announcement'>;

export function StepPathWaiting({ players, announcement, forest, activePlayer }: StepPathWaitingProps) {
  const playerCount = Object.keys(players).length;
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Os jogadores estão seguindo o seu mapa!"
          en="Players are following your map!"
        />
      </StepTitle>

      <RuleInstruction type="wait">
        <Translate
          pt="Baseado no <mapa>mapa de adjetivos</mapa>, eles vão clicando nas <arvores>árvores</arvores> para escolher o caminho.
          <br/>
          Cada árvore correta vale {points} por jogador que acertar. Por exemplo, 3 jogadores = 3 pontos.
          <br/>
          Se somente um jogador acertar o caminho, ele ganha {playerPoints}.
          <br/>
          Você, como criador do mapa, ganha o mesmo número de pontos que os jogadores."
          en="Based on the <mapa>adjectives map</mapa>, players will click on the <arvores>trees</arvores> to choose the path.
          <br/>
          Each correct tree is worth {points} per player that guesses it. For example, 3 players = 3 points.
          <br/>
          If only one player guesses the path, they earn {playerPoints}.
          <br/>
          You as the map creator also earns the same number of points as the players."
          values={{
            mapa: (text: string) => <MapHighlight>{text}</MapHighlight>,
            arvores: (text: string) => <TreeHighlight>{text}</TreeHighlight>,
            points: <PointsHighlight value={1} />,
            playerPoints: <PointsHighlight value={playerCount} />,
          }}
        />
      </RuleInstruction>

      <PlayerMap map={activePlayer.map} />

      <Forest
        forest={forest}
        map={activePlayer.map}
        showPath
      />
    </Step>
  );
}
