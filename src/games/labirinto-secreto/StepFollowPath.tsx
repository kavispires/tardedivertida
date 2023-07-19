// Components
import { Step } from 'components/steps';
import { Instruction, Title } from 'components/text';
import { Translate } from 'components/language';
import { ClickableForest } from './components/ClickableForest';
import { AvatarName } from 'components/avatars';
import { MapHighlight, TreeHighlight } from './components/Highlights';
import { PointsHighlight } from 'components/metrics/PointsHighlight';

type StepFollowPathProps = {
  players: GamePlayers;
  user: GamePlayer;
  forest: Tree[];
  onSubmitPath: OnSubmitPathGuessFunction;
  activePlayer: GamePlayer;
  isTheActivePlayer: boolean;
} & AnnouncementProps;

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
    <Step fullWidth announcement={announcement}>
      <Title>
        <Translate
          pt={
            <>
              Siga o mapa de <AvatarName player={activePlayer} />
            </>
          }
          en={
            <>
              Follow <AvatarName player={activePlayer} />
              's map
            </>
          }
        />
      </Title>

      <Instruction contained>
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
      </Instruction>

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
