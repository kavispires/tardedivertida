import clsx from 'clsx';
// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { BossIdeaCard } from 'types/tdr';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
// Icons
import { BossIdeaIcon } from 'icons/BossIdeaIcon';
import { MysteryBoxIcon } from 'icons/MysteryBoxIcon';
// Components
import { AvatarName } from 'components/avatars';
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
import { DualTranslate, Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Good, PlaceGoodPayload, WarehouseSlot } from './utils/types';
import { BOSS_IDEAS_IDS } from './utils/constants';
import { Warehouse } from './components/Warehouse';
import { StockingProgress } from './components/StockingProgress';

type StepPlaceGoodProps = {
  players: GamePlayers;
  user: GamePlayer;
  bossIdea: BossIdeaCard;
  roundGoods: string[];
  roundsGoodIndex: number;
  goodsDict: Dictionary<Good>;
  warehouse: WarehouseSlot[];
  supervisor: GamePlayer;
  isUserTheSupervisor: boolean;
  onPlaceGood: (payload: PlaceGoodPayload) => void;
  stocked: number;
} & Pick<StepProps, 'announcement'>;

export function StepPlaceGood({
  players,
  user,
  announcement,
  bossIdea,
  roundGoods,
  roundsGoodIndex,
  goodsDict,
  warehouse,
  supervisor,
  isUserTheSupervisor,
  onPlaceGood,
  stocked,
}: StepPlaceGoodProps) {
  const { isLoading } = useLoading();
  const [cardWidth, ref] = useCardWidthByContainerRef(7, {
    minWidth: 60,
    maxWidth: 80,
    margin: 16,
  });

  const currentGood = goodsDict[roundGoods[roundsGoodIndex]];

  const handlePlaceGood = (index: number) => {
    onPlaceGood({
      goodId: currentGood.id,
      newWarehouseSlot: index,
      previousWarehouseSlot: currentGood.slot,
    });
  };

  if (isUserTheSupervisor) {
    return (
      <Step fullWidth announcement={announcement} ref={ref}>
        <StepTitle icon={<BossIdeaIcon />}>
          <DualTranslate>{bossIdea.title}</DualTranslate>
        </StepTitle>

        <RuleInstruction type="lore">
          <strong>
            <Translate pt={<>Coloque a mercadoria do galpão!</>} en={<>Place the good in the warehouse</>} />
          </strong>
          <Divider className="my-1" />
          <DualTranslate>{bossIdea.description}</DualTranslate>
          <Divider className="my-1" />
          <StockingProgress
            stockingCount={roundsGoodIndex}
            stockingRoundCount={roundGoods.length}
            stocked={stocked}
          />
        </RuleInstruction>

        <Instruction contained>
          <WarehouseGoodCard
            id={currentGood.id}
            padding={1}
            width={cardWidth}
            className={clsx(
              bossIdea.id === BOSS_IDEAS_IDS.TINTED_GLASS && 'warehouse-good--TINTED_GLASS',
              bossIdea.id === BOSS_IDEAS_IDS.EYE_EXAM && 'warehouse-good--EYE_EXAM',
            )}
          />
        </Instruction>

        <Warehouse
          goodsDict={goodsDict}
          warehouse={warehouse}
          onPlaceGood={isLoading ? undefined : handlePlaceGood}
          width={cardWidth}
          goodClassName={clsx(
            bossIdea.id === BOSS_IDEAS_IDS.TINTED_GLASS && 'warehouse-good--TINTED_GLASS',
            bossIdea.id === BOSS_IDEAS_IDS.EYE_EXAM && 'warehouse-good--EYE_EXAM',
          )}
        />
      </Step>
    );
  }

  return (
    <Step fullWidth announcement={announcement} ref={ref}>
      <StepTitle icon={<BossIdeaIcon />}>
        <DualTranslate>{bossIdea.title}</DualTranslate>
      </StepTitle>

      <RuleInstruction type="lore">
        <strong>
          <Translate
            pt={
              <>
                <AvatarName player={supervisor} size="small" /> é o(a) supervisor(a) do dia e colocará a
                mercadoria no galpão.
              </>
            }
            en={
              <>
                <AvatarName player={supervisor} /> is the supervisor of the day and will place the good in the
                warehouse.
              </>
            }
          />
        </strong>
        <Divider className="my-1" />
        <DualTranslate>{bossIdea.description}</DualTranslate>
        <Divider className="my-1" />
        <StockingProgress
          stockingCount={roundsGoodIndex}
          stockingRoundCount={roundGoods.length}
          stocked={stocked}
        />
      </RuleInstruction>

      <Instruction contained>
        {bossIdea.id === BOSS_IDEAS_IDS.CONFIDENTIAL ? (
          <>
            <MysteryBoxIcon width={cardWidth} />
          </>
        ) : (
          <WarehouseGoodCard
            id={currentGood.id}
            padding={1}
            width={cardWidth}
            className={clsx(bossIdea.id === BOSS_IDEAS_IDS.TINTED_GLASS && 'warehouse-good--TINTED_GLASS')}
          />
        )}
      </Instruction>

      <Warehouse
        goodsDict={goodsDict}
        warehouse={warehouse}
        width={cardWidth}
        goodClassName={clsx(bossIdea.id === BOSS_IDEAS_IDS.TINTED_GLASS && 'warehouse-good--TINTED_GLASS')}
        conceal={bossIdea.id === BOSS_IDEAS_IDS.CONFIDENTIAL}
      />
    </Step>
  );
}
