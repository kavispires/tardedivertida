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
import type { GeneratedKid, Kid, KidAssessment } from '../utils/types';
import { KIDS_LIBRARY } from '../utils/constants';

const { Text } = Typography;

type KidCardProps = {
  kidEntry: GeneratedKid;
  index: number;
  width: number;
  assessKid: (kidId: string) => void;
  assessment: KidAssessment | null;
};

export function KidCard({ kidEntry, index, width, assessKid, assessment }: KidCardProps) {
  const kid = KIDS_LIBRARY[kidEntry.kidId];
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
          kidId={kidEntry.kidId}
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
          <DualTranslate>{kidEntry.statement}</DualTranslate>
        </div>
      </div>
    </div>
  );
}

type KidGenderProps = {
  kid: Kid;
};

function KidGender({ kid }: KidGenderProps) {
  return (
    <span className={clsx('kid-gender', `kid-gender--${kid.gender}`)}>
      {kid.gender === 'boy' ? '♂️' : '♀️'}
    </span>
  );
}

type AssessmentSwitchProps = {
  kidId: UID;
  assessment: KidAssessment | null;
  assessKid: (kidId: UID) => void;
};

export const assessmentIconMap: Record<string, JSX.Element> = {
  culprit: <TraitorIcon />,
  liar: <LiarIcon />,
  innocent: <InnocentIcon />,
  unknown: <GuessIcon />,
};

function AssessmentSwitch({ kidId, assessment, assessKid }: AssessmentSwitchProps) {
  const icon = assessmentIconMap[assessment ?? ''] ?? <GuessIcon />;

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
