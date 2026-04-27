import useApp from 'antd/es/app/useApp';
import clsx from 'clsx';
import { useState } from 'react';
// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { BossIdeaCard } from 'types/tdr';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Icons
import { BossIdeaIcon } from 'icons/BossIdeaIcon';
import { MysteryBoxIcon } from 'icons/MysteryBoxIcon';
// Components
import { SendButton } from 'components/buttons/SendButton';
import { WarehouseGoodCard } from 'components/cards/WarehouseGoodCard';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { SpaceFloat } from 'components/layout/SpaceFloat';
import { PlayerAvatarName } from 'components/player/PlayerAvatarName';
import { PlayersTurnOrder } from 'components/players/PlayersTurnOrder';
import { Step, type StepProps } from 'components/steps/Step';
import { Instruction } from 'components/text/Instruction';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { Good, PlaceGoodPayload, Status, WarehouseSlot } from './utils/types';
import { BOSS_IDEAS_IDS } from './utils/constants';
import { useGoodSize } from './utils/hooks';
import { mockPlacement } from './utils/mock';
import { Warehouse } from './components/Warehouse';
import { StockingProgress } from './components/StockingProgress';

type StepPlaceGoodProps = {
  players: GamePlayers;
  user: GamePlayer;
  bossIdea: BossIdeaCard;
  goodsDict: Dictionary<Good>;
  warehouse: WarehouseSlot[];
  supervisor: GamePlayer;
  isUserTheSupervisor: boolean;
  status: Status;
  currentGoodId: UID;
  turnOrder: TurnOrder;
  onPlaceGood: (payload: PlaceGoodPayload) => void;
  onConfirmPlacement: (payload: PlaceGoodPayload) => void;
  selectedWarehouseSlot: number | null;
} & Pick<StepProps, 'announcement'>;

export function StepPlaceGood({
  players,
  announcement,
  bossIdea,
  status,
  currentGoodId,
  goodsDict,
  warehouse,
  supervisor,
  isUserTheSupervisor,
  turnOrder,
  onPlaceGood,
  onConfirmPlacement,
  selectedWarehouseSlot,
}: StepPlaceGoodProps) {
  const { isLoading } = useLoading();
  const currentGood = goodsDict[currentGoodId];
  const { goodWidth } = useGoodSize();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const { message } = useApp();

  const handlePlaceGood = (index: number) => {
    setSelectedSlot(index);
    onPlaceGood({
      selectedWarehouseSlot: index,
    });
  };

  const handleConfirmPlacement = () => {
    if (selectedSlot === null) {
      message.warning(
        <Translate
          en="Please select a slot in the warehouse to place the good."
          pt="Por favor, selecione um local no armazém para colocar a mercadoria."
        />,
      );
      return; // No slot selected, do nothing
    }

    onConfirmPlacement({
      selectedWarehouseSlot: selectedSlot,
    });
  };

  // useMock(() => {
  //   if (isUserTheSupervisor) {
  //     onConfirmPlacement({
  //       selectedWarehouseSlot: mockPlacement(warehouse),
  //     });
  //   }
  // });

  if (isUserTheSupervisor) {
    return (
      <Step
        fullWidth
        announcement={announcement}
      >
        <StepTitle icon={<BossIdeaIcon />}>
          <DualTranslate>{bossIdea.title}</DualTranslate>
        </StepTitle>

        <RuleInstruction type="lore">
          <strong>
            <Translate
              pt={<>Coloque a mercadoria do galpão!</>}
              en={<>Place the good in the warehouse</>}
            />
          </strong>
          <Divider className="my-2" />
          <DualTranslate>{bossIdea.description}</DualTranslate>
          <Divider className="my-2" />
          <StockingProgress status={status} />
        </RuleInstruction>

        <Instruction contained>
          <WarehouseGoodCard
            goodId={currentGood.id}
            className={clsx(
              `warehouse-good--${bossIdea.id}`,
              `warehouse__good--${currentGood.orientation ?? 0}`,
            )}
          />
        </Instruction>

        <Warehouse
          goodsDict={goodsDict}
          warehouse={warehouse}
          onPlaceGood={isLoading ? undefined : handlePlaceGood}
          selectedWarehouseSlot={selectedWarehouseSlot}
          currentGoodId={currentGoodId}
        />

        <SpaceFloat
          className="mt-4"
          enabled={selectedWarehouseSlot !== null}
        >
          <SendButton
            size="large"
            onClick={handleConfirmPlacement}
            disabled={selectedWarehouseSlot === null}
          >
            <Translate
              en="Confirm Placement"
              pt="Confirmar Localização"
            />
          </SendButton>
        </SpaceFloat>
      </Step>
    );
  }

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle icon={<BossIdeaIcon />}>
        <DualTranslate>{bossIdea.title}</DualTranslate>
      </StepTitle>

      <RuleInstruction type="lore">
        <strong>
          <Translate
            pt={
              <>
                <PlayerAvatarName
                  player={supervisor}
                  size="small"
                />{' '}
                é o(a) supervisor(a) do dia e colocará a mercadoria no galpão.
              </>
            }
            en={
              <>
                <PlayerAvatarName player={supervisor} /> is the supervisor of the day and will place the good
                in the warehouse.
              </>
            }
          />
        </strong>
        <Divider className="my-1" />
        <DualTranslate>{bossIdea.description}</DualTranslate>
        <Divider className="my-1" />
        <StockingProgress status={status} />
      </RuleInstruction>

      <Instruction contained>
        {bossIdea.id === BOSS_IDEAS_IDS.CONFIDENTIAL ? (
          <MysteryBoxIcon width={goodWidth} />
        ) : (
          <WarehouseGoodCard
            goodId={currentGood.id}
            width={goodWidth}
            className={clsx(
              `warehouse-good--${bossIdea.id}`,
              `warehouse__good--${currentGood.orientation ?? 0}`,
            )}
          />
        )}
      </Instruction>

      <Warehouse
        goodsDict={goodsDict}
        warehouse={warehouse}
        bossIdeaId={bossIdea.id}
        selectedWarehouseSlot={selectedWarehouseSlot}
        currentGoodId={currentGoodId}
      />

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
      />
    </Step>
  );
}
