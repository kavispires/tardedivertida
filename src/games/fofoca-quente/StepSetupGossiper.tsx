import { useState } from 'react';
// Ant Design Resources
import { Alert, Avatar, Button, Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Icons
import { CheckMarkIcon } from 'icons/CheckMarkIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { SendButton } from 'components/buttons/SendButton';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { Step, type StepProps } from 'components/steps/Step';
import { Instruction } from 'components/text/Instruction';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
// Internal
import type { FofocaQuenteDefaultState, SubmitAssociatedSocialGroupPayload } from './utils/types';
import { useBoardSummary } from './utils/hooks';
import { SchoolBoard } from './components/SchoolBoard';
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
        staff={staff}
        hideDetectiveLocation
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
              associatedSocialGroup={null}
            />

            <RuleInstruction
              type="action"
              className="text-left"
            >
              <Translate
                en="To help you with your chaos, select one of these social groups to be associated with you. They also will be able to lie for you. The numbers in the circles are how many students are in each group."
                pt="Para te ajudar com seu caos, selecione um desses grupos sociais para ser associado a você. Eles também poderão mentir por você. Os números nos círculos são quantos alunos estão em cada grupo."
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
                    disabled={!!user.associatedSocialGroupId}
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
              {!!user.associatedSocialGroupId && (
                <Alert
                  className="mt-2"
                  type="success"
                  showIcon
                  title={
                    <Translate
                      en="All set! Let's wait for the detective to be ready."
                      pt="Tudo certo! Vamos aguardar o detetive ficar pronto."
                    />
                  }
                />
              )}
            </RuleInstruction>
          </div>
        </Flex>
      </Instruction>
    </Step>
  );
}
