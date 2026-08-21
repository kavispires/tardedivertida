// Types
import type { GamePlayer, GamePlayers } from 'types/game';
// Hooks
import { useMock } from '@hooks/useMock';
// Icons
import { NoIcon } from '@icons/NoIcon';
import { TreeIcon } from '@icons/TreeIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { CustomPlayerProps, OnSubmitMapFunction, Tree } from './utils/types';
import { buildPlayerMappingForLatestTree } from './utils/helpers';
import { mockNewMap } from './utils/mocks';
import { Forest } from './components/Forest';
import { CompassHighlight } from './components/Highlights';
import { MapBuilder } from './components/MapBuilder';

type StepBuildMapProps = {
  players: GamePlayers;
  user: GamePlayer<CustomPlayerProps>;
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
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        {currentRound === 1 ? (
          <Translate
            pt="Construa o seu mapa"
            en="Build your map"
          />
        ) : (
          <Translate
            pt="Expanda seu mapa"
            en="Expand your map"
          />
        )}
      </StepTitle>

      <RuleInstruction type="rule">
        <Translate
          pt="Você precisa ajudar os outros jogadores a descobrirem o seu caminho pela floresta.<br/>Começando da <compass>bússola</compass>, escolha 1 carta para cada árvore do caminho.<br/>Você ganha {points} se jogadores adivinharem seu caminho, então tente fazer um bom trabalho."
          en="You need to help the other players to discover your path through the forest.<br/>Starting from the <compass>compass</compass>, choose 1 card for each tree of the path.<br/>You earn {points} if players guess your path correctly, so try to do a good job."
          values={{
            compass: (text: string) => <CompassHighlight>{text}</CompassHighlight>,
            points: <PointsHighlight value="pontos" />,
          }}
        />
      </RuleInstruction>

      <Forest
        forest={forest}
        map={user.map}
        showPath
        hidePassedTreeNames
        players={players}
        playerMapping={playerMapping}
        hidePathLines
      />

      <RuleInstruction type="action">
        <Translate
          pt="1. Clique nas cartas em sequência para definir seu mapa, uma carta por árvore.<br/>2. Você pode fazer quantos segmentos quiser desde que pelo menos uma carta esteja em cada árvore (dessa rodada ou de uma rodada anterior já que as cartas são cumulativas).<br/>3. Na barra abaixo, se quiser negar <noIcon/> um adjectivo selecionado, clique nele acima da árvore para trocar.<br/>4. Se quiser refazer uma árvore <treeIcon/>, clique nela.<br/>5. Quando você estiver pronto, aperte Enviar Mapa."
          en="Click on the cards in sequence to define your map, you can't skip any tree.<br/>You can build as many segments you with as long as there is at least one card on each tree (from this round or a previous one since the cards are cumulative).<br/>If you want to negate <noIcon/> an adjective you selected, click on it below the tree to change.<br/>If you want to redo a tree <treeIcon/>, click on it.<br/>When you are ready, press Submit Map."
          values={{
            noIcon: (
              <Icon
                icon={<NoIcon />}
                size="small"
              />
            ),
            treeIcon: (
              <Icon
                icon={<TreeIcon />}
                size="small"
              />
            ),
          }}
        />
      </RuleInstruction>

      <MapBuilder
        user={user}
        forest={forest}
        onSubmitMap={onSubmitMap}
      />
    </Step>
  );
}
