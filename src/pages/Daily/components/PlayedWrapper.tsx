import { ReactNode } from 'react';
import { checkWasPlayedToday } from '../utils';
import { IconAvatar } from 'components/avatars';
import { SpeechBubbleAcceptedIcon } from 'icons/SpeechBubbleAcceptedIcon';

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
