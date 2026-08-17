import { useState } from 'react';
// Ant Design Resources
import { Button, Modal, Typography } from 'antd';
// Components
import { Translate } from '@components/language/Translate';
import { RuleInstruction } from '@components/text/RuleInstruction';

export function EliminationRulesModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <RuleInstruction
        type="tip"
        style={{ margin: 0, padding: 0, minWidth: 'auto', maxWidth: 'auto' }}
      >
        <Button
          type="link"
          onClick={() => setOpen(true)}
          size="small"
        >
          <Translate
            pt="Dicas de Eliminação"
            en="Elimination Tips"
          />
        </Button>
      </RuleInstruction>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={
          <Translate
            pt="Dicas de Eliminação"
            en="Elimination Tips"
          />
        }
      >
        <Typography.Paragraph component="ul">
          <li>
            <Translate
              en="When you click on a character, they are marked with a checkmark to help you filter them out
                  of the solution. You can click again to unmark them if you change your mind."
              pt="Ao clicar em um personagem, ele é marcado com um check para te ajudar a filtrar ele da
                  solução. Você pode clicar novamente para desmarcar caso mude de ideia."
            />
          </li>
          <li>
            <Translate
              en="You may select one of the questions below to mark everyone that only fits that question, or
                  no questions at all do perform general eliminations."
              pt="Você pode selecionar uma das perguntas abaixo para marcar todos que se encaixam apenas
                  naquela pergunta, ou nenhuma pergunta para realizar eliminações gerais."
            />
          </li>
          <li>
            <Translate
              en="Use the <strong>Intersection button</strong> to display only characters that fit all
                  selected marks in all questions at once."
              pt="Use o <strong>botão de Interseção</strong> para exibir apenas os personagens que se encaixam
                  em todas as marcações selecionadas em todas as perguntas ao mesmo tempo."
            />
          </li>
          <li>
            <Translate
              en="These eliminations/markings are only related to the character you must guess, not any other
                  ones."
              pt=" Essas eliminações/marcações estão relacionadas apenas ao personagem que você deve adivinhar,
                  e não a qualquer outro."
            />
          </li>
        </Typography.Paragraph>
      </Modal>
    </>
  );
}
