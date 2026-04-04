// Ant Design Resources
import { Alert, Flex } from 'antd';
// Types
import type { GamePlayers, GamePlayer } from 'types/game';
// Components
import { Translate } from 'components/language/Translate';
import { Step, type StepProps } from 'components/steps/Step';
import { Instruction } from 'components/text/Instruction';
import { RuleInstruction } from 'components/text/RuleInstruction';
import { StepTitle } from 'components/text/StepTitle';
import { ViewIf } from 'components/views/ViewIf';
// Internal
import type { FofocaQuenteDefaultState } from './utils/types';
import { useFofocaQuenteContext } from './utils/FofocaQuenteContext';
import { SchoolBoard } from './components/SchoolBoard';
import { BoardSummary } from './components/BoardSummary';
import { DetectiveGoals } from './components/DetectiveGoals';
import { GossiperGoals } from './components/GossiperGoals';

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
                      Now you should spread the nastiest rumor possible to drive that student to leave the
                      school!
                      <br />
                      <strong>Click</strong> on the student you want to spread the rumor about and that
                      follows your motivation, select a rumor then submit!
                      <br />
                      Remember, you win if you can spread 5 rumors before getting caught.
                      <br />
                      TODO: Can skip option once per game
                    </>
                  }
                  pt={
                    <>
                      Hora de deixar um bilhete maldoso no armário de 2 estudantes! Eles ficarão com medo e
                      não poderão responder a nenhuma pergunta do detetive nesta rodada.
                      <br />
                      <strong>Clique</strong> nos estudantes que você quer intimidar e o botão estará
                      disponível se possível.
                      <br />
                      Você não pode intimidar nenhum estudante que esteja na mesma localização que o detetive
                      ou que já esteja intimidado, mas você pode até mesmo se intimidar (é só fingir se ele te
                      perguntar algo).
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
