import { ReactNode } from 'react';
// Icons
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';
// Components
import { IconAvatar } from 'components/avatars';
// Internal
import { checkWasPlayedToday } from '../utils';

type PlayedWrapperProps = {
  children: ReactNode;
  lsKey: string;
};
export function PlayedWrapper({ children, lsKey }: PlayedWrapperProps) {
  const wasPlayed = checkWasPlayedToday(lsKey);

  return (
    <div className="played-wrapper">
      {wasPlayed && (
        <IconAvatar icon={<SpeechBubbleAcceptedIcon />} size="small" className="played-wrapper__played" />
      )}
      {children}
    </div>
  );
}
