import clsx from 'clsx';
// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { BossIdeaCard } from 'types/tdr';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { AvatarName } from 'components/avatars';
import { TimedButton } from 'components/buttons';
import { DualTranslate, Translate } from 'components/language';
import { Step } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { Good, PlaceGoodPayload, WarehouseSlot } from './utils/types';
import { BOSS_IDEAS_IDS } from './utils/constants';
import { Warehouse } from './components/Warehouse';
import { StockingProgress } from './components/StockingProgress';

type StepConfirmGoodProps = {
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
  onConfirmPlacement: () => void;
  stocked: number;
};

export function StepConfirmGood({
  players,
  user,
  bossIdea,
  roundGoods,
  roundsGoodIndex,
  goodsDict,
  warehouse,
  supervisor,
  isUserTheSupervisor,
  onPlaceGood,
  onConfirmPlacement,
  stocked,
}: StepConfirmGoodProps) {
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

  useMock(() => {
    if (!isUserTheSupervisor) {
      onConfirmPlacement();
    }
  });

  if (isUserTheSupervisor) {
    return (
      <Step fullWidth ref={ref}>
        <StepTitle size="small">
          <Translate
            pt={<>Estão todos de acordo com esse local?</>}
            en={<>Is everyone okay with this location?</>}
          />
        </StepTitle>

        <RuleInstruction type="lore">
          <strong>
            <Translate
              pt="Você pode trocar a mercadoria de lugar se há outros lugares disponíveis e a equipe decidir."
              en="You may change the location of the good if there are available options and the team agrees."
            />
          </strong>
          <Divider className="my-1" />
          <DualTranslate>{bossIdea.description}</DualTranslate>
          <Divider className="my-1" />
          <StockingProgress
            stockingCount={roundsGoodIndex + 1}
            stockingRoundCount={roundGoods.length}
            stocked={stocked}
          />
        </RuleInstruction>

        <Warehouse
          goodsDict={goodsDict}
          warehouse={warehouse}
          onPlaceGood={isLoading || user.ready ? undefined : handlePlaceGood}
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
    <Step fullWidth ref={ref}>
      <StepTitle>
        <Translate
          pt={<>Concorda com o local escolhido?</>}
          en={<>Do you agree with the chosen location?</>}
        />
      </StepTitle>

      <RuleInstruction type="lore">
        <strong>
          <Translate
            pt={
              <>
                <AvatarName player={supervisor} size="small" /> é o(a) supervisor(a) do dia e colocou a
                mercadoria no galpão.
              </>
            }
            en={
              <>
                <AvatarName player={supervisor} /> is the supervisor of the day and placed the good in the
                warehouse.
              </>
            }
          />
        </strong>
        <Divider className="my-1" />
        <DualTranslate>{bossIdea.description}</DualTranslate>
        <Divider className="my-1" />
        <StockingProgress
          stockingCount={roundsGoodIndex + 1}
          stockingRoundCount={roundGoods.length}
          stocked={stocked}
        />
      </RuleInstruction>

      <RuleInstruction type="action">
        <Translate
          pt="Se você concorda com o local, confirme sua escolha."
          en="If you agree with the location, confirm your choice."
        />
      </RuleInstruction>

      <Instruction>
        <TimedButton
          size="large"
          type="primary"
          onClick={onConfirmPlacement}
          onExpire={onConfirmPlacement}
          loading={isLoading}
          disabled={user.ready}
          duration={40}
        >
          <Translate pt="Confirmar" en="Confirm" />
        </TimedButton>
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
