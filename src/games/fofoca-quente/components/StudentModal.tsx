// Ant Design Resources
import { Alert, Card, Divider, Flex, Tag } from 'antd';
// Components
import { SendButton } from 'components/buttons';
import { ModalOverlay } from 'components/general/ModalOverlay';
import { DualTranslate, Translate } from 'components/language';
// Internal
import type { SocialGroup, Student } from '../utils/types';
import { ACTION_TYPES, AGE_NUMBER, BUILD, GENDER, HEIGHT } from '../utils/constants';
import { StudentCard } from './StudentCard';
import { AgeIcon, BuildIcon, GenderIcon, HeightIcon, StudentIcon } from './StudentIcon';

type StudentModalProps = {
  student: Student;
  socialGroups: Dictionary<SocialGroup>;
  gossiperId: string;
  bestFriendId?: string;
  closeModal: () => void;
  showSecrets?: boolean;
  actionType?: keyof typeof ACTION_TYPES | string;
  onPerformAction?: (studentId: string) => void;
};

export function StudentModal({
  student,
  socialGroups,
  gossiperId,
  bestFriendId,
  closeModal,
  showSecrets,
  actionType,
  onPerformAction,
}: StudentModalProps) {
  const socialGroup = socialGroups[student.socialGroupId];

  return (
    <ModalOverlay onClose={closeModal} open={true}>
      <Card>
        <div className="student-details">
          <StudentCard
            student={student}
            socialGroup={socialGroups[student.socialGroupId]}
            className="student-details__student-card"
          />
          <div>
            <div className="student-details__header">
              <div className="student-details__identification">
                <div className="student-details__name">
                  <DualTranslate>{student.name}</DualTranslate>
                </div>
                <div className="student-details__title">
                  <DualTranslate>{student.title}</DualTranslate>
                </div>
                <Flex align="center" className="student-details__social-group">
                  <StudentIcon
                    iconId={student.socialGroupId}
                    tooltip={{ en: 'Social Group', pt: 'Grupo Social' }}
                    style={{ backgroundColor: socialGroup.colors.primary }}
                    shape="circle"
                    size="large"
                  />
                  <Tag
                    color={socialGroup.colors.primary}
                    className="student-details__social-group-name"
                    variant="outlined"
                  >
                    <DualTranslate>{socialGroup.name}</DualTranslate>
                  </Tag>
                </Flex>
              </div>
              <Flex gap={6} vertical className="student-details__icons">
                <span>
                  <DualTranslate>{GENDER[student.gender]}</DualTranslate>{' '}
                  <GenderIcon gender={student.gender} />
                </span>

                <span>
                  {AGE_NUMBER[student.age]} <Translate en="years old" pt="anos" />{' '}
                  <AgeIcon age={student.age} />
                </span>

                <span>
                  <DualTranslate>{BUILD[student.build]}</DualTranslate> <BuildIcon build={student.build} />
                </span>

                <span>
                  <DualTranslate>{HEIGHT[student.height]}</DualTranslate>{' '}
                  <HeightIcon height={student.height} />
                </span>
              </Flex>
            </div>
            <Divider />

            <Flex vertical gap={3} className="student-details__secrets">
              {student.intimidated && (
                <Alert
                  message={
                    <Translate
                      en="This student has been intimidated. They cannot be questioned unless the detective first comfort them"
                      pt="Esse estudante está intimidado. Ele(a) não pode ser questionado(a) a menos que o detetive o(a) console primeiro"
                    />
                  }
                  showIcon
                  icon={<StudentIcon iconId="intimidated" />}
                  banner
                />
              )}
            </Flex>

            {showSecrets && (
              <Flex vertical gap={3} className="student-details__secrets">
                {student.id === gossiperId && (
                  <Alert
                    message={
                      <Translate en="This student is the gossiper" pt="Esse estudante é o fofoqueiro" />
                    }
                    type="error"
                    showIcon
                    banner
                  />
                )}
                {student.id === bestFriendId && (
                  <Alert
                    message={
                      <Translate en="This student is the best friend" pt="Esse estudante é o melhor amigo" />
                    }
                    type="warning"
                    showIcon
                    banner
                  />
                )}

                {student.canLie && (
                  <Alert
                    message={<Translate en="This student can lie for you" pt="Esse estudante pode mentir" />}
                    type="info"
                    showIcon
                    banner
                  />
                )}
              </Flex>
            )}

            {actionType === ACTION_TYPES.INTIMIDATE && canStudentBeIntimidated(student) && (
              <Flex justify="center">
                <SendButton onClick={() => onPerformAction?.(student.id)} type="primary" size="large" block>
                  <Translate en="Intimidate" pt="Intimidar" />
                </SendButton>
              </Flex>
            )}
          </div>
        </div>
      </Card>
    </ModalOverlay>
  );
}

const canStudentBeIntimidated = (student: Student) => !student.rumored && !student.intimidated;
