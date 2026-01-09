import { useState } from 'react';
// Ant Design Resources
import { Avatar, Button, Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Icons
import { CheckMarkIcon } from 'icons/CheckMarkIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { SendButton } from 'components/buttons';
import { DualTranslate, Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
// Internal
import type { FofocaQuenteDefaultState, SubmitAssociatedSocialGroupPayload } from './utils/types';
import { useBoardSummary } from './utils/hooks';
import { SchoolBoard } from './components/SchoolBoard';
import { StudentModal } from './components/StudentModal';
import { BoardSummary } from './components/BoardSummary';
import { StudentIcon } from './components/StudentIcon';
import { GossiperGoals } from './components/GossiperGoals';

type StepSetupGossiperProps = {
  players: GamePlayers;
  user: GamePlayer;
  gossiperId: string;
  bestFriendId?: string;
  gossiperMotivationIndex: number;
  onSubmitAssociatedSocialGroup: (payload: SubmitAssociatedSocialGroupPayload) => void;
} & Pick<StepProps, 'announcement'> &
  Pick<FofocaQuenteDefaultState, 'schoolBoard' | 'students' | 'socialGroups' | 'staff' | 'motivations'>;

export function StepSetupGossiper({
  user,
  announcement,
  schoolBoard,
  socialGroups,
  students,
  gossiperId,
  bestFriendId,
  staff,
  motivations,
  gossiperMotivationIndex,
  onSubmitAssociatedSocialGroup,
}: StepSetupGossiperProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const motivation = motivations[gossiperMotivationIndex];
  const [selectedSocialGroupId, setSelectedSocialGroupId] = useState<string | null>(null);
  const summaryDicts = useBoardSummary(students);
  const onSubmit = () => {
    if (selectedSocialGroupId) {
      onSubmitAssociatedSocialGroup({ associatedSocialGroupId: selectedSocialGroupId });
    }
  };

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Preparando a escola</>}
          en={<>Setting up the school</>}
        />
      </StepTitle>

      <SchoolBoard
        schoolBoard={schoolBoard}
        students={students}
        socialGroups={socialGroups}
        selectStudent={setSelectedStudentId}
        staff={staff}
      />

      <Instruction contained>
        <Flex justify="center">
          <BoardSummary
            students={students}
            socialGroups={socialGroups}
          />

          <div>
            <GossiperGoals
              motivation={motivation}
              students={students}
              gossiperId={gossiperId}
              bestFriendId={bestFriendId}
              onOpenStudentModal={setSelectedSocialGroupId}
            />

            <RuleInstruction
              type="action"
              className="text-left"
            >
              <Translate
                en="To help you with your chaos, select one of these social groups to be associated with you. They also will be able to lie for you. The numbers are how many students are in each group."
                pt="Para te ajudar com seu caos, selecione um desses grupos sociais para ser associado a você. Eles também poderão mentir por você. Os números são quantos alunos estão em cada grupo."
              />
              <br />
              <Flex gap={8}>
                {user?.socialGroupOptions?.map((socialGroupId: string) => (
                  <Button
                    key={socialGroupId}
                    onClick={() => setSelectedSocialGroupId(socialGroupId)}
                    icon={
                      <IconAvatar
                        icon={
                          selectedSocialGroupId === socialGroupId ? (
                            <CheckMarkIcon />
                          ) : (
                            <StudentIcon iconId={socialGroupId} />
                          )
                        }
                      />
                    }
                    type={selectedSocialGroupId === socialGroupId ? 'default' : 'dashed'}
                    style={{
                      background: socialGroups[socialGroupId].colors.primary,
                      color: 'white',
                    }}
                  >
                    <DualTranslate>{socialGroups[socialGroupId].name}</DualTranslate>{' '}
                    <Avatar size="small">{summaryDicts.socialGroupsDict[socialGroupId]}</Avatar>
                  </Button>
                ))}
              </Flex>
              <br />
              {selectedSocialGroupId && (
                <SendButton
                  onClick={onSubmit}
                  block
                  disabled={!selectedSocialGroupId || !!user.associatedSocialGroupId}
                >
                  <Translate
                    en="Submit"
                    pt="Enviar"
                  />
                </SendButton>
              )}
            </RuleInstruction>
          </div>
        </Flex>
      </Instruction>

      {selectedStudentId && (
        <StudentModal
          student={students[selectedStudentId]}
          socialGroups={socialGroups}
          gossiperId={gossiperId}
          bestFriendId={bestFriendId}
          closeModal={() => setSelectedStudentId(null)}
          showSecrets={user.role === 'gossiper'}
        />
      )}
    </Step>
  );
}
