import clsx from 'clsx';
import type { JSX } from 'react';
// Ant Design Resources
import { Button, Typography } from 'antd';
// Icons
import { GuessIcon } from '@icons/GuessIcon';
import { InnocentIcon } from '@icons/InnocentIcon';
import { LiarIcon } from '@icons/LiarIcon';
import { TraitorIcon } from '@icons/TraitorIcon';
// Components
import { Icon } from '@components/general/Icon';
import { ImageCard } from '@components/image-cards/ImageCard';
import { DualTranslate } from '@components/language/DualTranslate';
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
  triggerResolveModal?: () => void;
};

export function KidCard({
  kidEntry,
  index,
  width,
  assessKid,
  assessment,
  triggerResolveModal,
}: KidCardProps) {
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
        cardId={kid.id}
        cardWidth={width}
        preview={false}
      />
      <button
        className="kid-container__footer"
        type="button"
        onClick={triggerResolveModal}
      >
        <div className="kid-container__kid-name">
          <DualTranslate>{kid.name}</DualTranslate>
        </div>
        <div
          className="kid-container__statement"
          style={{ maxWidth: width + 12 }}
        >
          <DualTranslate>{kidEntry.statement}</DualTranslate>
        </div>
      </button>
    </div>
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
      onClick={(e) => {
        e.stopPropagation();
        assessKid(String(kidId));
      }}
      icon={
        <Icon
          icon={icon}
          size="small"
        />
      }
    />
  );
}

type KidGenderProps = {
  kid: Kid;
};

function KidGender({ kid }: KidGenderProps) {
  return (
    <span className={clsx('kid-gender', `kid-gender--${kid.gender}`)}>
      <svg
        xmlSpace="preserve"
        viewBox="0 0 64 64"
      >
        <path
          fill="#fff"
          d={
            kid.gender === 'boy'
              ? 'M45.587 38.182a17.7 17.7 0 0 0-2.942-9.795l4.342-4.342v.35c0 .929.37 1.821 1.027 2.478a3.523 3.523 0 0 0 4.958 0A3.5 3.5 0 0 0 54 24.394V16.13c-.003-2.181-1.797-3.975-3.978-3.979h-8.956a3.5 3.5 0 0 0-2.5 1.027 3.52 3.52 0 0 0 0 4.958 3.5 3.5 0 0 0 2.499 1.026h.894l-4.242 4.243c-7.04-4.736-16.536-3.815-22.535 2.185-6.91 6.909-6.91 18.28 0 25.189a17.82 17.82 0 0 0 12.595 5.216c9.818 0 17.81-7.991 17.81-17.813M27.773 48.985a10.8 10.8 0 0 1-7.633-3.163c-4.189-4.19-4.189-11.083 0-15.272 4.19-4.19 11.083-4.19 15.272 0a10.8 10.8 0 0 1 3.163 7.632c-.009 5.923-4.88 10.794-10.802 10.803'
              : 'M32 5.592c-9.823 0-17.811 7.991-17.811 17.811.01 8.442 6.009 15.777 14.28 17.463v5.523h-2.243a3.52 3.52 0 0 0-3.505 3.505 3.52 3.52 0 0 0 3.505 3.506h2.243v1.503a3.52 3.52 0 0 0 3.506 3.505 3.52 3.52 0 0 0 3.505-3.505V53.4h2.3a3.52 3.52 0 0 0 3.506-3.506 3.52 3.52 0 0 0-3.506-3.505h-2.3v-5.512c8.295-1.665 14.321-9.011 14.331-17.471 0-9.823-7.986-17.814-17.811-17.814m10.803 17.811v.005c0 5.927-4.877 10.803-10.803 10.803s-10.803-4.876-10.803-10.803c0-5.926 4.877-10.803 10.803-10.803 5.923.008 10.795 4.878 10.806 10.8z'
          }
        />
      </svg>
    </span>
  );
}
