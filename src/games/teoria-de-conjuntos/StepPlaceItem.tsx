import { useRef, useState } from 'react';
// Ant Design Resources
import { AimOutlined } from '@ant-design/icons';
import { Flex, Tag, Tooltip } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';
// Hooks
import { useCardWidthByContainerRef } from 'hooks/useCardWidth';
import { useMock } from 'hooks/useMock';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { SendButton, TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { DualTranslate, Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TitledContainer } from 'components/layout/TitledContainer';
import { MouseFollowingContent } from 'components/mouse/MouseFollowingContent';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
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
import { Solution } from './components/Solution';
import { EvaluationModal } from './components/EvaluationModal';

type StepPlaceItemProps = {
  players: GamePlayers;
  user: GamePlayer;
  examples: DiagramExamples;
  diagrams: Dictionary<DiagramArea>;
  items: Dictionary<Item>;
  turnOrder: GameOrder;
  activePlayer: GamePlayer;
  onSubmitItemPlacement: (payload: SubmitItemPlacementPayload) => void;
  onSubmitEvaluationFix: (payload: SubmitEvaluationFixPayload) => void;
  targetItemCount: number;
  round: GameRound;
  isJudge: boolean;
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
  isJudge,
  solutions,
}: StepPlaceItemProps) {
  const scrollToSubmitRef = useRef<HTMLButtonElement>(null);

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
        {isJudge ? (
          <Translate
            pt={<>Como Juiz, coloque uma coisa no diagrama para ajudar os outros jogadores</>}
            en={<>As the Judge, place an item on the diagram to help the other players</>}
          />
        ) : (
          <Translate
            pt={<>Selecione um item e uma área do diagrama que você acha que ele pode se encaixar</>}
            en={<>Select an item and an area of the diagram where you think it could fit</>}
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

      <SpaceContainer>
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
      </SpaceContainer>

      <MouseFollowingContent
        active={Boolean(selectedItemId) && (!selectedArea || selectedItemId !== previouslySelectedItemId)}
        contained
      >
        <ItemCard
          itemId={selectedItemId ?? ''}
          width={100}
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
          isJudge,
        }}
      />

      {isJudge ? (
        <RuleInstruction type="action">
          <Translate
            en={
              <>
                As the judge, place one of your things on the diagram to help the other players.
                <br />
                <strong>Simply choose one thing and place in the center of the diagram</strong>
                <br />
                You will evaluate it in the next phase.
              </>
            }
            pt={
              <>
                Como juiz, coloque uma de suas coisas no diagrama para ajudar os outros jogadores.
                <br />
                <strong>Escolha uma coisa e coloque no centro do diagrama</strong>
                <br />
                Você avaliará isso na próxima fase.
              </>
            }
          />
        </RuleInstruction>
      ) : (
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
                Selecione uma de suas coisas e coloque-as em uma das áreas do diagrama. Se já houver coisas
                lá, você pode tentar basear sua colocação nelas.
                <br />O objetivo é colocar corretamente suas coisas no diagrama com base nas regras secretas
                de cada área.
                <br />
                Se você colocar certo, poderá colocar outra coisa. Se você colocar errado, receberá uma nova
                coisa e será a vez do próximo jogador.
              </>
            }
          />
        </RuleInstruction>
      )}

      <TitledContainer
        contained
        title={
          <>
            <Translate
              pt="Suas coisas"
              en="Your items"
            />{' '}
            <Tooltip
              title={
                <Translate
                  en="Items to place and total items"
                  pt="Itens para posicionar e total de itens"
                />
              }
            >
              <Tag
                variant="filled"
                icon={<AimOutlined />}
              >
                {(user.hand ?? []).slice(0, 10).length}/{targetItemCount}
              </Tag>
            </Tooltip>
          </>
        }
      >
        <Flex
          gap={8}
          justify="center"
        >
          {(user.hand ?? []).slice(0, 10).map((itemId: string) => (
            <TransparentButton
              key={itemId}
              onClick={() => {
                setPreviouslySelectedItemId(selectedItemId || itemId);
                setSelectedItemId(itemId);
              }}
              active={itemId === selectedItem.id}
            >
              <ItemCard
                itemId={itemId}
                width={100}
                text={items[itemId]?.name}
              />
            </TransparentButton>
          ))}
        </Flex>
      </TitledContainer>

      {isJudge && (
        <TitledContainer
          contained
          title={
            <Translate
              pt="As Regras Secretas"
              en="The Secret Rules"
            />
          }
          contentProps={{ direction: 'vertical' }}
        >
          <Translate
            pt="Essas são as regras secretas de cada círculo, não fale elas com ninguém."
            en="These are the secret rules of each circle, don't tell them to anyone."
          />

          <Solution solutions={solutions} />
        </TitledContainer>
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
