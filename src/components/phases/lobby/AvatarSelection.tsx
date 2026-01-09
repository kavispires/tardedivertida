import clsx from 'clsx';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useToggle } from 'react-use';
// Ant Design Resources
import { Button, Popover, Tooltip } from 'antd';
// Types
import type { GamePlayers } from 'types/player';
// Utils
import { AVAILABLE_AVATAR_IDS, AVATARS } from 'utils/avatars';
// Components
import { TransparentButton } from 'components/buttons';
import { DualTranslate, Translate } from 'components/language';
// Images
import avatars from 'assets/images/avatars.svg?url';
type AvatarSelectionProps = {
  players: GamePlayers;
  selectedAvatar: string;
  setSelectedAvatar: GenericFunction;
  userId: PlayerId;
};

export function AvatarSelection({
  players,
  setSelectedAvatar,
  selectedAvatar,
  userId,
}: AvatarSelectionProps) {
  const [open, setOpen] = useToggle(false);

  return (
    <>
      <div className="lobby-step__avatar-selection">
        <Popover
          arrow
          placement="right"
          content={
            <AvatarOptions
              players={players}
              setSelectedAvatar={setSelectedAvatar}
              selectedAvatar={selectedAvatar}
              userId={userId}
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
            className="lobby-avatar"
            layoutId="avatar"
          >
            <use href={`${avatars}#avatar-${selectedAvatar}`}></use>
            <title>
              <DualTranslate>{AVATARS[selectedAvatar].description}</DualTranslate>
            </title>
          </motion.svg>
        </Popover>
      </div>
      <div className="lobby-step__description">
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

function AvatarOptions({ players, setSelectedAvatar, selectedAvatar, userId }: AvatarSelectionProps) {
  const usedAvatars = useMemo(() => {
    return Object.values(players).reduce((acc: StringDictionary, { name, avatarId, id }) => {
      if (id !== userId) {
        acc[avatarId] = name;
      }
      return acc;
    }, {});
  }, [players, userId]);

  return (
    <div className="avatar-selection-options">
      {AVAILABLE_AVATAR_IDS.map((avatarId) => {
        const avatar = AVATARS[avatarId];
        const isUsed = !!usedAvatars[avatarId];

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
              disabled={isUsed}
              className={clsx(
                'avatar-selection-options__avatar',
                avatarId === selectedAvatar && 'avatar-selection-options__avatar--selected',
                isUsed && 'avatar-selection-options__avatar--used',
              )}
            >
              <svg
                viewBox="0 0 100 100"
                className="avatar-selection-options__avatar-svg"
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
  );
}
