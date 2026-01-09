// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
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
          pt={
            <>
              Siga o mapa de <PlayerAvatarName player={activePlayer} />
            </>
          }
          en={
            <>
              Follow <PlayerAvatarName player={activePlayer} />
              's map
            </>
          }
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Baseado no <MapHighlight>mapa de adjetivos</MapHighlight>, clique nas{' '}
              <TreeHighlight>árvores</TreeHighlight> circuladas de pontinhos brancos para escolher aquele
              caminho.
              <br />
              Cada árvore correta vale <PointsHighlight>1 ponto</PointsHighlight> por jogador que acertar (Por
              exemplo, 3 jogadores = 3 pontos).
              <br />
              Então, talvez valha a pena discutir! Porém, se somente um jogador acertar o caminho, ele ganha{' '}
              <PointsHighlight>{playerCount} pontos</PointsHighlight>.
              <br />O criador do mapa ganha o mesmo número de pontos que os jogadores.
            </>
          }
          en={
            <>
              Based on the <MapHighlight>adjectives map</MapHighlight>, click on the{' '}
              <TreeHighlight>circled trees</TreeHighlight> with white dots to choose that path.
              <br />
              Each correct tree is worth <PointsHighlight>1 point</PointsHighlight> per player that guesses it
              (For example, 3 players = 3 points).
              <br />
              So, it might be worth discussing out loud! However, if only one player guesses the path, they
              earn <PointsHighlight>{playerCount} points</PointsHighlight>.
              <br />
              The map creator also earns the same number of points as the players.
            </>
          }
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
