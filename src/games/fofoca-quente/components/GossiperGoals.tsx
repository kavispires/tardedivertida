// Ant Design Resources
import { AimOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
// Types
import type { TeenageMotivation } from 'types/tdr';
// Components
import { DualTranslate } from '@components/language/DualTranslate';
import { Translate } from '@components/language/Translate';
import { RuleInstruction } from '@components/text/RuleInstruction';
// Internal
import type { FofocaQuenteDefaultState, SocialGroup } from '../utils/types';
import { useFofocaQuenteContext } from '../utils/FofocaQuenteContext';
import { SocialGroupIcon } from './StudentIcon';

type GossiperGoalsProps = {
  students: FofocaQuenteDefaultState['students'];
  gossiperId: string;
  bestFriendId?: string;
  motivation: TeenageMotivation;
  associatedSocialGroup: SocialGroup | null;
};

export function GossiperGoals({
  students,
  gossiperId,
  bestFriendId,
  motivation,
  associatedSocialGroup,
}: GossiperGoalsProps) {
  const { onOpenStudentModal } = useFofocaQuenteContext();
  return (
    <>
      <RuleInstruction
        type="lore"
        className="text-left"
      >
        <Translate
          en="You are the gossiper and must spread rumors about 5 students, one round at a time."
          pt="Você é o fofoqueiro e deve espalhar boatos sobre 5 alunos, um boato por rodada."
        />
        <br />
        <Tag color="red">
          <Translate
            en="You"
            pt="Você"
          />
        </Tag>{' '}
        <Button
          size="small"
          onClick={() => onOpenStudentModal(gossiperId)}
          icon={<AimOutlined />}
        >
          <DualTranslate>{students[gossiperId].name}</DualTranslate>
        </Button>
        {bestFriendId && (
          <>
            <br />
            <Translate
              en="You have a best friend that will lie for you if needed."
              pt="Você tem um melhor amigo que mentirá por você se necessário."
            />
            <br />
            <Tag color="orange">
              <Translate
                en="Best Friend"
                pt="Melhor Amigo"
              />
            </Tag>{' '}
            <Button
              size="small"
              onClick={() => onOpenStudentModal(bestFriendId)}
              icon={<AimOutlined />}
            >
              <DualTranslate>{students[bestFriendId].name}</DualTranslate>
            </Button>
          </>
        )}
        {associatedSocialGroup && (
          <>
            <br />
            <Translate
              en="You have a social group that can lie for you if needed."
              pt="Você tem um grupo social que pode mentir por você se necessário."
            />
            <br />
            <Tag color="grey">
              <Translate
                en="Allied Social Group"
                pt="Grupo Social Aliado"
              />
            </Tag>
            <SocialGroupIcon
              socialGroup={associatedSocialGroup}
              size="small"
            />{' '}
            <DualTranslate>{associatedSocialGroup.name}</DualTranslate>
          </>
        )}
      </RuleInstruction>

      <RuleInstruction
        type="event"
        className="text-left"
      >
        <Translate
          en="Your motivation determines how you can spread gossip and figuring it out is one of the Detective's goals."
          pt="Sua motivação determina como você pode espalhar boatos e descobri-la é um dos objetivos do Detetive."
        />
        <br />
        <span>
          <Tag color="blue">
            <Translate
              en="Motivation"
              pt="Motivação"
            />
          </Tag>{' '}
          <DualTranslate>{motivation.title}</DualTranslate>:{' '}
          <i>
            <DualTranslate>{motivation.description}</DualTranslate>
          </i>
        </span>
        <br />
      </RuleInstruction>
    </>
  );
}
