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
import { Button, Flex, Space } from 'antd';
import { MouseFollowingContent } from 'components/mouse/MouseFollowingContent';
import { useState } from 'react';
import { ItemCard } from 'components/cards/ItemCard';
import { TransparentButton } from 'components/buttons';
import { getAnimationClass } from 'utils/helpers';

import { SelectedAreasCircles } from './components/SelectedAreasCircles';
import { TurnOrder } from 'components/players';
import { Container } from 'components/general/Container';
import { DiagramSection } from './components/DiagramSection';
import { useMock } from 'hooks/useMock';
import { mockDiagramSelection } from './utils/mock';

type StepPlaceItemProps = {
  players: GamePlayers;
  user: GamePlayer;
  examples: DiagramExamples;
  diagrams: Dictionary<DiagramArea>;
  items: Dictionary<Item>;
  turnOrder: GameOrder;
  activePlayer: GamePlayer;
  onSubmitItemPlacement: (payload: SubmitItemPlacementPayload) => void;
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
}: StepPlaceItemProps) {
  const { isLoading } = useLoading();

  const [width, ref] = useCardWidthByContainerRef(2, { maxWidth: 1000 });
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

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

      <RuleInstruction type="rule">
        <DiagramRules examples={examples} />
      </RuleInstruction>

      <Space className="space-container">
        <Button
          type="primary"
          size="large"
          loading={isLoading}
          disabled={!selectedArea || !selectedItemId}
          onClick={() => onSubmitItemPlacement({ position: selectedArea!, itemId: selectedItemId! })}
        >
          <Flex gap={8}>
            <Translate en="Submit" pt="Enviar" />
            <span className="selected-item">
              <DualTranslate>{selectedItem?.name}</DualTranslate>
            </span>{' '}
            <span>=</span>
            <SelectedAreasCircles selectedArea={selectedArea} />
          </Flex>
        </Button>
      </Space>

      <MouseFollowingContent active={Boolean(selectedItemId) && !selectedArea} contained>
        <ItemCard
          id={selectedItemId ?? ''}
          width={100}
          text={items[selectedItemId ?? '']?.name}
          className={getAnimationClass('pulse', { infinite: true, speed: 'faster' })}
        />
      </MouseFollowingContent>

      <DiagramSection width={width} onSelectArea={setSelectedArea} diagrams={diagrams} items={items} />

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

      <Container contained title={<Translate pt="Suas coisas" en="Your items" />}>
        <Flex gap={8} justify="center">
          {(user.hand ?? []).map((itemId: string) => (
            <TransparentButton key={itemId} onClick={() => setSelectedItemId(itemId)}>
              <ItemCard id={itemId} width={100} text={items[itemId]?.name} />
            </TransparentButton>
          ))}
        </Flex>
      </Container>

      <TurnOrder players={players} order={turnOrder} activePlayerId={activePlayer.id} />
    </Step>
  );
}
