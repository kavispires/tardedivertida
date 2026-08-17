import { useRef, useState } from 'react';
// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GameRound, GamePlayers, GamePlayer } from 'types/game';
import type { ItemData } from 'types/tdr';
// Hooks
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { useMock } from '@hooks/useMock';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { ItemCard } from '@components/cards/ItemCard';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { MouseFollowingContent } from '@components/mouse/MouseFollowingContent';
import { PlayersTurnOrder } from '@components/players/PlayersTurnOrder';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type {
  DiagramArea,
  DiagramExamples,
  Solutions,
  SubmitEvaluationFixPayload,
  SubmitItemPlacementPayload,
} from './utils/types';
import { mockDiagramSelection } from './utils/mock';
import { getPlayerItemsLeft } from './utils/helper';
import { DiagramRules } from './components/RulesBlobs';
import { SelectedAreasCircles } from './components/SelectedAreasCircles';
import { DiagramSection } from './components/DiagramSection';
import { RoundAlert } from './components/RoundAlert';
import { EvaluationModal } from './components/EvaluationModal';
import { MyThings } from './components/MyThings';

type StepPlaceItemProps = {
  players: GamePlayers;
  user: GamePlayer;
  examples: DiagramExamples;
  diagrams: Dictionary<DiagramArea>;
  items: Dictionary<ItemData>;
  turnOrder: GameOrder;
  activePlayer: GamePlayer;
  onSubmitItemPlacement: (payload: SubmitItemPlacementPayload) => void;
  onSubmitEvaluationFix: (payload: SubmitEvaluationFixPayload) => void;
  targetItemCount: number;
  round: GameRound;
  isTheJudge: boolean;
  solutions: Solutions;
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
  onSubmitEvaluationFix,
  targetItemCount,
  round,
  isTheJudge,
  solutions,
}: StepPlaceItemProps) {
  const scrollToSubmitRef = useRef<HTMLButtonElement>(null);

  const [width, ref] = useCardWidthByContainerRef(2, { maxWidth: 1000 });
  const [previouslySelectedItemId, setPreviouslySelectedItemId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(isTheJudge ? 'AWC' : null);
  const onSelectArea = (area: string) => {
    setPreviouslySelectedItemId(selectedItemId || null);
    setSelectedArea(area);
    if (selectedItemId && scrollToSubmitRef.current) {
      scrollToSubmitRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedItem = items[selectedItemId ?? ''] ?? {
    name: { en: '', pt: '' },
  };

  useMock(() => {
    onSubmitItemPlacement(mockDiagramSelection(user.hand ?? [], diagrams));
  });

  const [itemToFox, setItemToFix] = useState<{ itemId: string; currentArea: string } | null>(null);
  const onOpenFixModal = (itemId: string, currentArea: string) => {
    setItemToFix({ itemId, currentArea });
  };

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <div
        ref={ref}
        style={{ width: '100%' }}
      />
      <StepTitle>
        {isTheJudge ? (
          <Translate
            pt="Como Juiz, coloque uma coisa no diagrama para ajudar os outros jogadores"
            en="As the Judge, place an item on the diagram to help the other players"
          />
        ) : (
          <Translate
            pt="Selecione um item e uma área do diagrama que você acha que ele pode se encaixar"
            en="Select an item and an area of the diagram where you think it could fit"
          />
        )}
      </StepTitle>

      <RoundAlert round={round} />

      {itemToFox && (
        <EvaluationModal
          item={items[itemToFox.itemId]}
          onSubmitEvaluation={(newEvaluation: string) => {
            onSubmitEvaluationFix({
              newEvaluation,
              itemId: itemToFox.itemId,
              currentArea: itemToFox.currentArea,
            });
            setItemToFix(null);
          }}
          solutions={solutions}
          onCancel={() => setItemToFix(null)}
        />
      )}

      <DiagramRules examples={examples} />

      {isTheJudge ? (
        <RuleInstruction type="action">
          <Translate
            en="As the judge, place one of your things on the diagram to help the other players.<br/><strong>Simply choose one thing</strong>, it will be evaluated in the next phase.<br />Clin on each area of the diagram to see each secret rule on the left."
            pt="Como juiz, coloque uma de suas coisas no diagrama para ajudar os outros jogadores.<br/><strong>Escolha uma coisa</strong>, ela será avaliada na próxima fase.<br/>Clique em cada area do diagrama para ver cada regra secreta à esquerda."
          />
        </RuleInstruction>
      ) : (
        <RuleInstruction type="action">
          <Translate
            en="Select one of your things and place them in one of the areas of the diagram. If there are already things there, you can try to base your placement off of them.<br/>The goal is to correctly place your things in the diagram based on the secret rules of each area.<br/>If you place it right, you can place another thing. If you place it wrong, you will receive a new thing and it will be the next player's turn."
            pt="Selecione uma de suas coisas e coloque-as em uma das áreas do diagrama. Se já houver coisas lá, você pode tentar basear sua colocação nelas.<br/>O objetivo é colocar corretamente suas coisas no diagrama com base nas regras secretas de cada área.<br/>Se você colocar certo, poderá colocar outra coisa. Se você colocar errado, receberá uma nova coisa e será a vez do próximo jogador."
          />
        </RuleInstruction>
      )}

      <MouseFollowingContent
        active={Boolean(selectedItemId) && (!selectedArea || selectedItemId !== previouslySelectedItemId)}
        contained
      >
        <ItemCard
          itemId={selectedItemId ?? ''}
          width={96}
          text={items[selectedItemId ?? '']?.name}
          className={getAnimationClass('pulse', {
            infinite: true,
            speed: 'faster',
          })}
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
        reevaluation={{
          onOpenFixModal,
          isTheJudge,
        }}
        solutions={isTheJudge ? solutions : undefined}
      >
        <MyThings
          hand={user.hand ?? []}
          items={items}
          total={targetItemCount}
          maxHeight={width * (diagrams?.C ? 1 : 0.7)}
          activeItemId={selectedItemId}
          onClick={(itemId) => {
            setPreviouslySelectedItemId(selectedItemId || itemId);
            setSelectedItemId(itemId);
          }}
        />
      </DiagramSection>

      <SpaceFloat
        enabled={Boolean(selectedArea) && Boolean(selectedItemId)}
        className="mt-10"
      >
        <SendButton
          size="large"
          disabled={!selectedArea || !selectedItemId}
          onClick={() => {
            if (selectedArea && selectedItemId) {
              onSubmitItemPlacement({
                position: selectedArea,
                itemId: selectedItemId,
              });
            }
          }}
          ref={scrollToSubmitRef}
        >
          <Flex
            gap={4}
            align="center"
          >
            <Translate
              en="Submit"
              pt="Enviar"
            />
            <span className="selected-item">
              <DualTranslate>{selectedItem?.name}</DualTranslate>
            </span>
            <span style={{ marginRight: '6px' }}>=</span>
            <SelectedAreasCircles selectedArea={selectedArea} />
          </Flex>
        </SendButton>
      </SpaceFloat>

      <PlayersTurnOrder
        players={players}
        order={turnOrder}
        activePlayerId={activePlayer.id}
        additionalInfoParser={getPlayerItemsLeft}
      />
    </Step>
  );
}
