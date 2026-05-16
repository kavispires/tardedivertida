import clsx from 'clsx';
import type { JSX } from 'react';
// Ant Design Resources
import { Button, Typography } from 'antd';
// Icons
import { GuessIcon, InnocentIcon, LiarIcon, TraitorIcon } from 'icons/collection';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { ImageCard } from 'components/image-cards/ImageCard';
import { DualTranslate } from 'components/language/DualTranslate';
// Internal
import type { GeneratedKid } from '../utils/types';

const { Text } = Typography;

type KidCardProps = {
  kid: GeneratedKid;
  index: number;
  width: number;
  assessKid: (kidId: string) => void;
  assessment: 'culprit' | 'liar' | 'innocent' | null;
};

export function KidCard({ kid, index, width, assessKid, assessment }: KidCardProps) {
  return (
    <div className={clsx('kid-container', `"kid-container--${index + 1}-kid"`)}>
      <div className="kid-container__kid-data">
        <Text
          strong
          className="kid-container__kid-info"
          style={{ maxWidth: width }}
        >
          <KidGender kid={kid} />
          {kid.height}cm
        </Text>
      </div>
      <div className="kid-container__assessment">
        <AssessmentSwitch
          kidId={kid.id}
          assessment={assessment}
          assessKid={assessKid}
        />
      </div>
      <ImageCard
        cardId={kid.cardId}
        cardWidth={width}
        preview={false}
      />
      <div className="kid-container__footer">
        <div className="kid-container__kid-name">
          <DualTranslate>{kid.name}</DualTranslate>
        </div>
        <div
          className="kid-container__statement"
          style={{ maxWidth: width + 12 }}
        >
          <DualTranslate>{kid.statement}</DualTranslate>
        </div>
      </div>
    </div>
  );
}

type KidGenderProps = {
  kid: GeneratedKid;
};

function KidGender({ kid }: KidGenderProps) {
  return (
    <span className={clsx('kid-gender', `kid-gender--${kid.gender}`)}>
      {kid.gender === 'boy' ? '♂️' : '♀️'}
    </span>
  );
}

type AssessmentSwitchProps = {
  kidId: number;
  assessment: 'culprit' | 'liar' | 'innocent' | null;
  assessKid: (kidId: string) => void;
};

function AssessmentSwitch({ kidId, assessment, assessKid }: AssessmentSwitchProps) {
  const iconMap: Record<string, JSX.Element> = {
    culprit: <TraitorIcon />,
    liar: <LiarIcon />,
    innocent: <InnocentIcon />,
  };

  const icon = iconMap[assessment ?? ''] ?? <GuessIcon />;

  return (
    <Button
      shape="circle"
      size="small"
      onClick={() => assessKid(String(kidId))}
      icon={
        <IconAvatar
          icon={icon}
          size="small"
        />
      }
    />
  );
}
