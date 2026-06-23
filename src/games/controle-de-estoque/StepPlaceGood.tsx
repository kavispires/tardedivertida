import useApp from 'antd/es/app/useApp';
import clsx from 'clsx';
import { useState } from 'react';
// Ant Design Resources
import { Divider } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { BossIdeaCard } from 'types/tdr';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Icons
import { BossIdeaIcon } from '@icons/BossIdeaIcon';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { WarehouseGoodCard } from '@components/cards/WarehouseGoodCard';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { Instruction } from '@components/text/Instruction';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { Good, PlaceGoodPayload, Status, WarehouseSlot } from './utils/types';
import { useGoodComponentAndClass, useGoodSize } from './utils/hooks';
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
          pt="Por favor, selecione um local no galpão para colocar a mercadoria."
        />,
      );
      return; // No slot selected, do nothing
    }

    onConfirmPlacement({
      selectedWarehouseSlot: selectedSlot,
    });
  };

  useMock(() => {
    if (
      isUserTheSupervisor &&
      // For debugging purposes we only mock the players in between first and last progress
      status.progress > 0 &&
      status.progress < status.goal - 1
    ) {
      onConfirmPlacement({
        selectedWarehouseSlot: mockPlacement(warehouse),
      });
    }
  });

  const { goodClassName, goodComponent } = useGoodComponentAndClass({
    bossIdea,
    isUserTheSupervisor,
    currentGood,
    goodWidth,
    step: 'placing',
  });

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
          <span className="c-boss-idea-description">
            <DualTranslate>{bossIdea.description}</DualTranslate>
          </span>
          <Divider className="my-2" />
          <StockingProgress status={status} />
        </RuleInstruction>

        <Instruction contained>
          {goodComponent ?? (
            <WarehouseGoodCard
              goodId={currentGood.id}
              width={goodWidth}
              className={clsx(`warehouse__good--${currentGood.orientation ?? 0}`, {
                [goodClassName]: !!goodClassName,
              })}
            />
          )}
        </Instruction>

        <Warehouse
          goodsDict={goodsDict}
          warehouse={warehouse}
          onPlaceGood={isLoading ? undefined : handlePlaceGood}
          selectedWarehouseSlot={selectedWarehouseSlot}
          currentGoodId={currentGoodId}
          bossIdeaId={bossIdea.id}
          goodClassName={goodClassName}
          goodComponent={goodComponent}
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

        <PlayersTurnOrder
          players={players}
          order={turnOrder}
          activePlayerId={supervisor.id}
        />
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
                é o(a) supervisor(a) da vez e colocará a mercadoria no galpão.
              </>
            }
            en={
              <>
                <PlayerAvatarName player={supervisor} /> is the supervisor of the turn and will place the good
                in the warehouse.
              </>
            }
          />
        </strong>
        <Divider className="my-1" />
        <span className="c-boss-idea-description">
          <DualTranslate>{bossIdea.description}</DualTranslate>
        </span>
        <Divider className="my-1" />
        <StockingProgress status={status} />
      </RuleInstruction>

      <Instruction contained>
        {goodComponent ?? (
          <WarehouseGoodCard
            goodId={currentGood.id}
            width={goodWidth}
            className={clsx(`warehouse__good--${currentGood.orientation ?? 0}`, {
              [goodClassName]: !!goodClassName,
            })}
          />
        )}
      </Instruction>

      <Warehouse
        goodsDict={goodsDict}
        warehouse={warehouse}
        bossIdeaId={bossIdea.id}
        selectedWarehouseSlot={selectedWarehouseSlot}
        currentGoodId={currentGoodId}
        goodClassName={goodClassName}
        goodComponent={goodComponent}
      />

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={supervisor.id}
      />
    </Step>
  );
}
