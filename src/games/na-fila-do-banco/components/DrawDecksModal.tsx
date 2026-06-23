import clsx from 'clsx';
import { useState } from 'react';
// Ant Design Resources
import { Flex, Modal, Typography } from 'antd';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { ImageCard } from '@components/image-cards/ImageCard';
import { ImageCardButton } from '@components/image-cards/ImageCardButton';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type { ClientCard, SubmitPlayCardPayload } from '../utils/types';
import { ClientHighlight, DecksColorsHighlight } from './Highlights';

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
  const noCardsAnymore = !card1 && !card2 && !card3;
  const [newCardId, setNewCardId] = useState<string | null>(null);

  const card = deckDict[selectedCardId ?? ''];
  const cardType = card?.type;
  const cardColor = card?.color;

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
      footer={
        <Flex justify="flex-end">
          <SendButton
            onClick={() => {
              onSubmitCard({
                cardId: selectedCardId ?? '',
                tellerId: selectedTellerId ?? '',
                newCardId: newCardId ?? '',
              });
              onClose();
            }}
            disabled={noCardsAnymore ? false : !newCardId || !selectedTellerId || !selectedCardId}
          >
            <Translate
              pt="Enviar"
              en="Submit"
            />
          </SendButton>
        </Flex>
      }
    >
      <Typography.Paragraph>
        <Translate
          pt={
            <>
              Você selecionou <ClientHighlight clientId={cardType ?? ''} /> do baralho{' '}
              <DecksColorsHighlight deckColors={[cardColor ?? '']} /> para o{' '}
              <TextHighlight>Caixa {selectedTellerId}</TextHighlight>.
            </>
          }
          en={
            <>
              You selected <ClientHighlight clientId={cardType ?? ''} /> from the{' '}
              <DecksColorsHighlight deckColors={[cardColor ?? '']} /> deck for{' '}
              <TextHighlight>Teller {selectedTellerId}</TextHighlight>.
            </>
          }
        />
      </Typography.Paragraph>

      <Typography.Paragraph>
        {noCardsAnymore ? (
          <Translate
            pt="O baralho acabou, não há mais cartas para escolher. Simplesmente prossiga."
            en="The deck is empty, there are no more cards to choose. Simply proceed."
          />
        ) : (
          <Translate
            pt="Selecione uma carta nova para sua mão. Aqui você vê qual baralho (jogador) a carta pertence, mas não sabe qual o tipo de cliente ela é, escolha com sabedoria."
            en="Select a new card for your hand. Here you can see which player's deck the card belongs to, but you don't know the type of client it is, choose wisely."
          />
        )}
      </Typography.Paragraph>

      <SpaceContainer>
        {card1 && (
          <ImageCardButton
            cardId={`nfdb-${deckDict[drawDeck[0]].color}-back`}
            throttle
            onClick={() => setNewCardId(drawDeck[0])}
            buttonPosition="bottom"
          >
            <ImageCard
              cardId={`nfdb-${deckDict[drawDeck[0]].color}-back`}
              cardWidth={cardWidth}
              className={clsx({ 'f-selected-card': newCardId === drawDeck[0] })}
              preview={false}
            />
          </ImageCardButton>
        )}
        {card2 && (
          <ImageCardButton
            cardId={`nfdb-${deckDict[drawDeck[1]].color}-back`}
            throttle
            onClick={() => setNewCardId(drawDeck[1])}
            buttonPosition="bottom"
          >
            <ImageCard
              cardId={`nfdb-${deckDict[drawDeck[1]].color}-back`}
              cardWidth={cardWidth}
              className={clsx({ 'f-selected-card': newCardId === drawDeck[1] })}
              preview={false}
            />
          </ImageCardButton>
        )}
        {card3 && (
          <ImageCardButton
            cardId={`nfdb-${deckDict[drawDeck[2]].color}-back`}
            throttle
            onClick={() => setNewCardId(drawDeck[2])}
            buttonPosition="bottom"
          >
            <ImageCard
              cardId={`nfdb-${deckDict[drawDeck[2]].color}-back`}
              cardWidth={cardWidth}
              className={clsx({ 'f-selected-card': newCardId === drawDeck[2] })}
              preview={false}
            />
          </ImageCardButton>
        )}
      </SpaceContainer>
    </Modal>
  );
}
