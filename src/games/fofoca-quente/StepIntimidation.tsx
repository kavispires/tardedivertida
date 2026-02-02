// Ant Design Resources
import { Alert, Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/player';
// Components
import { Translate } from 'components/language';
import { Step, type StepProps } from 'components/steps';
import { Instruction, RuleInstruction, StepTitle } from 'components/text';
import { ViewIf } from 'components/views';
// Internal
import type { FofocaQuenteDefaultState } from './utils/types';
import { SchoolBoard } from './components/SchoolBoard';
import { BoardSummary } from './components/BoardSummary';
import { DetectiveGoals } from './components/DetectiveGoals';
import { GossiperGoals } from './components/GossiperGoals';
import { useFofocaQuenteContext } from './components/FofocaQuenteContext';
// Hooks

type StepIntimidationProps = {
  players: GamePlayers;
  user: GamePlayer;
  gossiperId: string;
  bestFriendId?: string;
} & Pick<StepProps, 'announcement'> &
  Pick<
    FofocaQuenteDefaultState,
    'schoolBoard' | 'students' | 'socialGroups' | 'staff' | 'motivations' | 'gossiperMotivationIndex'
  >;

export function StepIntimidation({
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
}: StepIntimidationProps) {
  const { intimidation, isTheDetectivePlayer, isTheGossiperPlayer } = useFofocaQuenteContext();

  return (
    <Step
      fullWidth
      announcement={announcement}
    >
      <StepTitle>
        <Translate
          pt={<>Intimidação de dois estudantes</>}
          en={<>Intimidating two students</>}
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
                      Intimidate 2 students (leaving a nasty note in their locker), they will be scared and
                      won't be able to answer any questions for the detective this round.
                      <br />
                      You cannot intimidate any student in the same location as the detetive or that is
                      already intimidated but you can intimidate even yourself (just pretend if he asks you
                      any question)
                      <br />
                      Click on the students you want to intimidate and the button will be available if
                      possible.
                    </>
                  }
                  pt={
                    <>
                      Intimide 2 estudantes (deixando um bilhete maldoso no armário deles), eles ficarão com
                      medo e não poderão responder a nenhuma pergunta do detetive nesta rodada.
                      <br />
                      Você não pode intimidar nenhum estudante que esteja na mesma localização que o detetive
                      ou que já esteja intimidado, mas você pode até mesmo se intimidar (é só fingir se ele te
                      perguntar algo).
                      <br />
                      Clique nos estudantes que você quer intimidar e o botão estará disponível se possível.
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
