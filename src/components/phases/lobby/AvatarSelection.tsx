import { useCallback, useMemo } from "react";
// Ant Design Resources
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
// Types
import type { GamePlayers } from "types/player";
// Utils
import { AVAILABLE_AVATAR_IDS, AVATARS } from "utils/avatars";
import { getRandomItem } from "utils/helpers";
// Components
import { DualTranslate } from "components/language";
// Images
import avatars from "assets/images/avatars.svg";

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
  // Calculate available avatars and monitor if user chose a non-available one
  const availableAvatars = useMemo(() => {
    const usedAvatars = Object.values(players).reduce(
      (acc: BooleanDictionary, { avatarId, id }) => {
        if (id !== userId) {
          acc[avatarId] = true;
        }
        return acc;
      },
      {},
    );

    const newAvailableAvatars = AVAILABLE_AVATAR_IDS.filter(
      (avatarId) => usedAvatars[avatarId] === undefined,
    );

    if (!newAvailableAvatars.includes(selectedAvatar)) {
      setSelectedAvatar(getRandomItem(newAvailableAvatars));
    }

    return newAvailableAvatars;
  }, [players]); // eslint-disable-line

  const onPreviousAvatar = useCallback(() => {
    const index = availableAvatars.indexOf(selectedAvatar);
    const newIndex = index === 0 ? availableAvatars.length - 1 : index - 1;
    setSelectedAvatar(availableAvatars[newIndex]);
  }, [availableAvatars, selectedAvatar, setSelectedAvatar]);

  const onNextAvatar = useCallback(() => {
    const index = availableAvatars.indexOf(selectedAvatar);
    const newIndex = index === availableAvatars.length - 1 ? 0 : index + 1;
    setSelectedAvatar(availableAvatars[newIndex]);
  }, [availableAvatars, selectedAvatar, setSelectedAvatar]);

  return (
    <>
      <div className="lobby-step__avatar-selection">
        <Button
          type="dashed"
          onClick={onPreviousAvatar}
          className="lobby-step__avatar-nav-button"
        >
          <CaretLeftOutlined />
        </Button>
        <svg viewBox="0 0 100 100" className="lobby-avatar">
          <use href={avatars + `#avatar-${selectedAvatar}`}></use>
          <title>
            <DualTranslate>{AVATARS[selectedAvatar].description}</DualTranslate>
          </title>
        </svg>
        <Button
          type="dashed"
          onClick={onNextAvatar}
          className="lobby-step__avatar-nav-button"
        >
          <CaretRightOutlined />
        </Button>
      </div>
      <div className="lobby-step__description">
        <small>
          <DualTranslate>{AVATARS[selectedAvatar].description}</DualTranslate>
        </small>
      </div>
    </>
  );
}
