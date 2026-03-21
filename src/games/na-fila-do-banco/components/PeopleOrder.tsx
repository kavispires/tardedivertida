// Ant Design Resources
import { Flex, Tooltip } from 'antd';
// Components
import { ImageCard } from 'components/image-cards';
import { DualTranslate } from 'components/language';

const ORDER: {
  id: string;
  tooltip: DualLanguageValue;
}[] = [
  {
    id: 'nfdb-neutral-1',
    tooltip: {
      en: "The Retiree goes in front of the Veteran, after all she's old and a woman",
      pt: 'A Aposentada vai na frente do Deficiente, afinal ela é velha e mulher',
    },
  },
  {
    id: 'nfdb-neutral-2',
    tooltip: {
      en: 'The Veteran goes in front of the Pregnant woman, after all he has served the country',
      pt: 'O Deficiente vai na frente da Gestante, afinal ele tem mais dificuldade de locomoção',
    },
  },
  {
    id: 'nfdb-neutral-3',
    tooltip: {
      en: 'The Pregnant woman goes in front of the Businessman, after all she is expecting a child',
      pt: 'A Gestante vai na frente do Empresário, afinal ela está esperando um filho',
    },
  },
  {
    id: 'nfdb-neutral-4',
    tooltip: {
      en: "The Businessman goes in front of the Student, after all he a busy man and she's just a kid",
      pt: 'O Empresário vai na frente da Estudante, afinal ele é um homem ocupado e ela ainda é nova',
    },
  },
  {
    id: 'nfdb-neutral-5',
    tooltip: {
      en: "The Student goes in front of the Motoboy, after all she's super hot",
      pt: 'A Estudante vai na frente do Motoboy, afinal ela é super gata',
    },
  },
  {
    id: 'nfdb-neutral-6',
    tooltip: {
      en: "The Motoboy goes in front of the Retiree, after all he's in a hurry and the Retiree is slow",
      pt: 'O Motoboy vai na frente da Aposentada, afinal ele está com pressa e a Aposentada é devagar',
    },
  },
  {
    id: 'nfdb-neutral-0',
    tooltip: {
      en: "When a kid joins the line, if there's another person of the same color as the kid in line, that person will leave the line and be behind the kid taking care of her. Also, the kid scores 0 points if they are served by the teller.",
      pt: 'Quando uma criança entra na fila, se já tiver outra pessoa da mesma cor na fila, essa pessoa sai da fila e fica atrás da criança cuidando dela. Além disso, a criança pontua 0 pontos se for atendida pelo caixa.',
    },
  },
];

export function PeopleOrder() {
  return (
    <Flex
      gap={3}
      className="contained"
      align="center"
    >
      {ORDER.map((entry) => (
        <Tooltip
          key={entry.id}
          title={<DualTranslate>{entry.tooltip}</DualTranslate>}
        >
          <ImageCard
            cardId={entry.id}
            cardWidth={64}
          />
        </Tooltip>
      ))}
    </Flex>
  );
}
