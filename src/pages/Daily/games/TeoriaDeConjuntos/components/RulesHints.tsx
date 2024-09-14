import { Region } from 'pages/Daily/components/Region';
import { useToggle } from 'react-use';
// Ant Design Resources
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
// Components
import { Translate } from 'components/language';

export function RulesHints() {
  const [showTipsModal, toggleTipsModal] = useToggle(false);

  return (
    <>
      <Region className="rules-hints">
        <Button onClick={() => toggleTipsModal(true)} icon={<QuestionCircleOutlined />} ghost>
          <Translate pt="Entenda as regras gramaticais" en="Understand the grammar rules" />
        </Button>
      </Region>
      <Modal
        title={<Translate pt="Regras gramaticais" en="Grammar rules" />}
        open={showTipsModal}
        footer={null}
        onCancel={toggleTipsModal}
      >
        <Typography.Paragraph>
          O título do jogo diário contém dicas sobres as regras gramaticais secretas dos círculos em forma de
          categorias.
          <br />
          As estrelas é a classificação do nível de dificuldade das regras (1-5).
        </Typography.Paragraph>

        <Entry category="Comparação" hints={['Quantidade de vogais vs consoantes ou posição']} />

        <Entry
          category="Contagem"
          hints={['Contém um número específico de letras, vogais, consoantes, ou sílabas']}
        />

        <Entry category="Gramática" hints={['Sílaba tônica, origem, gênero']} />

        <Entry category="Inclusão" hints={['Contém uma ou mais letras específicas']} />

        <Entry category="Inicialização" hints={['Começa com uma letra (ou letras) específica']} />

        <Entry category="Repetição" hints={['Contém letras repetidas ou repetidas de maneira específica']} />

        <Entry category="Sequência" hints={['Contém uma sequência de letras específica']} />

        <Entry category="Terminação" hints={['Termina com uma letra (ou letras) específica']} />
      </Modal>
    </>
  );
}

function Entry({ category, hints }: { category: string; hints: string[] }) {
  return (
    <>
      <Typography.Paragraph>
        <Typography.Text strong>{category}: </Typography.Text>
        {hints.join(', ')}.
      </Typography.Paragraph>
      <ul></ul>
    </>
  );
}
