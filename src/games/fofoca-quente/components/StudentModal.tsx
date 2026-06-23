import { useState } from 'react';
// Ant Design Resources
import { Alert, Card, Divider, Flex, Radio, Tag, Typography } from 'antd';
// Types
import type { TeenageRumor } from 'types/tdr';
// Icons
import { BlackmailIcon } from '@icons/BlackmailIcon';
import { CyberBullyingIcon } from '@icons/CyberBullyingIcon';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { DebugOnly } from '@components/debug/DebugOnly';
import { Icon } from '@components/general/Icon';
import { ModalOverlay } from '@components/general/ModalOverlay';
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
// Internal
import type { SocialGroup, Student } from '../utils/types';
import { ACTION_TYPES, AGE_NUMBER, BUILD, GENDER, HEIGHT } from '../utils/constants';
import { StudentCard } from './StudentCard';
import { AgeIcon, BuildIcon, GenderIcon, HeightIcon, StudentIcon } from './StudentIcon';

type StudentModalProps<T extends PlainObject = PlainObject> = {
  student: Student;
  socialGroups: Dictionary<SocialGroup>;
  gossiperId: string;
  bestFriendId?: string;
  closeModal: () => void;
  showSecrets?: boolean;
  actionType?: keyof typeof ACTION_TYPES | string;
  onPerformAction?: (studentId: string, additionalData?: T) => void;
  actionData?: PlainObject;
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
  actionData,
}: StudentModalProps) {
  const socialGroup = socialGroups[student.socialGroupId];

  return (
    <ModalOverlay
      onClose={closeModal}
      open={true}
    >
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
                  <DualTranslate>{student.title}</DualTranslate> <DebugOnly dev>({student.id})</DebugOnly>
                </div>
                <Flex
                  align="center"
                  className="student-details__social-group"
                >
                  <StudentIcon
                    iconId={student.socialGroupId}
                    tooltip={{ en: 'Social Group', pt: 'Grupo Social' }}
                    style={{ backgroundColor: socialGroup.colors.primary }}
                    shape="circle"
                    size="large"
                    className="student-details__social-group-icon"
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
              <Flex
                gap={6}
                vertical
                className="student-details__icons"
              >
                <span>
                  <DualTranslate>{GENDER[student.gender]}</DualTranslate>{' '}
                  <GenderIcon gender={student.gender} />
                </span>

                <span>
                  {AGE_NUMBER[student.age]}{' '}
                  <Translate
                    en="years old"
                    pt="anos"
                  />{' '}
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

            <Flex
              vertical
              gap={3}
              className="student-details__secrets"
            >
              {student.intimidated && (
                <Alert
                  title={
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
              <Flex
                vertical
                gap={3}
                className="student-details__secrets"
              >
                {student.id === gossiperId && (
                  <Alert
                    title={
                      <Translate
                        en="This student is the gossiper"
                        pt="Esse estudante é o fofoqueiro"
                      />
                    }
                    type="info"
                    showIcon
                    banner
                  />
                )}
                {student.id === bestFriendId && (
                  <Alert
                    title={
                      <Translate
                        en="This student is the best friend"
                        pt="Esse estudante é o melhor amigo"
                      />
                    }
                    type="info"
                    showIcon
                    banner
                  />
                )}

                {student.canLie && (
                  <Alert
                    title={
                      <Translate
                        en="This student can lie for you"
                        pt="Esse estudante pode mentir"
                      />
                    }
                    type="info"
                    showIcon
                    banner
                  />
                )}
              </Flex>
            )}
            <Flex
              vertical
              gap={3}
              className="student-details__secrets"
            >
              {actionType === ACTION_TYPES.INTIMIDATE && onPerformAction && (
                <IntimidationFlow
                  student={student}
                  onPerformAction={onPerformAction}
                />
              )}

              {actionType === ACTION_TYPES.RUMOR && onPerformAction && (
                <RumorFlow
                  student={student}
                  onPerformAction={onPerformAction}
                  actionData={actionData}
                />
              )}
            </Flex>
          </div>
        </div>
      </Card>
    </ModalOverlay>
  );
}

function IntimidationFlow({
  student,
  onPerformAction,
}: Pick<StudentModalProps, 'student' | 'onPerformAction'>) {
  if (student.intimidated) {
    return null;
  }

  if (!student.canBeIntimidated) {
    return (
      <Alert
        title={
          <Translate
            en="This student cannot be intimidated"
            pt="Esse estudante não pode ser intimidado"
          />
        }
        type="error"
        showIcon
        banner
      />
    );
  }
  return (
    <Flex justify="center">
      <SendButton
        onClick={() => onPerformAction?.(student.id)}
        type="primary"
        size="large"
        block
        icon={
          <Icon
            icon={<BlackmailIcon />}
            size="small"
          />
        }
      >
        <Translate
          en="Intimidate"
          pt="Intimidar"
        />
      </SendButton>
    </Flex>
  );
}

function RumorFlow({
  student,
  onPerformAction,
  actionData,
}: Pick<StudentModalProps, 'student' | 'onPerformAction' | 'actionData'>) {
  const [rumorIndex, setRumorIndex] = useState<number | null>(null);

  if (!student.canBeRumored) {
    return (
      <Alert
        type="error"
        showIcon
        banner
        title={
          <Translate
            en="This student cannot be rumored"
            pt="Esse estudante não pode ser alvo de boatos"
          />
        }
      />
    );
  }
  const possibleRumors = actionData?.possibleRumors as TeenageRumor[];
  return (
    <Flex
      vertical
      gap={6}
    >
      <Typography.Text>
        <Translate
          en="Select a rumor then click the button"
          pt="Selecione um boato então clique no botão"
        />
      </Typography.Text>
      <Radio.Group
        onChange={(e) => setRumorIndex(e.target.value)}
        value={rumorIndex}
        size="small"
      >
        <Flex vertical>
          {possibleRumors?.map((rumor, index) => (
            <Radio
              key={`rumor-${index}`}
              value={index}
            >
              "<DualTranslate>{rumor.text}</DualTranslate>"
            </Radio>
          ))}
        </Flex>
      </Radio.Group>

      <SendButton
        onClick={() => onPerformAction?.(student.id, rumorIndex !== null ? { rumorIndex } : {})}
        type="primary"
        size="large"
        disabled={rumorIndex === null}
        block
        icon={
          <Icon
            icon={<CyberBullyingIcon />}
            size="small"
          />
        }
      >
        <Translate
          en="Spread Rumor"
          pt="Espalhar Boato"
        />
      </SendButton>
    </Flex>
  );
}
