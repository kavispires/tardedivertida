import clsx from 'clsx';
import type { ReactNode } from 'react';
// Ant Design Resources
import { CheckCircleFilled, DislikeFilled, LikeFilled } from '@ant-design/icons';
import { Button } from 'antd';
// Components
import { Translate } from 'components/language';
import { PlayerAvatar } from 'components/player';
// Sass
import styles from './SocialProfile.module.scss';

type SocialProfileProps = {
  /**
   * The avatar id to be used.
   */
  avatarId: string;
  /**
   * The name of the user.
   */
  name: ReactNode;
  /**
   * The handle of the user.
   */
  handle: ReactNode;
  /**
   * Whether the user is verified or not.
   */
  verified?: boolean;
  /**
   * The class name to be appended to the container.
   */
  className?: string;
};

/**
 * The social profile component that can be used a twitter or an instagram profile.
 */
export function SocialProfile({ avatarId, name, handle, verified, className }: SocialProfileProps) {
  return (
    <div className={clsx(styles.profile, className)}>
      <PlayerAvatar
        avatarId={avatarId}
        size="large"
        className={styles.profileAvatar}
      />
      <span className={styles.profileName}>
        {name} {verified && <CheckCircleFilled style={{ color: 'dodgerBlue' }} />}
      </span>
      <span className={styles.profileHandle}>{handle}</span>
    </div>
  );
}

type TweetProps = SocialProfileProps & {
  /**
   * The content of the tweet.
   */
  children: ReactNode;
  /**
   * The function to be called when the like button is clicked.
   */
  onLike?: () => void;
  /**
   * The function to be called when the dislike button is clicked.
   */
  onDislike?: () => void;
  /**
   * Whether the buttons should be disabled or not.
   */
  disabled?: boolean;
};

export function Tweet({
  avatarId,
  name,
  handle,
  verified,
  className,
  children,
  onLike,
  onDislike,
  disabled,
}: TweetProps) {
  return (
    <div className={clsx(styles.tweet, className)}>
      <SocialProfile
        avatarId={avatarId}
        name={name}
        handle={handle}
        verified={verified}
      />
      <span className={styles.tweetText}>{children}</span>
      <div className={styles.tweetButtons}>
        <Button
          block
          icon={<LikeFilled />}
          onClick={onLike}
          disabled={disabled}
        >
          <Translate
            pt="Curtir"
            en="Like"
          />
        </Button>
        <Button
          block
          icon={<DislikeFilled />}
          onClick={onDislike}
          disabled={disabled}
        >
          <Translate
            pt="Não curto"
            en="Dislike"
          />
        </Button>
      </div>
    </div>
  );
}
