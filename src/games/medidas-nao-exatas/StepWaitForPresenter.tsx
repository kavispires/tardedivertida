import { AnimatePresence, motion } from 'motion/react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer, GamePlayers } from 'types/player';
import type { TextCard } from 'types/tdr';
// Utils
import { getAnimation } from 'utils/animations';
// Components
import { PlayerAvatarName } from 'components/avatars';
import { Translate } from 'components/language';
import { TurnOrder, WaitingRoom } from 'components/players';
import { Step, type StepProps } from 'components/steps';

type StepWaitForPresenterProps = {
  players: GamePlayers;
  presenter: GamePlayer;
  turnOrder: PlayerId[];
  wordsDict: Dictionary<TextCard>;
  poolIds?: CardId[];
} & Pick<StepProps, 'announcement'>;

export function StepWaitForPresenter({
  players,
  presenter,
  turnOrder,
  poolIds,
  wordsDict,
  announcement,
}: StepWaitForPresenterProps) {
  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <WaitingRoom
        players={players}
        title={
          <Translate
            pt={
              <>
                Aguarde enquanto <PlayerAvatarName player={presenter} /> cria as métricas.
              </>
            }
            en={
              <>
                Wait while <PlayerAvatarName player={presenter} /> creates the metrics.
              </>
            }
          />
        }
        instruction={
          poolIds ? (
            <RoundsPool
              poolIds={poolIds}
              wordsDict={wordsDict}
            />
          ) : (
            <div>...</div>
          )
        }
      ></WaitingRoom>

      <TurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={presenter.id}
      />
    </Step>
  );
}
function RoundsPool({ poolIds, wordsDict }: Pick<StepWaitForPresenterProps, 'poolIds' | 'wordsDict'>) {
  return (
    <AnimatePresence>
      <Translate
        pt={<>Palavras disponíveis para a rodada:</>}
        en={<>Available words for the round:</>}
      />
      <Flex wrap>
        {poolIds?.map((cardId, index) => {
          const card = wordsDict[cardId];
          return (
            <motion.div
              key={cardId}
              className="pool-card"
              {...getAnimation('fadeIn', { delay: index * 0.1 })}
            >
              {card.text}
            </motion.div>
          );
        })}
      </Flex>
    </AnimatePresence>
  );
}
