// Ant Design Resources
import { Flex } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
import type { ItemData } from 'types/tdr';
// Icons
import { ApplauseIcon } from '@icons/ApplauseIcon';
import { ArrowIcon } from '@icons/ArrowIcon';
import { BoxEqualIcon } from '@icons/BoxEqualIcon';
import { CheckMarkIcon } from '@icons/CheckMarkIcon';
import { CrownIcon } from '@icons/CrownIcon';
import { DiagramIcon } from '@icons/DiagramIcon';
import { GarbageIcon } from '@icons/GarbageIcon';
import { SkullIcon } from '@icons/SkullIcon';
// Components
import { ItemCard } from '@components/cards/ItemCard';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { Surface } from '@components/layout/Surface';
import { PhaseAnnouncement } from '@components/phases/PhaseAnnouncement';
import { PlayerAvatarName } from '@components/player/PlayerAvatarName';
// Internal
import { OUTCOME } from '../utils/constants';
import type { Guess } from '../utils/types';
import { SelectedAreasCircles } from './SelectedAreasCircles';

type AnnouncementProps = {
  activePlayer: GamePlayer;
  previousActivePlayer: GamePlayer;
  isTheActivePlayer: boolean;
  previousGuess: Guess | null;
  currentRound: number;
  items: Dictionary<ItemData>;
  judgeId: UID;
};

export function Announcement({
  activePlayer,
  previousActivePlayer,
  previousGuess,
  currentRound,
  items,
  isTheActivePlayer,
  judgeId,
}: AnnouncementProps) {
  if (!previousGuess) {
    return (
      <PhaseAnnouncement
        icon={<DiagramIcon />}
        title={
          <Translate
            pt="Vamos começar!"
            en="Let's start!"
          />
        }
        currentRound={currentRound}
        type="overlay"
        duration={20}
      >
        <Surface>
          <Translate
            en="Every turn a player will be placing one of their things in the correct area of the Venn diagram.<br/>If you get it right, you may place another thing.<br/>If you get it wrong, you will receive a new thing, and it's the next player's turn.<br/>The themes of each area are secret and it's up to you to figure out the logic!<br/>Let's start with {player}."
            pt="A cada rodada um jogador irá colocar uma das suas coisas na área correta do diagrama.<br/>Se você acertar, poderá colocar outra outra.<br/>Se você errar, receberá uma coisa nova, e será a vez do próximo jogador.<br/>Os temas de cada área são secretos e cabe a você descobrir a lógica!<br/>Vamos começar com {player}."
            values={{
              player: (
                <PlayerAvatarName
                  player={activePlayer}
                  addressUser
                />
              ),
            }}
          />
        </Surface>
      </PhaseAnnouncement>
    );
  }

  const item = items[previousGuess.itemId];

  if (judgeId === previousActivePlayer.id) {
    return (
      <PhaseAnnouncement
        icon={
          <Flex
            gap={6}
            justify="center"
            align="center"
            style={{ height: '100%' }}
          >
            <ItemCard
              itemId={item.id}
              width={84}
            />{' '}
            <Icon
              icon={<ArrowIcon />}
              size="large"
            />{' '}
            <SelectedAreasCircles
              selectedArea={previousGuess.correctArea}
              size={75}
            />
          </Flex>
        }
        title={
          <Translate
            pt="O Juiz colocou esse item para ajudar"
            en="The Judge placed this item to help"
          />
        }
        currentRound={currentRound}
        type="overlay"
        duration={7}
      >
        <Surface>
          <Translate
            en="So, does it help?"
            pt="E ai, ajuda?"
          />
        </Surface>
      </PhaseAnnouncement>
    );
  }

  if (previousGuess.outcome === OUTCOME.CONTINUE) {
    return (
      <PhaseAnnouncement
        icon={
          <Flex
            gap={6}
            justify="center"
            align="center"
            style={{ height: '100%' }}
          >
            <ItemCard
              itemId={item.id}
              width={84}
            />{' '}
            <Icon
              icon={<ArrowIcon />}
              size="large"
            />{' '}
            <SelectedAreasCircles
              selectedArea={previousGuess.correctArea}
              size={75}
            />
            <Icon
              icon={<BoxEqualIcon />}
              size="large"
            />
            <Icon
              icon={<ApplauseIcon />}
              size={75}
            />
          </Flex>
        }
        title={
          <Translate
            pt="Muito bem!"
            en="Good job!"
          />
        }
        currentRound={currentRound}
        type="overlay"
        duration={7}
      >
        <Surface>
          <Translate
            en="{player} got it right! {pronoun} may place another thing."
            pt="{player} acertou! {pronoun} pode colocar outra coisa."
            values={{
              player: (
                <PlayerAvatarName
                  player={activePlayer}
                  addressUser
                />
              ),
              pronoun: isTheActivePlayer ? (
                <Translate
                  en="You"
                  pt="Você"
                />
              ) : (
                <Translate
                  en="They"
                  pt="Ele/Ela"
                />
              ),
            }}
          />
        </Surface>
      </PhaseAnnouncement>
    );
  }

  return (
    <PhaseAnnouncement
      icon={
        <>
          <Flex
            gap={6}
            justify="center"
            align="center"
            style={{ height: '100%' }}
          >
            <ItemCard
              itemId={item.id}
              width={84}
            />{' '}
            <Icon
              icon={<ArrowIcon />}
              size="small"
            />{' '}
            <SelectedAreasCircles
              selectedArea={previousGuess.suggestedArea}
              size={50}
            />
            <Icon
              icon={<BoxEqualIcon />}
              size="small"
            />
            <Icon
              icon={<SkullIcon />}
              size={50}
            />
          </Flex>
          <Flex
            gap={6}
            justify="center"
            align="center"
            style={{ height: '100%', marginTop: 16 }}
          >
            <ItemCard
              itemId={item.id}
              width={84}
            />{' '}
            <Icon
              icon={<ArrowIcon />}
              size="small"
            />{' '}
            <SelectedAreasCircles
              selectedArea={previousGuess.correctArea}
              size={50}
            />
            <Icon
              icon={<BoxEqualIcon />}
              size="small"
            />
            <Icon
              icon={<CheckMarkIcon />}
              size={50}
            />
          </Flex>
        </>
      }
      title={
        <Translate
          pt="{player} errou... Próximo jogador!"
          en="{player} got it wrong... Next player!"
          values={{
            player: <PlayerAvatarName player={previousActivePlayer} />,
          }}
        />
      }
      currentRound={currentRound}
      type="overlay"
      duration={7}
    >
      <Surface>
        <Translate
          en="It's {player}'s turn."
          pt="É a vez do(a) {player}."
          values={{
            player: <PlayerAvatarName player={activePlayer} />,
          }}
        />
      </Surface>
    </PhaseAnnouncement>
  );
}

type GameOverIconProps = {
  items: Dictionary<ItemData>;
  lastGuess: Guess;
};

export const GameOverIcon = ({ items, lastGuess }: GameOverIconProps) => {
  const item = items[lastGuess.itemId];
  const isWin = lastGuess.outcome === OUTCOME.WIN;
  return (
    <Flex
      gap={6}
      justify="center"
      align="center"
      style={{ height: '100%' }}
    >
      <ItemCard
        itemId={item.id}
        text={item.name}
        width={100}
      />{' '}
      <Icon
        icon={<ArrowIcon />}
        size="large"
      />{' '}
      <SelectedAreasCircles
        selectedArea={lastGuess.correctArea}
        size={75}
      />
      <Icon
        icon={<BoxEqualIcon />}
        size="large"
      />
      <Icon
        icon={isWin ? <CrownIcon /> : <GarbageIcon />}
        size={125}
      />
    </Flex>
  );
};
