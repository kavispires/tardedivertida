import clsx from 'clsx';
// Ant Design Resources
import { Avatar, type AvatarProps, Tooltip } from 'antd';
// Types
import type { TeenageStudent } from 'types/tdr';
// Components
import { DualTranslate, Translate } from 'components/language';
// Internal
import { AGE_NUMBER, BUILD, GENDER, HEIGHT } from '../utils/constants';
import type { SocialGroup } from '../utils/types';
// Images
import studentIcons from '../assets/student-icons.svg?url';

type StudentIconProps = {
  iconId: string;
  tooltip?: DualLanguageValue;
} & AvatarProps;

export function StudentIcon({ iconId, tooltip, ...props }: StudentIconProps) {
  return (
    <Tooltip title={tooltip && <DualTranslate>{tooltip}</DualTranslate>}>
      <Avatar
        shape="square"
        {...props}
        src={
          <svg
            viewBox="0 0 512 512"
            style={{ width: '32px', height: '32px' }}
          >
            <use href={`${studentIcons}#${iconId}`}></use>
          </svg>
        }
      />
    </Tooltip>
  );
}

type SocialGroupIconProps = {
  socialGroup: SocialGroup;
  size?: AvatarProps['size'];
};

export function SocialGroupIcon({ socialGroup, size }: SocialGroupIconProps) {
  return (
    <StudentIcon
      iconId={socialGroup.id}
      tooltip={socialGroup.name}
      style={{ backgroundColor: socialGroup.colors.primary }}
      shape="circle"
      size={size}
    />
  );
}

type GenderIconProps = {
  gender: TeenageStudent['gender'];
  size?: AvatarProps['size'];
};

export function GenderIcon({ gender, size }: GenderIconProps) {
  const name = GENDER[gender];
  return (
    <StudentIcon
      iconId={gender}
      shape="circle"
      size={size}
      tooltip={{ en: `Gender ${name.en}`, pt: `Gênero ${name.pt}` }}
      className={clsx('student-icon__gender', `student-icon__gender--${gender}`)}
    />
  );
}

type AgeIconProps = {
  age: TeenageStudent['age'];
  size?: AvatarProps['size'];
};

export function AgeIcon({ age, size }: AgeIconProps) {
  const ageNumber = AGE_NUMBER[age];

  return (
    <Tooltip
      title={
        <Translate
          en={`Age ${ageNumber} years old`}
          pt={`Idade ${ageNumber} anos`}
        />
      }
    >
      <Avatar
        className={clsx('student-icon__age', `student-icon__age--${age}`)}
        shape="circle"
        size={size}
      >
        {ageNumber}
      </Avatar>
    </Tooltip>
  );
}

type BuildIconProps = {
  build: TeenageStudent['build'];
  size?: AvatarProps['size'];
};

export function BuildIcon({ build, size }: BuildIconProps) {
  const name = BUILD[build];

  return (
    <StudentIcon
      iconId={`build-${build}`}
      shape="circle"
      size={size}
      tooltip={{ en: `Build ${name.en}`, pt: `Corpo ${name.pt}` }}
      className={clsx('student-icon__build', `student-icon__build--${build}`)}
    />
  );
}

type HeightIconProps = {
  height: TeenageStudent['height'];
  size?: AvatarProps['size'];
};

export function HeightIcon({ height, size }: HeightIconProps) {
  const name = HEIGHT[height];
  return (
    <StudentIcon
      iconId={`height-${height}`}
      shape="circle"
      size={size}
      tooltip={{
        en: `Height ${name.en}`,
        pt: `Altura ${name.pt}`,
      }}
      className={clsx('student-icon__height', `student-icon__height--${height}`)}
    />
  );
}
