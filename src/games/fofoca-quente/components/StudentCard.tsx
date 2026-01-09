import clsx from 'clsx';
// Ant Design Resources
import { Flex } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
// Internal
import type { SocialGroup, Student } from '../utils/types';
import { AgeIcon, BuildIcon, GenderIcon, HeightIcon, SocialGroupIcon } from './StudentIcon';

type StudentCardProps = {
  student: Student;
  socialGroup: SocialGroup;
  className?: string;
  showInfo?: boolean;
};

export function StudentCard({ student, socialGroup, showInfo, className }: StudentCardProps) {
  const baseUrl = useTDBaseUrl('images');
  const studentImageURL = student.id.replace(/-/g, '/');
  const { translate } = useLanguage();
  return (
    <div
      className={clsx(
        'student-card',
        {
          'student-card--intimidated': student.intimidated,
        },
        className,
      )}
      style={{
        backgroundImage: `url(${baseUrl}/${studentImageURL}.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderColor: socialGroup?.colors?.primary,
      }}
    >
      {showInfo && (
        <div className="student-card__info">
          <Flex
            gap={2}
            align="center"
            vertical
            className="student-card__icons"
          >
            <SocialGroupIcon
              socialGroup={socialGroup}
              size="small"
            />

            <GenderIcon
              gender={student.gender}
              size="small"
            />

            <AgeIcon
              age={student.age}
              size="small"
            />

            <BuildIcon
              build={student.build}
              size="small"
            />

            <HeightIcon
              height={student.height}
              size="small"
            />
          </Flex>
          <div className="student-card__name">
            {translate(student.name.pt, student.name.en).split(' ')[0]}
          </div>
        </div>
      )}
    </div>
  );
}
