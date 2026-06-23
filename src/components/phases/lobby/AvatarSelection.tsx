import clsx from 'clsx';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useToggle } from 'react-use';
// Ant Design Resources
import { Button, Popover, Tooltip, Typography } from 'antd';
// Types
import type { GamePlayers } from 'types/game';
// Utils
import { AVAILABLE_AVATAR_IDS, AVATARS } from '@utils/avatars';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
// Images
import avatars from '@assets/images/avatars.svg?url';
// Sass
import styles from '../PhaseLobby.module.scss';

type AvatarSelectionProps = {
  /**
   * The game players object
   */
  players: GamePlayers;
  /**
   * The currently selected avatar ID
   */
  selectedAvatar: string;
  /**
   * Callback function to update the selected avatar
   */
  setSelectedAvatar: (avatarId: string) => void;
  /**
   * The current user's ID
   */
  userId: UID;
  /**
   * The maximum number of players allowed in the game, used to determine avatar availability and neighbor disabling logic
   */
  maxPlayers: number;
};

/**
 * Component that displays avatar selection interface with grid of available avatars
 */
export function AvatarSelection({
  players,
  setSelectedAvatar,
  selectedAvatar,
  userId,
  maxPlayers,
}: AvatarSelectionProps) {
  const [open, setOpen] = useToggle(false);

  return (
    <>
      <div className={styles.lobbyStepAvatarSelection}>
        <Popover
          arrow
          placement="right"
          content={
            <AvatarOptions
              players={players}
              setSelectedAvatar={setSelectedAvatar}
              selectedAvatar={selectedAvatar}
              userId={userId}
              maxPlayers={maxPlayers}
            />
          }
          title={
            <Translate
              pt="Escolha seu avatar"
              en="Choose your avatar"
            />
          }
          trigger="click"
          open={open}
          onOpenChange={setOpen}
        >
          <motion.svg
            viewBox="0 0 100 100"
            className={styles.lobbyAvatar}
            layoutId="avatar"
          >
            <use href={`${avatars}#avatar-${selectedAvatar}`}></use>
            <title>
              <DualTranslate>{AVATARS[selectedAvatar].description}</DualTranslate>
            </title>
          </motion.svg>
        </Popover>
      </div>
      <div className={styles.lobbyStepDescription}>
        <small>
          <DualTranslate>{AVATARS[selectedAvatar].description}</DualTranslate>
        </small>
      </div>
      <Button
        type="link"
        onClick={setOpen}
        block
      >
        <Translate
          pt="Trocar avatar"
          en="Change avatar"
        />
      </Button>
    </>
  );
}

function AvatarOptions({
  players,
  setSelectedAvatar,
  selectedAvatar,
  userId,
  maxPlayers,
}: AvatarSelectionProps) {
  const { usedAvatars, disabledAvatars } = useMemo(() => {
    const used: Dictionary<string> = Object.values(players).reduce(
      (acc: Dictionary<string>, { name, avatarId, id }) => {
        if (id !== userId) {
          acc[avatarId] = name;
        }
        return acc;
      },
      {},
    );

    // Disable neighbors of used avatars based on maxPlayers
    const usedAvatarIds = Object.keys(used);
    const disabled: Set<string> = new Set(usedAvatarIds);

    // Calculate how many neighbors to disable on each side
    const totalAvatars = AVAILABLE_AVATAR_IDS.length;
    const neighborsToDisable = Math.floor(totalAvatars / maxPlayers) - 1;
    const leftNeighbors = Math.floor(neighborsToDisable / 2);
    const rightNeighbors = Math.ceil(neighborsToDisable / 2);

    usedAvatarIds.forEach((avatarId) => {
      const currentIndex = AVAILABLE_AVATAR_IDS.indexOf(avatarId);
      const lastIndex = totalAvatars - 1;

      // Disable left neighbors
      for (let i = 1; i <= leftNeighbors; i++) {
        let neighborIndex = currentIndex - i;
        // Wrap around if necessary
        if (neighborIndex < 0) {
          neighborIndex = totalAvatars + neighborIndex;
        }
        const neighborId = AVAILABLE_AVATAR_IDS[neighborIndex];
        disabled.add(neighborId);
      }

      // Disable right neighbors
      for (let i = 1; i <= rightNeighbors; i++) {
        let neighborIndex = currentIndex + i;
        // Wrap around if necessary
        if (neighborIndex > lastIndex) {
          neighborIndex = neighborIndex - totalAvatars;
        }
        const neighborId = AVAILABLE_AVATAR_IDS[neighborIndex];
        disabled.add(neighborId);
      }
    });

    return { usedAvatars: used, disabledAvatars: disabled };
  }, [players, userId, maxPlayers]);

  return (
    <div className={styles.avatarSelectionOptionsContainer}>
      <div className={styles.avatarSelectionOptions}>
        {AVAILABLE_AVATAR_IDS.map((avatarId) => {
          const avatar = AVATARS[avatarId];
          const isUsed = !!usedAvatars[avatarId];
          const isDisabled = disabledAvatars.has(avatarId);

          return (
            <Tooltip
              key={avatarId}
              title={
                isUsed ? (
                  <Translate
                    pt={`Usado por ${usedAvatars[avatarId]}`}
                    en={`Used by ${usedAvatars[avatarId]}`}
                  />
                ) : (
                  <DualTranslate>{avatar.description}</DualTranslate>
                )
              }
            >
              <TransparentButton
                onClick={() => setSelectedAvatar(avatarId)}
                disabled={isDisabled}
                className={clsx(
                  styles.avatarSelectionOptionsAvatar,
                  avatarId === selectedAvatar && styles.avatarSelectionOptionsAvatarSelected,
                  isDisabled && styles.avatarSelectionOptionsAvatarUsed,
                )}
              >
                <svg
                  viewBox="0 0 100 100"
                  className={styles.avatarSelectionOptionsAvatarSvg}
                >
                  <use href={`${avatars}#avatar-${avatarId}`}></use>
                  <title>
                    <DualTranslate>{avatar.description}</DualTranslate>
                  </title>
                </svg>
              </TransparentButton>
            </Tooltip>
          );
        })}
      </div>
      <Typography.Text italic>
        <Translate
          en="If two or more players happen to select the same avatar, the game engine will randomly assign a new one."
          pt="Se dois ou mais jogadores escolherem o mesmo avatar, o servidor atribuirá aleatoriamente um novo."
        />
      </Typography.Text>
    </div>
  );
}
