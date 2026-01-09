// Ant Design Resources
import { Alert, Button, Divider } from 'antd';
// Components
import { PlayerAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { Instruction } from 'components/text';

type OutcomeOptionsProps = {
  outcome?: string;
  onSubmitOutcome: GenericFunction;
  finalAnswersLeft: number;
};

export function OutcomeOptions({ outcome, onSubmitOutcome, finalAnswersLeft }: OutcomeOptionsProps) {
  return (
    <>
      <Divider />

      <Instruction contained>
        {outcome && outcome !== 'CONTINUE' ? (
          <Alert
            type="warning"
            showIcon
            title={
              <>
                <PlayerAvatar
                  avatarId="A"
                  size="small"
                />{' '}
                <Translate
                  pt="Meu algorítimo me diz que um dos casos abaixo aconteceu, selecione o apropriado:"
                  en="According to my calculations, one of the cases below happened, select the appropriate case:"
                />
              </>
            }
          />
        ) : (
          <Translate
            pt="Se qualquer um dos casos abaixo acontecer, clique no botão apropriado"
            en="If any of the cases below trigger, click the appropriate button"
          />
        )}
      </Instruction>

      <div className="v-case-container">
        <div className="v-case">
          <Instruction contained>
            <Translate
              pt="Alguém escreveu a resposta numa carta VERMELHA"
              en="Someone wrote the answer in a RED card"
            />
          </Instruction>
          <Button
            type="primary"
            ghost
            onClick={() =>
              onSubmitOutcome({
                outcome: 'WIN',
              })
            }
          >
            <Translate
              pt="Ganhamos!"
              en="Win!"
            />
          </Button>
        </div>
        <div className="v-case">
          <Instruction contained>
            <Translate
              pt="Alguém escreveu a resposta numa carta BRANCA"
              en="Someone wrote the answer in a WHITE card"
            />
          </Instruction>
          <Button
            danger
            ghost
            onClick={() =>
              onSubmitOutcome({
                outcome: 'FAIL',
              })
            }
          >
            <Translate
              pt="Perdermos"
              en="Lose"
            />
          </Button>
        </div>
        <div className="v-case">
          <Instruction contained>
            <Translate
              pt="Jogadores usaram mais respostas do que tinham"
              en="Players wrote more Guesses than they had available"
            />{' '}
            ({finalAnswersLeft})
          </Instruction>
          <Button
            type="primary"
            danger
            ghost
            onClick={() =>
              onSubmitOutcome({
                outcome: 'FAIL',
              })
            }
            disabled={finalAnswersLeft >= 0}
          >
            <Translate
              pt="Perdermos"
              en="Lose"
            />
          </Button>
        </div>
      </div>
    </>
  );
}
