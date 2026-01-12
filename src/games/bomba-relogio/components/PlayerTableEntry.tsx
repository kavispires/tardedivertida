import clsx from 'clsx';
// Ant Design Resources
import { Button, Flex, Switch, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Utils
import { pluralize } from 'utils/helpers';
// Icons
import { SecurityIcon, TraitorIcon } from 'icons/collection';
// Components
import { IconAvatar, PlayerAvatarCard } from 'components/avatars';
import { ImageCard } from 'components/image-cards';
import { Translate } from 'components/language/Translate';
// Internal
import { useNotesStore } from '../utils/notes-store';
import { CARD_IMAGE_NAMES } from '../utils/constants';
import type { TimeBombCard } from '../utils/types';
import { BombHighlight, RedWireHighlight } from './Highlights';

type PlayerTableEntryProps = {
  player: GamePlayer;
  onSelect?: (playerId: PlayerId) => void;
  currentTargetPlayerId?: PlayerId;
};

export function PlayerTableEntry({ player, onSelect, currentTargetPlayerId }: PlayerTableEntryProps) {
  const { notes, setPlayerNote } = useNotesStore();

  return (
    <PlayerAvatarCard
      player={player}
      key={player.id}
      withRoundCorners
      withName
      className={clsx({ 'current-target-player': currentTargetPlayerId === player.id })}
    >
      <Flex justify="center">
        <Tooltip
          title={
            <Translate
              pt={`Eu tenho ${player.declarations.wires ?? 0} ${pluralize(player.declarations.wires ?? 0, 'fio vermelho', 'fios vermelhos')}`}
              en={`I have ${player.declarations.wires ?? 0} ${pluralize(player.declarations.wires ?? 0, 'red wire', 'red wires')}`}
            />
          }
        >
          <span style={{ color: 'black' }}>
            <RedWireHighlight>{player.declarations.wires ?? 0}</RedWireHighlight>
          </span>
        </Tooltip>
        {!!player.declarations.bombs && (
          <Tooltip
            title={
              <Translate
                pt="Eu tenho a bomba!"
                en="I have the bomb!"
              />
            }
          >
            <span style={{ color: 'black' }}>
              <BombHighlight>{player.declarations.bombs ?? 0}</BombHighlight>
            </span>
          </Tooltip>
        )}
      </Flex>
      <Tooltip
        title={
          <Translate
            pt={`Esse jogador ainda tem ${player.hand?.length} ${pluralize(player.hand.length, 'carta', 'cartas')}`}
            en={`This player still has ${player.hand?.length} ${pluralize(player.hand.length, 'card', 'cards')}`}
          />
        }
      >
        <Flex
          justify="center"
          className="mt-2"
        >
          {player.hand?.length === 0 ? (
            <>-</>
          ) : (
            player.hand?.map((card: TimeBombCard) => (
              <ImageCard
                key={card.id}
                cardWidth={16}
                cardId={CARD_IMAGE_NAMES.BACK ?? CARD_IMAGE_NAMES.BLANK}
                preview={false}
                className="player-entry-mini-card"
              />
            ))
          )}
        </Flex>
      </Tooltip>

      <Flex
        justify="center"
        className="mt-2"
      >
        <Tooltip
          title={
            <Translate
              pt="Use esse botão parar marcar quem você achar que é agente ou terrorista"
              en="Use this button to mark who you think is an agent or a terrorist"
            />
          }
        >
          <Switch
            value={notes[player.id] === 'terrorist'}
            styles={{
              root: { backgroundColor: notes[player.id] === 'terrorist' ? 'red' : 'green' },
            }}
            onChange={(checked) => setPlayerNote(player.id, checked ? 'terrorist' : 'agent')}
            checkedChildren={
              <IconAvatar
                icon={<TraitorIcon />}
                size="small"
              />
            }
            unCheckedChildren={
              <IconAvatar
                icon={<SecurityIcon />}
                size="small"
              />
            }
          />
        </Tooltip>
      </Flex>

      {!!onSelect && (
        <Flex
          justify="center"
          className="mt-6"
        >
          <Button
            shape="round"
            onClick={() => onSelect(player.id)}
          >
            <Translate
              pt="Selecionar"
              en="Select"
            />
          </Button>
        </Flex>
      )}
    </PlayerAvatarCard>
  );
}
