// Utils
import { AVATARS } from 'utils/avatars';
// Components
import { TransparentButton } from 'components/buttons/TransparentButton';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
// Images
import avatars from 'assets/images/avatars.svg?url';
// Sass
import styles from '../PhaseLobby.module.scss';

type UsualAvatarsSelectionProps = {
  setSelectedAvatar: (avatarId: string) => void;
  avatarsIds: string[];
};

export function UsualAvatarsSelection({ avatarsIds, setSelectedAvatar }: UsualAvatarsSelectionProps) {
  return (
    <div className={styles.lobbyUsualAvatarSelection}>
      <div className={styles.lobbyUsualAvatarSelectionTitle}>
        <small>
          <Translate
            pt="Seus avatars mais usados"
            en="Frequently used avatars"
          />
        </small>
      </div>
      <ul className={styles.lobbyUsualAvatarSelectionList}>
        {avatarsIds.map((avatarId) => (
          <TransparentButton
            key={avatarId}
            onClick={() => setSelectedAvatar(avatarId)}
          >
            <svg
              viewBox="0 0 100 100"
              className={styles.lobbyUsualAvatarSelectionAvatar}
            >
              <use href={`${avatars}#avatar-${avatarId}`}></use>
              <title>
                <DualTranslate>{AVATARS[avatarId].description}</DualTranslate>
              </title>
            </svg>
          </TransparentButton>
        ))}
      </ul>
    </div>
  );
}
