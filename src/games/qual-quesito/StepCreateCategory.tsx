import { mockSentence } from 'mock/sentence';
import { useState } from 'react';
// Ant Design Resources
import { RedoOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';
// Hooks
import { useLoading } from 'hooks/useLoading';
import { useMock } from 'hooks/useMock';
// Components
import { SendButton } from 'components/buttons';
import { Popconfirm } from 'components/general/Popconfirm';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { SubmitCategoryPayload } from './utils/types';
import { ItemsHand } from './components/ItemsHand';
import { PlayersHandsCounts } from './components/PlayersHandsCounts';

type StepCreateCategoryProps = {
  players: GamePlayers;
  user: GamePlayer;
  cardsDict: Dictionary<Item>;
  onSubmitCategory: (payload: SubmitCategoryPayload) => void;
  onSkipTurn: () => void;
  turnOrder: GameOrder;
} & Pick<StepProps, 'announcement'>;

export function StepCreateCategory({
  players,
  announcement,
  user,
  cardsDict,
  onSubmitCategory,
  onSkipTurn,
  turnOrder,
}: StepCreateCategoryProps) {
  const { isLoading } = useLoading();
  const [newCategory, setNewCategory] = useState<string>('');

  useMock(() => {
    if (user.hand.length < 2) {
      onSkipTurn();
    } else {
      onSubmitCategory({ category: mockSentence('long') });
    }
  });

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Qual o quesito?</>}
          en={<>What is the category?</>}
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Escreva a categoria que conecte <strong>pelo menos 2 de suas coisas.</strong>
              <br />
              Tente ser bem específico para que outros jogadores não consigam adicionar coisas facilmente à
              sua categoria!
              <br />• A categoria não pode ser "meta", do tipo "coisas que os outros jogadores não tem",
              "coisas que comi ontem", etc.
              <br />• Também tem que ser relacionada ao significado da coisa, não à imagem dela{' '}
              <em>(durante a votação, apenas o nome da coisa será mostrado)</em>.
            </>
          }
          en={
            <>
              Write a category that matches <strong>at least 2 of your things.</strong>
              <br />
              Try to be very specific so that other players can't easily add things to your category!
              <br />• The category can't be "meta", like "things that other players don't have", "things I ate
              yesterday", etc.
              <br />• It also has to be related to the meaning of the thing, not its image{' '}
              <em>(during voting, only the name of the thing will be shown)</em>.
            </>
          }
        />
      </RuleInstruction>

      {user.hand.length < 2 && (
        <RuleInstruction type="event">
          <Translate
            pt={
              <>
                Você precisa de pelo menos 2 coisas na mão para criar uma categoria. Então só resta pular sua
                vez.
              </>
            }
            en={
              <>
                You need at least 2 things in your hand to create a category. So you can only skip your turn.
              </>
            }
          />
        </RuleInstruction>
      )}

      <SpaceContainer className="my-6">
        <Input
          size="large"
          placeholder="Escreva sua categoria aqui..."
          disabled={isLoading || user.hand.length < 2}
          onChange={(e) => setNewCategory(e.target.value)}
        />

        <SendButton
          size="large"
          disabled={newCategory.trim() === ''}
          onClick={() => {
            onSubmitCategory({
              category: newCategory,
            });
          }}
        >
          <Translate
            pt="Enviar categoria"
            en="Submit category"
          />
        </SendButton>

        <Popconfirm
          title={
            <Translate
              pt="Tem certeza que deseja pular sua vez?"
              en="Are you sure you want to skip your turn?"
            />
          }
          description={
            <Translate
              pt="Você ganhará uma nova coisa para sua mão."
              en="You will get a new thing for your hand."
            />
          }
          onConfirm={onSkipTurn}
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
      </SpaceContainer>

      <ItemsHand
        hand={user.hand ?? []}
        cardsDict={cardsDict}
      />

      <PlayersHandsCounts
        players={players}
        turnOrder={turnOrder}
      />
    </Step>
  );
}
