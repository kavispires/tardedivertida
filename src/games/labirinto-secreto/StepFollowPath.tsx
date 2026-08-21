// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Components
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { OnSubmitPathGuessFunction, Tree } from './utils/types';
import { ClickableForest } from './components/ClickableForest';
import { MapHighlight, TreeHighlight } from './components/Highlights';

type StepFollowPathProps = {
  players: GamePlayers;
  user: GamePlayer;
  forest: Tree[];
  onSubmitPath: OnSubmitPathGuessFunction;
  activePlayer: GamePlayer;
  isTheActivePlayer: boolean;
} & Pick<StepProps, 'announcement'>;

export function StepFollowPath({
  players,
  announcement,
  forest,
  activePlayer,
  onSubmitPath,
  user,
}: StepFollowPathProps) {
  const playerCount = Object.keys(players).length;

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt="Siga o mapa de {activePlayer}"
          en="Follow {activePlayer}'s map"
          values={{ activePlayer: <PlayerAvatarName player={activePlayer} /> }}
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt="Baseado no <mapa>mapa de adjetivos</mapa>, clique nas <arvores>árvores</arvores> circuladas de pontinhos brancos para escolher aquele caminho.<br/>Cada árvore correta vale {points} por jogador que acertar (Por exemplo, 3 jogadores = 3 pontos).<br/>Então, talvez valha a pena discutir! Porém, se somente um jogador acertar o caminho, ele ganha {playerPoints}.<br/>O criador do mapa ganha o mesmo número de pontos que os jogadores."
          en="Based on the <mapa>adjectives map</mapa>, click on the <arvores>circled trees</arvores> with white dots to choose that path.<br/>Each correct tree is worth {points} per player that guesses it (For example, 3 players = 3 points).<br/>So, it might be worth discussing out loud! However, if only one player guesses the path, they earn {playerPoints}.<br/>The map creator also earns the same number of points as the players."
          values={{
            mapa: (text: string) => <MapHighlight>{text}</MapHighlight>,
            arvores: (text: string) => <TreeHighlight>{text}</TreeHighlight>,
            points: <PointsHighlight value={1} />,
            playerPoints: <PointsHighlight value={playerCount} />,
          }}
        />
      </RuleInstruction>

      {Boolean(forest) && activePlayer.map && (
        <ClickableForest
          forest={forest}
          map={activePlayer.map}
          onSubmitPath={onSubmitPath}
          pathId={activePlayer.id}
          user={user}
          players={players}
        />
      )}
    </Step>
  );
}
