// Types
import type { GamePlayer, GamePlayers } from 'types/player';
// Hooks
import { useMock } from 'hooks/useMock';
// Icons
import { NoIcon } from 'icons/NoIcon';
import { TreeIcon } from 'icons/TreeIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { PointsHighlight } from 'components/metrics/PointsHighlight';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
// Internal
import type { OnSubmitMapFunction, Tree } from './utils/types';
import { buildPlayerMappingForLatestTree } from './utils/helpers';
import { mockNewMap } from './utils/mocks';
import { Forest } from './components/Forest';
import { CompassHighlight } from './components/Highlights';
import { MapBuilder } from './components/MapBuilder';

type StepBuildMapProps = {
  players: GamePlayers;
  user: GamePlayer;
  forest: Tree[];
  currentRound: number;
  onSubmitMap: OnSubmitMapFunction;
} & Pick<StepProps, 'announcement'>;

export function StepBuildMap({
  players,
  user,
  announcement,
  forest,
  currentRound,
  onSubmitMap,
}: StepBuildMapProps) {
  // Dev Only
  useMock(() => {
    onSubmitMap({ newMap: mockNewMap(user.hand) });
  });

  const playerMapping = buildPlayerMappingForLatestTree(players, user);

  return (
    <Step fullWidth announcement={announcement}>
      <Title>
        {currentRound === 1 ? (
          <Translate pt="Construa o seu mapa" en="Build your map" />
        ) : (
          <Translate pt="Expanda seu mapa" en="Expand your map" />
        )}
      </Title>

      <RuleInstruction type="rule">
        <Translate
          pt={
            <>
              Você precisa ajudar os outros jogadores a descobrirem o seu caminho pela floresta.
              <br />
              Começando da <CompassHighlight>bússola</CompassHighlight>, escolha 1 carta para cada árvore do
              caminho.
              <br />
              Você ganha <PointsHighlight>pontos</PointsHighlight> se jogadores adivinharem seu caminho, então
              tente fazer um bom trabalho.
            </>
          }
          en={
            <>
              You need to help the other players to discover your path through the forest.
              <br />
              Starting from the <CompassHighlight>compass</CompassHighlight>, choose 1 card for each tree of
              the path.
              <br />
              You earn <PointsHighlight>points</PointsHighlight> if players guess your path correctly, so try
              to do a good job.
            </>
          }
        />
      </RuleInstruction>

      <Forest
        forest={forest}
        map={user.map}
        showPath
        hidePassedTreeNames
        players={players}
        playerMapping={playerMapping}
      />

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Clique nas cartas em sequência para definir seu mapa, uma carta por árvore.
              <br />
              Você pode fazer quantos segmentos quiser desde que pelo menos uma carta esteja em cada árvore
              (dessa rodada ou de uma rodada anterior já que as cartas são cumulativas).
              <br />
              Na barra abaixo, se quiser negar <IconAvatar icon={<NoIcon />} size="small" /> um adjectivo
              selecionado, clique nele acima da árvore para trocar.
              <br />
              Se quiser refazer uma árvore <IconAvatar icon={<TreeIcon />} size="small" />, clique nela.
              <br />
              Quando você estiver pronto, aperte Enviar Mapa.
            </>
          }
          en={
            <>
              Click on the cards in sequence to define your map, you can't skip any tree.
              <br />
              You can build as many segments you with as long as there is at least one card on each tree (from
              this round or a previous one since the cards are cumulative).
              <br />
              If you want to negate <IconAvatar icon={<NoIcon />} size="small" /> an adjective you selected,
              click on it below the tree to change.
              <br />
              If you want to redo a tree <IconAvatar icon={<TreeIcon />} size="small" />, click on it.
              <br />
              When you are ready, press Submit Map.
            </>
          }
        />
      </RuleInstruction>

      <MapBuilder user={user} forest={forest} onSubmitMap={onSubmitMap} />
    </Step>
  );
}
