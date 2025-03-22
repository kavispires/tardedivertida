// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GameRound } from 'types/game';
import type { GamePlayer, GamePlayers } from 'types/player';
// Icons
import { SkullIcon } from 'icons/SkullIcon';
import { SpeechBubbleThumbsDownIcon } from 'icons/SpeechBubbleThumbsDownIcon';
import { SpeechBubbleThumbsUpIcon } from 'icons/SpeechBubbleThumbsUpIcon';
// Components
import { Card } from 'components/cards';
import { ItemCard } from 'components/cards/ItemCard';
import { HostNextPhaseButton } from 'components/host';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { TurnOrder } from 'components/players';
import { Step, type StepProps } from 'components/steps';
import { RuleInstruction, StepTitle, TextHighlight } from 'components/text';
// Internal
import type { WordLength } from './utils/types';
import { WORD_LENGTH_STATUS } from './utils/constants';
import { ItemsGrid } from './components/ItemsGrid';
import { WordLengths } from './components/WordLengths';

type StepResultsProps = {
  players: GamePlayers;
  creator: GamePlayer;
  turnOrder: PlayerId[];
  items: string[];
  wordLengths: WordLength[];
  newWord: string;
  guessPlayersPerItem: Record<string, PlayerId[]>;
  beginsWith: string;
  endsWith: string;
  names: string[];
  namesIndexes: number[];
  outcome: keyof typeof WORD_LENGTH_STATUS;
  round: GameRound;
} & Pick<StepProps, 'announcement'>;

export function StepResults({
  players,
  creator,
  turnOrder,
  announcement,
  items,
  wordLengths,
  newWord,
  guessPlayersPerItem,
  beginsWith,
  endsWith,
  names,
  namesIndexes,
  outcome,
  round,
}: StepResultsProps) {
  return (
    <Step fullWidth announcement={announcement}>
      <StepTitle icon={getIcon(outcome)}>{getTitle(outcome)}</StepTitle>

      <SpaceContainer>
        <Flex vertical align="center">
          <ItemCard id={beginsWith} />
          <TextHighlight className="center">{names[0]}</TextHighlight>
        </Flex>
        <Card size="large" hideHeader>
          <span className="created-word-begin">{newWord.slice(0, namesIndexes[0] + 1)}</span>
          <span className="created-word-end">{newWord.slice(namesIndexes[0] + 1)}</span>
        </Card>
        <Flex vertical align="center">
          <ItemCard id={endsWith} />
          <TextHighlight className="center">{names[1]}</TextHighlight>
        </Flex>
      </SpaceContainer>

      <RuleInstruction type="event">
        {outcome === WORD_LENGTH_STATUS.SOLVED && (
          <Translate
            en="There's now one less word length towards victory!"
            pt="Agora há um comprimento de palavra a menos em direção à vitória!"
          />
        )}
        {outcome === WORD_LENGTH_STATUS.ENDANGERED && (
          <Translate
            en="You got the items wrong, so the length becomes endangered. From now one, if this word length is used again and guessed wrong, the game is over."
            pt="Você errou os itens, então o comprimento se torna ameaçado. A partir de agora, se este comprimento de palavra for usado novamente e adivinhado errado, o jogo acaba."
          />
        )}
        {outcome === WORD_LENGTH_STATUS.FAILED && <Translate en="Loser." pt="Burro." />}
      </RuleInstruction>

      <ItemsGrid
        items={items}
        selectedItems={[]}
        targets={[beginsWith, endsWith]}
        results={{ guessPlayersPerItem, players }}
      />

      <HostNextPhaseButton round={round} withWaitingTimeBar />

      <WordLengths wordLengths={wordLengths} highlightLength={newWord.length} />

      <TurnOrder players={players} order={turnOrder} activePlayerId={creator.id} />
    </Step>
  );
}

const getTitle = (outcome: keyof typeof WORD_LENGTH_STATUS) => {
  if (outcome === WORD_LENGTH_STATUS.SOLVED) {
    return (
      <Translate
        pt="Parabéns a palavra foi definida corretamente!"
        en="Congratulations the word was correctly defined!"
      />
    );
  }

  if (outcome === WORD_LENGTH_STATUS.ENDANGERED) {
    return (
      <Translate pt="A palavra não foi definida corretamente." en="The word was not correctly defined." />
    );
  }

  return (
    <Translate
      en="You did not guess the items correctly for an endangered length so the game is over."
      pt="Você não adivinhou os itens corretamente para um comprimento ameaçado, então o jogo acabou."
    />
  );
};

const getIcon = (outcome: keyof typeof WORD_LENGTH_STATUS) => {
  if (outcome === WORD_LENGTH_STATUS.SOLVED) {
    return <SpeechBubbleThumbsUpIcon />;
  }

  if (outcome === WORD_LENGTH_STATUS.ENDANGERED) {
    return <SpeechBubbleThumbsDownIcon />;
  }

  return <SkullIcon />;
};
