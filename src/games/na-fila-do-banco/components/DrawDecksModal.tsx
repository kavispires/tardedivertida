// Ant Design Resources
import { Modal } from 'antd';
// Components
import { ImageCard, ImageCardButton } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { RuleInstruction } from 'components/text';
// Internal
import type { ClientCard, SubmitPlayCardPayload } from '../utils/types';

type DrawDecksModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmitCard: (payload: SubmitPlayCardPayload) => void;
  deckDict: Dictionary<ClientCard>;
  drawDeck: UID[];
  cardWidth: number;
  selectedCardId: UID | null;
  selectedTellerId: string | null;
};

export function DrawDecksModal({
  open,
  onClose,
  onSubmitCard,
  deckDict,
  drawDeck,
  cardWidth,
  selectedCardId,
  selectedTellerId,
}: DrawDecksModalProps) {
  const card1 = drawDeck[0];
  const card2 = drawDeck[1];
  const card3 = drawDeck[2];

  return (
    <Modal
      title={
        <Translate
          pt="Por último, escolha uma nova carta"
          en="Finally, choose a new card"
        />
      }
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <RuleInstruction
        type="action"
        className="m-0"
      >
        <Translate
          pt="Selecione uma carta nova para sua mão. Aqui você vê qual baralho (jogador) a carta pertence, mas não sabe qual o tipo de cliente ela é, escolha com sabedoria."
          en="Select a new card for your hand. Here you can see which player's deck the card belongs to, but you don't know the type of client it is, choose wisely."
        />
      </RuleInstruction>

      <SpaceContainer>
        {card1 && (
          <ImageCardButton
            cardId={`nfdb-${deckDict[drawDeck[0]].color}-back`}
            throttle
            onClick={() =>
              onSubmitCard({ cardId: drawDeck[0], tellerId: selectedTellerId ?? '', newCardId: card1 })
            }
            buttonPosition="bottom"
          >
            <ImageCard
              cardId={`nfdb-${deckDict[drawDeck[0]].color}-back`}
              cardWidth={cardWidth}
            />
          </ImageCardButton>
        )}
        {card2 && (
          <ImageCardButton
            cardId={`nfdb-${deckDict[drawDeck[1]].color}-back`}
            throttle
            onClick={() =>
              onSubmitCard({ cardId: drawDeck[1], tellerId: selectedTellerId ?? '', newCardId: card2 })
            }
            buttonPosition="bottom"
          >
            <ImageCard
              cardId={`nfdb-${deckDict[drawDeck[1]].color}-back`}
              cardWidth={cardWidth}
            />
          </ImageCardButton>
        )}
        {card3 && (
          <ImageCardButton
            cardId={`nfdb-${deckDict[drawDeck[2]].color}-back`}
            throttle
            onClick={() =>
              onSubmitCard({ cardId: drawDeck[2], tellerId: selectedTellerId ?? '', newCardId: card3 })
            }
            buttonPosition="bottom"
          >
            <ImageCard
              cardId={`nfdb-${deckDict[drawDeck[2]].color}-back`}
              cardWidth={cardWidth}
            />
          </ImageCardButton>
        )}
      </SpaceContainer>
    </Modal>
  );
}
