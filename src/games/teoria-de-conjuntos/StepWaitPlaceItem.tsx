// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { AvatarName, IconAvatar } from 'components/avatars';
import { Container } from 'components/general/Container';
import { Translate } from 'components/language';
import { TurnOrder } from 'components/players';
// Components
import { Step, StepProps } from 'components/steps';
import { Title } from 'components/text';
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { AnimatedClockIcon } from 'icons/AnimatedClockIcon';
import { Item } from 'types/tdr';

import { DiagramRules } from './components/RulesBlobs';
import { DiagramArea, DiagramExamples, Solutions } from './utils/types';
import { MyThings } from './components/MyThings';
import { Solution } from './components/Solution';
import { DiagramSection } from './components/DiagramSection';
import { getPlayerItemsLeft } from './utils/helper';
import { GameRound } from 'types/game';
import { RoundAlert } from './components/RoundAlert';

type StepWaitPlaceItemProps = {
  players: GamePlayers;
  user: GamePlayer;
  examples: DiagramExamples;
  diagrams: Dictionary<DiagramArea>;
  items: Dictionary<Item>;
  turnOrder: GameOrder;
  activePlayer: GamePlayer;
  isJudge: boolean;
  solutions: Solutions;
  targetItemCount: number;
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepWaitPlaceItem({
  players,
  user,
  announcement,
  examples,
  diagrams,
  items,
  turnOrder,
  activePlayer,
  isJudge,
  solutions,
  targetItemCount,
  round,
}: StepWaitPlaceItemProps) {
  const [width, ref] = useCardWidthByContainerRef(2, { maxWidth: 1000 });

  return (
    <Step fullWidth announcement={announcement}>
      <div ref={ref} style={{ width: '100%' }} />
      <Title>
        <Translate
          pt={
            <>
              <AvatarName player={activePlayer} /> vai posicionar uma coisa
            </>
          }
          en={
            <>
              <AvatarName player={activePlayer} /> will place an item
            </>
          }
        />{' '}
        <IconAvatar icon={<AnimatedClockIcon />} />
      </Title>

      <RoundAlert round={round} />

      <DiagramRules examples={examples} />

      <DiagramSection width={width} diagrams={diagrams} items={items} />

      {!isJudge && <MyThings hand={user.hand ?? []} items={items} total={targetItemCount} />}

      {isJudge && (
        <Container
          contained
          title={<Translate pt="As Regras Secretas" en="The Secret Rules" />}
          contentProps={{ direction: 'vertical' }}
        >
          <Translate
            pt="Essas são as regras secretas de cada círculo, não fale elas com ninguém."
            en="These are the secret rules of each circle, don't tell them to anyone."
          />

          <Solution solutions={solutions} />
        </Container>
      )}

      <TurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayer.id}
        additionalInfoParser={getPlayerItemsLeft}
      />
    </Step>
  );
}
