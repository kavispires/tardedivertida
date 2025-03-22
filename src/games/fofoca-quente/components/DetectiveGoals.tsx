// Ant Design Resources
import { Button, Tag } from 'antd';
// Components
import { Translate } from 'components/language';
import { RuleInstruction } from 'components/text';

type DetectiveGoalsProps = {
  bestFriendId?: string;
};

export function DetectiveGoals({ bestFriendId }: DetectiveGoalsProps) {
  return (
    <RuleInstruction type="lore" className="text-left">
      <Translate
        en={
          <>
            You are detective and must <strong>find out which student is the gossiper</strong>.
          </>
        }
        pt={
          <>
            Você é o detetive e deve descobrir <strong>qual aluno é o fofoqueiro.</strong>
          </>
        }
      />
      <br />
      <Tag color="red">
        <Translate en="Gossiper" pt="Fofoqueiro" />
      </Tag>{' '}
      <Button size="small">?</Button>
      <br />
      <Translate
        en={
          <>
            You will also need to figure out <strong>which of the 6 motivations</strong> the gossiper has.
          </>
        }
        pt={
          <>
            Você também precisará descobrir <strong>qual das 6 motivações</strong> o fofoqueiro tem.
          </>
        }
      />
      <br />
      <Tag color="red">
        <Translate en="Motivation" pt="Motivação" />
      </Tag>{' '}
      <Button size="small">?</Button>
      {bestFriendId && (
        <>
          <br />
          <Translate
            en="The gossiper also has a best friend who will lie for them. You don't need to figure out who it is, but keep it in mind."
            pt="O fofoqueiro também tem um melhor amigo que mentirá por ele. Você não precisa descobrir quem é, mas mantenha isso em mente."
          />
          <br />
          <Tag color="orange">
            <Translate en="Best Friend" pt="Melhor Amigo" />
          </Tag>{' '}
          <Button size="small">-</Button>
        </>
      )}
      <br />
      <Translate
        en="The gossiper will also have an allied social group that could lie for them."
        pt="O fofoqueiro também terá um grupo social aliado que poderá mentir por ele."
      />
      <br />
      <Tag color="orange">
        <Translate en="Allied Social Group" pt="Grupo Social Aliado" />
      </Tag>{' '}
      <Button size="small">-</Button>
    </RuleInstruction>
  );
}
