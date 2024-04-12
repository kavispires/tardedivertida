// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Components
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, Title } from 'components/text';
import { DualTranslate, Translate } from 'components/language';
import { DiagramRules } from './components/RulesBlobs';
import { DiagramArea, DiagramExamples, SubmitItemPlacementPayload } from './utils/types';
import { Item } from 'types/tdr';
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { Button, Flex, Space, Tag, Tooltip } from 'antd';
import { MouseFollowingContent } from 'components/mouse/MouseFollowingContent';
import { useRef, useState } from 'react';
import { ItemCard } from 'components/cards/ItemCard';
import { TransparentButton } from 'components/buttons';
import { getAnimationClass } from 'utils/helpers';

import { SelectedAreasCircles } from './components/SelectedAreasCircles';
import { TurnOrder } from 'components/players';
import { Container } from 'components/general/Container';
import { DiagramSection } from './components/DiagramSection';
import { useMock } from 'hooks/useMock';
import { mockDiagramSelection } from './utils/mock';
import { getPlayerItemsLeft } from './utils/helper';
import { AimOutlined } from '@ant-design/icons';
import { GameRound } from 'types/game';
import { RoundAlert } from './components/RoundAlert';

type StepPlaceItemProps = {
  players: GamePlayers;
  user: GamePlayer;
  examples: DiagramExamples;
  diagrams: Dictionary<DiagramArea>;
  items: Dictionary<Item>;
  turnOrder: GameOrder;
  activePlayer: GamePlayer;
  onSubmitItemPlacement: (payload: SubmitItemPlacementPayload) => void;
  targetItemCount: number;
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepPlaceItem({
  players,
  user,
  announcement,
  examples,
  diagrams,
  items,
  turnOrder,
  activePlayer,
  onSubmitItemPlacement,
  targetItemCount,
  round,
}: StepPlaceItemProps) {
  const { isLoading } = useLoading();
  const scrollToSubmitRef = useRef<HTMLDivElement>(null);

  const [width, ref] = useCardWidthByContainerRef(2, { maxWidth: 1000 });
  const [previouslySelectedItemId, setPreviouslySelectedItemId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const onSelectArea = (area: string) => {
    setPreviouslySelectedItemId(selectedItemId || null);
    setSelectedArea(area);
    if (selectedItemId && scrollToSubmitRef.current) {
      scrollToSubmitRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedItem = items[selectedItemId ?? ''] ?? { name: { en: '', pt: '' } };

  useMock(() => {
    onSubmitItemPlacement(mockDiagramSelection(user.hand ?? [], diagrams));
  });

  return (
    <Step fullWidth announcement={announcement}>
      <div ref={ref} style={{ width: '100%' }} />
      <Title>
        <Translate
          pt={<>Selecione um item e uma área do diagrama que você acha que ele pode se encaixar</>}
          en={<>Select an item and an area of the diagram where you think it could fit</>}
        />
      </Title>

      <RoundAlert round={round} />

      <DiagramRules examples={examples} />

      <Space className="space-container">
        <Button
          type="primary"
          size="large"
          loading={isLoading}
          disabled={!selectedArea || !selectedItemId}
          onClick={() => onSubmitItemPlacement({ position: selectedArea!, itemId: selectedItemId! })}
          ref={scrollToSubmitRef}
          style={{}}
        >
          <Translate en="Submit" pt="Enviar" />
          <span className="selected-item">
            <DualTranslate>{selectedItem?.name}</DualTranslate>
          </span>
          <span style={{ marginRight: '6px' }}>=</span>
          <SelectedAreasCircles selectedArea={selectedArea} />
        </Button>
      </Space>

      <MouseFollowingContent
        active={Boolean(selectedItemId) && (!selectedArea || selectedItemId !== previouslySelectedItemId)}
        contained
      >
        <ItemCard
          id={selectedItemId ?? ''}
          width={100}
          text={items[selectedItemId ?? '']?.name}
          className={getAnimationClass('pulse', { infinite: true, speed: 'faster' })}
        />
      </MouseFollowingContent>

      <DiagramSection
        width={width}
        onSelectArea={onSelectArea}
        diagrams={diagrams}
        items={items}
        currentItem={
          selectedItem?.id && selectedArea && selectedItemId === previouslySelectedItemId
            ? selectedItem
            : undefined
        }
        currentItemPosition={selectedArea ?? undefined}
      />

      <RuleInstruction type="action">
        <Translate
          en={
            <>
              Select one of your things and place them in one of the areas of the diagram. If there are
              already things there, you can try to base your placement off of them.
              <br />
              The goal is to correctly place your things in the diagram based on the secret rules of each
              area.
              <br />
              If you place it right, you can place another thing. If you place it wrong, you will receive a
              new thing and it will be the next player's turn.
            </>
          }
          pt={
            <>
              Selecione uma de suas coisas e coloque-as em uma das áreas do diagrama. Se já houver coisas lá,
              você pode tentar basear sua colocação nelas.
              <br />
              O objetivo é colocar corretamente suas coisas no diagrama com base nas regras secretas de cada
              área.
              <br />
              Se você colocar certo, poderá colocar outra coisa. Se você colocar errado, receberá uma nova
              coisa e será a vez do próximo jogador.
            </>
          }
        />
      </RuleInstruction>

      <Container
        contained
        title={
          <>
            <Translate pt="Suas coisas" en="Your items" />{' '}
            <Tooltip
              title={
                <Translate en="Items to place and total items" pt="Itens para posicionar e total de itens" />
              }
            >
              <Tag bordered={false} icon={<AimOutlined />}>
                {(user.hand ?? []).length}/{targetItemCount}
              </Tag>
            </Tooltip>
          </>
        }
      >
        <Flex gap={8} justify="center">
          {(user.hand ?? []).map((itemId: string) => (
            <TransparentButton
              key={itemId}
              onClick={() => {
                setPreviouslySelectedItemId(selectedItemId || itemId);
                setSelectedItemId(itemId);
              }}
              active={itemId === selectedItem.id}
            >
              <ItemCard id={itemId} width={100} text={items[itemId]?.name} />
            </TransparentButton>
          ))}
        </Flex>
      </Container>

      <TurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayer.id}
        additionalInfoParser={getPlayerItemsLeft}
      />
    </Step>
  );
}
