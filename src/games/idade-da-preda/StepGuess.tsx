// Ant Design Resources
import { Divider, Flex } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayers, GamePlayer } from 'types/player';
import type { Item } from 'types/tdr';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useMock } from 'hooks/useMock';
import { useVotingMatch } from 'hooks/useVotingMatch';
// Utils
import { getEntryId, parseEntryId } from 'utils/helpers';
// Components
import { PlayerAvatar } from 'components/avatars';
import { SendButton, TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { DevButton } from 'components/debug';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle, TextHighlight } from 'components/text';
import { SpeechBubble } from 'components/text/SpeechBubble';
// Internal
import type { Concept, NewNameEntry, SubmitGuessesPayload } from './utils/types';
import { useSpriteWidth } from './utils/useSpriteWidth';
import { mockGuesses } from './utils/mock';
import { ConceptsCollapse } from './components/ConceptsCollapse';

type StepGuessProps = {
  players: GamePlayers;
  user: GamePlayer;
  basicConcepts: Concept[];
  concepts: Concept[];
  round: GameRound;
  items: Dictionary<Item>;
  pool: Item[];
  newNames: NewNameEntry[];
  onSubmitGuesses: (payload: SubmitGuessesPayload) => void;
} & Pick<StepProps, 'announcement'>;

export function StepGuess({
  user,
  players,
  announcement,
  items,
  concepts,
  basicConcepts,
  pool,
  newNames,
  onSubmitGuesses,
}: StepGuessProps) {
  const { dualTranslate } = useLanguage();

  const itemWidth = useSpriteWidth();
  const { votes, activateItem, isVotingComplete, isItemActive } = useVotingMatch(
    'player',
    true,
    Object.keys(players).length,
    {},
  );

  // Dev only: Mock action to simulate guesses
  useMock(() => onSubmitGuesses(mockGuesses(user, pool, newNames)));

  const handleSubmitGuesses = () => {
    if (!isVotingComplete) return;
    const guesses = Object.keys(votes).reduce((acc: SubmitGuessesPayload['guesses'], entryId) => {
      const playerId = parseEntryId(entryId)[1];
      if (user.id === playerId) {
        // If the user is the one making the guess, we can skip it
        return acc;
      }
      acc[playerId] = votes[entryId];
      return acc;
    }, {});
    onSubmitGuesses({ guesses });
  };

  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle>
        <Translate
          pt={<>O que os jogadores estão falando?</>}
          en={<>What are the players talking about?</>}
        />
      </StepTitle>

      <RuleInstruction type="action">
        <Translate
          pt={
            <>
              Faça pares de nomes e items. Escolha um nome e depois o item que ele representa ou vice-versa, e
              então aperte enviar!
            </>
          }
          en={
            <>
              Make pairs of names and items. Choose a name and then the item it represents or vice versa, and
              then press send!
            </>
          }
        />
      </RuleInstruction>

      <SpaceContainer className="mt-4 contained" orientation="vertical">
        <Flex justify="center" align="center" wrap="wrap" gap={6} className="mb-2">
          {newNames.map((entry) => {
            const entryId = getEntryId(['player', entry.playerId]);
            return (
              <TransparentButton
                key={entry.id}
                onClick={() => activateItem(entryId)}
                activeClass="idp-selected"
                active={isItemActive(entryId)}
              >
                <Flex vertical align="center" gap={6}>
                  <Flex align="center" gap={6}>
                    <PlayerAvatar avatarId={players[entry.playerId].avatarId} />
                    <SpeechBubble>
                      <TextHighlight className="idp-item-name-speech">{entry.name}</TextHighlight>
                    </SpeechBubble>
                  </Flex>
                  {votes[entryId] && <ItemCard itemId={votes[entryId]} width={itemWidth} />}
                </Flex>
              </TransparentButton>
            );
          })}
        </Flex>
        <Divider orientation="vertical" />

        <Flex justify="center" align="center" wrap="wrap" gap={6} className="my-2">
          {pool.map((item) => (
            <TransparentButton
              key={item.id}
              onClick={() => activateItem(item.id)}
              activeClass="idp-selected"
              active={isItemActive(item.id)}
              className="idp-pool-item"
            >
              <ItemCard itemId={item.id} width={itemWidth} title={dualTranslate(item.name)} />
            </TransparentButton>
          ))}
        </Flex>

        <Divider orientation="vertical" />

        <Flex justify="center" align="center" wrap="wrap" gap={6}>
          <DevButton onClick={() => onSubmitGuesses(mockGuesses(user, pool, newNames))}>
            Mock Guesses
          </DevButton>
          <SendButton size="large" disabled={!isVotingComplete} onClick={handleSubmitGuesses}>
            <Translate pt="Enviar Palpites" en="Send Guesses" />
          </SendButton>
        </Flex>
      </SpaceContainer>

      <ConceptsCollapse
        user={user}
        players={players}
        items={items}
        basicConcepts={basicConcepts}
        concepts={concepts}
      />
    </Step>
  );
}
