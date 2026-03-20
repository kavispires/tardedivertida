// Ant Design Resources
import { Alert, Button, Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Components
import { Popconfirm } from 'components/general/Popconfirm';
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { FofocaQuenteDefaultState } from './utils/types';
import { useFofocaQuenteContext } from './utils/FofocaQuenteContext';
import { SchoolBoard } from './components/SchoolBoard';
import { BoardSummary } from './components/BoardSummary';
import { DetectiveGoals } from './components/DetectiveGoals';
import { GossiperGoals } from './components/GossiperGoals';

type StepResponseProps = {
  players: GamePlayers;
  user: GamePlayer;
  gossiperId: string;
  bestFriendId?: string;
} & Pick<StepProps, 'announcement'> &
  Pick<
    FofocaQuenteDefaultState,
    'schoolBoard' | 'students' | 'socialGroups' | 'staff' | 'motivations' | 'gossiperMotivationIndex'
  >;

export function StepResponse({
  announcement,
  schoolBoard,
  socialGroups,
  students,
  gossiperId,
  bestFriendId,
  staff,
  motivations,
  gossiperMotivationIndex,
  user,
}: StepResponseProps) {
  const { intimidation, isTheDetectivePlayer, isTheGossiperPlayer } = useFofocaQuenteContext();

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Reagindo ao boato...</>}
          en={<>Reacting to the rumor...</>}
        />
      </StepTitle>

      <SchoolBoard
        schoolBoard={schoolBoard}
        students={students}
        socialGroups={socialGroups}
        staff={staff}
      />

      <ViewIf condition={isTheGossiperPlayer}>
        <Instruction contained>
          <Flex justify="center">
            <BoardSummary
              students={students}
              socialGroups={socialGroups}
            />

            <div>
              <GossiperGoals
                motivation={motivations[gossiperMotivationIndex]}
                students={students}
                gossiperId={gossiperId}
                bestFriendId={bestFriendId}
                associatedSocialGroup={socialGroups[user.associatedSocialGroupId]}
              />

              <RuleInstruction
                type="action"
                className="text-left"
              >
                <Translate
                  en={
                    <>
                      Now you should spread the nastiest rumor possible to drive that student to leave the
                      school! Remember, you win if you can spread 5 rumors before getting caught.
                      <br />
                      <strong>Click</strong> on the student you want to spread the rumor about and that
                      follows your motivation, select a rumor then submit!
                    </>
                  }
                  pt={
                    <>
                      Agora você deve espalhar o boato mais maldoso possível para fazer com que esse estudante
                      saia da escola! Lembre-se, você vence se conseguir espalhar 5 boatos antes de ser pego.
                      <br />
                      <strong>Clique</strong> no estudante sobre o qual você deseja espalhar o boato e que
                      siga sua motivação, selecione um boato e envie!
                    </>
                  }
                />

                <br />
                {intimidation.currentIntimidations.length === 1 && (
                  <Alert
                    className="mt-2"
                    type="warning"
                    showIcon
                    title={
                      <Translate
                        en="Intimidate 1 more student."
                        pt="Intimide mais 1 estudante."
                      />
                    }
                  />
                )}
              </RuleInstruction>
            </div>
          </Flex>
        </Instruction>
      </ViewIf>

      <ViewIf condition={isTheDetectivePlayer}>
        <Instruction contained>
          <Flex justify="center">
            <BoardSummary
              students={students}
              socialGroups={socialGroups}
            />

            <div>
              <DetectiveGoals bestFriendId={bestFriendId} />

              <RuleInstruction
                type="wait"
                className="text-left"
              >
                <Translate
                  en={
                    <>
                      The gossiper is intimidating 2 students this round (leaving a nasty note in their
                      locker), they will be scared and won't be able to answer any questions for you this
                      round.
                      <br />
                      The gossiper cannot intimidate any student in the same location as you or that is
                      already intimidated but he can intimidate even himself (just pretend if you ask him any
                      question)
                      <br />
                      Intimidated students will be turned grayscale on the board.
                    </>
                  }
                  pt={
                    <>
                      O fofoqueiro está intimidando 2 estudantes nesta rodada (deixando um bilhete maldoso no
                      armário deles), eles ficarão com medo e não poderão responder a nenhuma pergunta sua
                      nesta rodada.
                    </>
                  }
                />
              </RuleInstruction>
            </div>
          </Flex>
        </Instruction>
      </ViewIf>
    </Step>
  );
}
