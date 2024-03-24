import { Flex } from 'antd';
import { AvatarName, IconAvatar } from 'components/avatars';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { PhaseAnnouncement } from 'components/phases';
import { Instruction } from 'components/text';
import { ApplauseIcon } from 'icons/ApplauseIcon';
import { ArrowIcon } from 'icons/ArrowIcon';
import { BoxEqualIcon } from 'icons/BoxEqualIcon';
import { DiagramIcon } from 'icons/DiagramIcon';
import { SkullIcon } from 'icons/SkullIcon';
import { GamePlayer } from 'types/player';
import { Item } from 'types/tdr';

import { OUTCOME } from '../utils/constants';
import { Guess } from '../utils/types';
import { SelectedAreasCircles } from './SelectedAreasCircles';

type AnnouncementProps = {
  activePlayer: GamePlayer;
  previousGuess: Guess | null;
  currentRound: number;
  items: Dictionary<Item>;
};

export function Announcement({ activePlayer, previousGuess, currentRound, items }: AnnouncementProps) {
  if (!previousGuess) {
    return (
      <PhaseAnnouncement
        icon={<DiagramIcon />}
        title={<Translate pt="Vamos começar!" en="Let's start!" />}
        currentRound={currentRound}
        type="overlay"
        duration={20}
      >
        <Instruction>
          <Translate
            en={
              <>
                Every turn a player will be placing one of their items in correct area of the Venn diagram.
                <br />
                If you get it right, you may place another item.
                <br />
                If you get it wrong, you will receive a new item, and it's the next player's turn.
                <br />
                The themes of each area are secret!
                <br />
                Let's start with <AvatarName player={activePlayer} addressUser />.
              </>
            }
            pt={
              <>
                A cada rodada um jogador irá colocar um de seus itens na área correta do diagrama de Venn.
                <br />
                Se você acertar, poderá colocar outro item.
                <br />
                Se você errar, receberá um novo item, e será a vez do próximo jogador.
                <br />
                Os temas de cada área são secretos!
                <br />
                Vamos começar com <AvatarName player={activePlayer} addressUser />.
              </>
            }
          />
        </Instruction>
      </PhaseAnnouncement>
    );
  }

  const item = items[previousGuess.itemId];

  if (previousGuess.outcome === OUTCOME.CONTINUE) {
    return (
      <PhaseAnnouncement
        icon={
          <Flex gap={6} justify="center" align="center" style={{ height: '100%' }}>
            <ItemCard id={item.id} text={item.name} width={100} />{' '}
            <IconAvatar icon={<ArrowIcon />} size="large" />{' '}
            <SelectedAreasCircles selectedArea={previousGuess.correctArea} size={75} />
            <IconAvatar icon={<BoxEqualIcon />} size="large" />
            <IconAvatar icon={<ApplauseIcon />} size={75} />
          </Flex>
        }
        title={<Translate pt="Muito bem!" en="Good job!" />}
        currentRound={currentRound}
        type="overlay"
        duration={7}
      >
        <Instruction>
          <Translate
            en={
              <>
                <AvatarName player={activePlayer} addressUser /> got it right! You may place another item.
              </>
            }
            pt={
              <>
                <AvatarName player={activePlayer} addressUser /> acertou! Você pode colocar outro item.
              </>
            }
          />
        </Instruction>
      </PhaseAnnouncement>
    );
  }

  return (
    <PhaseAnnouncement
      icon={
        <>
          <Flex gap={6} justify="center" align="center" style={{ height: '100%' }}>
            <ItemCard id={item.id} text={item.name} width={75} />{' '}
            <IconAvatar icon={<ArrowIcon />} size="small" />{' '}
            <SelectedAreasCircles selectedArea={previousGuess.suggestedArea} size={50} />
            <IconAvatar icon={<BoxEqualIcon />} size="small" />
            <IconAvatar icon={<SkullIcon />} size={50} />
          </Flex>
          <Flex gap={6} justify="center" align="center" style={{ height: '100%', marginTop: 16 }}>
            <IconAvatar icon={<ApplauseIcon />} size={50} />
            <IconAvatar icon={<BoxEqualIcon />} size="small" />
            <SelectedAreasCircles selectedArea={previousGuess.correctArea} size={50} />
          </Flex>
        </>
      }
      title={<Translate pt="Próximo jogador!" en="Next player!" />}
      currentRound={currentRound}
      type="overlay"
      duration={7}
    >
      <Instruction>
        <Translate
          en={
            <>
              It's <AvatarName player={activePlayer} />
              's turn.
              <br />
              The themes of each area are secret!
            </>
          }
          pt={
            <>
              É a vez do(a) <AvatarName player={activePlayer} />.
              <br />
              Os temas de cada área são secretos!
            </>
          }
        />
      </Instruction>
    </PhaseAnnouncement>
  );
}
