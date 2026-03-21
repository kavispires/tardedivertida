import { Fragment, useState } from 'react';
// Ant Design Resources
import { Flex, Modal } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
import { useLoading } from 'hooks/useLoading';
// Components
import { SendButton } from 'components/buttons';
import { ImageCardButton } from 'components/image-cards';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { Instruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { ClientCard, SubmitPlayCardPayload, Teller } from './utils/types';
import { TellerBoard } from './components/TellerBoard';
import { BankClient } from './components/BankClient';
import { DrawDecksModal } from './components/DrawDecksModal';
import { PeopleOrder } from './components/PeopleOrder';

type StepAnimatePreviousActionProps = {
  players: GamePlayers;
  user: GamePlayer;
  deckDict: Dictionary<ClientCard>;
  drawDeck: UID[];
  tellers: Dictionary<Teller>;
  activePlayer: GamePlayer;
  goToNextStep: () => void;
  isTheActivePlayer: boolean;
  previousPlayer: GamePlayer;
  onSubmitCard: (payload: SubmitPlayCardPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepAnimatePreviousAction({
  announcement,
  tellers,
  deckDict,
  user,
  isTheActivePlayer,
  onSubmitCard,
  drawDeck,
}: StepAnimatePreviousActionProps) {
  const { isLoading } = useLoading();
  const [tellerId, setTellerId] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const cardWidth = useCardWidth(8, { maxWidth: 96 });

  const tellersList = Object.values(tellers);

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>?</>}
          en={<>?</>}
        />
      </StepTitle>

      <Instruction contained>
        <Translate
          pt={<>?</>}
          en={<>?</>}
        />
      </Instruction>

      <TellerBoard
        teller={tellersList[0]}
        deckDict={deckDict}
        cardWidth={cardWidth}
        onSelectTeller={cardId ? setTellerId : undefined}
      />
      <TellerBoard
        teller={tellersList[1]}
        deckDict={deckDict}
        cardWidth={cardWidth}
        onSelectTeller={cardId ? setTellerId : undefined}
      />
      <TellerBoard
        teller={tellersList[2]}
        deckDict={deckDict}
        cardWidth={cardWidth}
        onSelectTeller={cardId ? setTellerId : undefined}
      />

      <DrawDecksModal
        open={!!tellerId && !!cardId}
        onClose={() => setTellerId(null)}
        onSubmitCard={onSubmitCard}
        deckDict={deckDict}
        drawDeck={drawDeck}
        cardWidth={cardWidth}
        selectedCardId={cardId}
        selectedTellerId={tellerId}
      />

      <Instruction contained>
        My hand
        <Flex gap={6}>
          {user?.hand?.map((cardId: string) => (
            <Fragment key={cardId}>
              <ViewIf condition={!isTheActivePlayer}>
                <BankClient
                  cardId={cardId}
                  deckDict={deckDict}
                  cardWidth={cardWidth}
                />
              </ViewIf>

              <ViewIf condition={isTheActivePlayer}>
                <ImageCardButton
                  cardId={deckDict[cardId].imageId}
                  onClick={() => setCardId(cardId)}
                >
                  <BankClient
                    cardId={cardId}
                    deckDict={deckDict}
                    cardWidth={cardWidth}
                  />
                </ImageCardButton>
              </ViewIf>
            </Fragment>
          ))}
        </Flex>
      </Instruction>

      <PeopleOrder />
    </Step>
  );
}
