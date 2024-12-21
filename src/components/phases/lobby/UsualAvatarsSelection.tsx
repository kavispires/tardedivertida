// Utils
import { AVATARS } from 'utils/avatars';
// Components
import { TransparentButton } from 'components/buttons';
import { DualTranslate, Translate } from 'components/language';
// Images
import avatars from 'assets/images/avatars.svg';

type UsualAvatarsSelectionProps = {
  setSelectedAvatar: GenericFunction;
  avatarsIds: string[];
};

export function UsualAvatarsSelection({ avatarsIds, setSelectedAvatar }: UsualAvatarsSelectionProps) {
  return (
    <div className="lobby-usual-avatar-selection">
      <div className="lobby-usual-avatar-selection__title">
        <small>
          <Translate pt="Seus avatars mais usados" en="Your favorite avatars" />
        </small>
      </div>
      <ul className="lobby-usual-avatar-selection__list">
        {avatarsIds.map((avatarId) => (
          <UsualAvatarOption key={avatarId} setSelectedAvatar={setSelectedAvatar} avatarId={avatarId} />
        ))}
      </ul>
    </div>
  );
}

type UsualAvatarOptionProps = {
  setSelectedAvatar: GenericFunction;
  avatarId: string;
};

export function UsualAvatarOption({ avatarId, setSelectedAvatar }: UsualAvatarOptionProps) {
  return (
    <TransparentButton onClick={() => setSelectedAvatar(avatarId)}>
      <svg viewBox="0 0 100 100" className="lobby-usual-avatar-selection__avatar">
        <use href={`${avatars}#avatar-${avatarId}`}></use>
        <title>
          <DualTranslate>{AVATARS[avatarId].description}</DualTranslate>
        </title>
      </svg>
    </TransparentButton>
  );
}
