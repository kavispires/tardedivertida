import { useState } from 'react';
// Ant Design Resources
import { RedoOutlined } from '@ant-design/icons';
import { Badge, Button } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
import type { ItemData } from 'types/tdr';
// Hooks
import { useLoading } from '@hooks/useLoading';
import { useMock } from '@hooks/useMock';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { TextCard } from '@components/cards/TextCard';
import { Popconfirm } from '@components/general/Popconfirm';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { PointsHighlight } from '@components/metrics/PointsHighlight';
import { Step, type StepProps } from '@components/steps/Step';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { StepTitle } from '@components/text/StepTitle';
// Internal
import type { SubmitCardsPayload } from './utils/types';
import { mockCardPlay } from './utils/mock';
import { CONSECUTIVE_REJECTION_PENALTY } from './utils/constants';
import { ItemsHand } from './components/ItemsHand';
import { ThingHighlight } from './components/Highlights';
import { PlayersHandsCounts } from './components/PlayersHandsCounts';

type StepSelectThingsProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<ItemData>;
  category: string;
  onSubmitCards: (payload: SubmitCardsPayload) => void;
  isTheCreator: boolean;
  creator: GamePlayer;
  turnOrder: GameOrder;
} & Pick<StepProps, 'announcement'>;

export function StepSelectThings({
  announcement,
  players,
  user,
  cardsDict,
  category,
  onSubmitCards,
  isTheCreator,
  creator,
  turnOrder,
}: StepSelectThingsProps) {
  const { isLoading } = useLoading();
  const [selectedItemsIds, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (itemId: string) => {
    if (selectedItemsIds.includes(itemId)) {
      setSelectedItems(selectedItemsIds.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItemsIds, itemId]);
    }
  };

  useMock(() => {
    const mockSelection = mockCardPlay(user.hand ?? [], isTheCreator);

    onSubmitCards({ cardsIds: mockSelection });
  });

  const orderRule = (
    <Translate
      pt="A ordem que você seleciona as coisas também é importante!
      <br/>
      Elas serão avaliadas em ordem e então, assim que uma coisa não é aprovada, as outras nem serão consideradas.
      <br/>
      Se suas coisas forem rejeitadas por duas rodadas seguidas, você perde pontos!"
      en="The order in which you select the things is also important!
      <br/>
      They will be evaluated in order and as soon as one thing is not approved, the others won't even be considered.
      <br/>
      <strong>If your things get rejected for two rounds in a row, you lose points!</strong>"
    />
  );

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle size="small">
        <Translate
          pt="O quesito é:"
          en="And the category is:"
        />
      </StepTitle>

      <SpaceContainer>
        <TextCard
          size="large"
          footer={
            <Translate
              pt={`Categoria criada por ${creator.name}`}
              en={`Category created by ${creator.name}`}
            />
          }
        >
          {category}
        </TextCard>
      </SpaceContainer>

      <RuleInstruction type="action">
        {isTheCreator ? (
          <Translate
            pt="Selecione pelo menos <thing>coisas</thing> que se encaixam à categoria criada."
            en="Select at least <thing>things</thing> that fit the created category."
            values={{
              thing: (text) => (
                <ThingHighlight>
                  <strong>2 {text}</strong>
                </ThingHighlight>
              ),
            }}
          />
        ) : (
          <Translate
            pt="Selecione <thing>uma ou mais coisas</thing> que podem se encaixar na categoria criada. Se você não tem nada que se encaixa, você pode pular sua vez."
            en="Select <thing>one or more things</thing> that may fit the created category. If you don't have anything that fits, you can skip your turn."
            values={{
              thing: (text) => <ThingHighlight>{text}</ThingHighlight>,
            }}
          />
        )}
        <br />
        {orderRule}
      </RuleInstruction>

      {user.wasRejectedOnPreviousRound && (
        <RuleInstruction type="alert">
          <Translate
            pt="<strong>Atenção</strong>: Uma ou mais de suas coisas foram rejeitadas na rodada anterior. Se isso acontecer novamente, você perderá {penalty}!"
            en="<strong>Attention</strong>: One or more of your things were rejected in the previous round. If this happens again, you will lose {penalty}!"
            values={{
              penalty: (
                <PointsHighlight
                  type="negative"
                  value={CONSECUTIVE_REJECTION_PENALTY}
                />
              ),
            }}
          />
        </RuleInstruction>
      )}

      <ItemsHand
        hand={user.hand ?? []}
        cardsDict={cardsDict}
        selectedItemsIds={selectedItemsIds}
        onSelectItem={handleSelectItem}
      />

      <SpaceFloat className="mt-6">
        <Badge
          count={selectedItemsIds.length}
          showZero
        >
          <SendButton
            size="large"
            disabled={isTheCreator ? selectedItemsIds.length < 2 : selectedItemsIds.length < 1 || isLoading}
            onClick={() => {
              onSubmitCards({
                cardsIds: selectedItemsIds,
              });
            }}
          >
            <Translate
              pt="Enviar coisas"
              en="Submit things"
            />
          </SendButton>
        </Badge>

        {!isTheCreator && (
          <Popconfirm
            title={
              <Translate
                pt="Tem certeza que deseja pular sua vez?"
                en="Are you sure you want to skip your turn?"
              />
            }
            description={
              <Translate
                pt="Não há penalidade em pular agora."
                en="There is no penalty for skipping now."
              />
            }
            onConfirm={() => onSubmitCards({ cardsIds: [] })}
            type="yes-no"
          >
            <Button
              size="large"
              disabled={isLoading}
              icon={<RedoOutlined />}
              type="dashed"
            >
              <Translate
                pt="Pular vez"
                en="Skip turn"
              />
            </Button>
          </Popconfirm>
        )}
      </SpaceFloat>

      <PlayersHandsCounts
        players={players}
        turnOrder={turnOrder}
      />
    </Step>
  );
}
