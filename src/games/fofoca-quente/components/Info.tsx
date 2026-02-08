import { clsx } from 'clsx';
// Ant Design Resources
import {
  AimOutlined,
  BarChartOutlined,
  CustomerServiceOutlined,
  EditOutlined,
  FileUnknownOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { FloatButton, Typography } from 'antd';
// Hooks
import { useQueryParams } from 'hooks/useQueryParams';
// Components
import { DualTranslate, Translate } from 'components/language';
import { Window } from 'components/layout/Window';
// Internal
import type { FofocaQuenteDefaultState } from '../utils/types';
import { PHASES_DESCRIPTIONS, QUESTIONS } from '../utils/constants';
import { BoardSummary } from './BoardSummary';

type InfoProps = {
  phase: FofocaQuenteDefaultState['phase'];
  students: FofocaQuenteDefaultState['students'];
  socialGroups: FofocaQuenteDefaultState['socialGroups'];
  motivations: FofocaQuenteDefaultState['motivations'];
};

export function Info({ phase, students, socialGroups, motivations }: InfoProps) {
  const { addParam } = useQueryParams();

  return (
    <>
      <FloatButton.Group
        trigger="hover"
        type="primary"
        shape="square"
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton
          tooltip={{
            children: (
              <Translate
                en="Game Phases"
                pt="Fases do Jogo"
              />
            ),
            placement: 'left',
          }}
          onClick={() => addParam('game-phases-info', 'true')}
          icon={<OrderedListOutlined />}
        />
        <FloatButton
          tooltip={{
            children: (
              <Translate
                en="Board Summary"
                pt="Resumo"
              />
            ),
            placement: 'left',
          }}
          onClick={() => addParam('board-summary', 'true')}
          icon={<BarChartOutlined />}
        />
        <FloatButton
          tooltip={{
            children: (
              <Translate
                en="Motivations"
                pt="Motivações"
              />
            ),
            placement: 'left',
          }}
          onClick={() => addParam('motivations', 'true')}
          icon={<AimOutlined />}
        />
        <FloatButton
          tooltip={{
            children: (
              <Translate
                en="Questions"
                pt="Sugestões de Perguntas"
              />
            ),
            placement: 'left',
          }}
          onClick={() => addParam('questions', 'true')}
          icon={<FileUnknownOutlined />}
        />
        <FloatButton
          tooltip={{
            children: (
              <Translate
                en="Notebook"
                pt="Blocos de Anotações"
              />
            ),
            placement: 'left',
          }}
          onClick={() => addParam('notebook', 'true')}
          icon={<EditOutlined />}
        />
      </FloatButton.Group>
      <GamePhasesInfo phase={phase} />
      <BoardSummaryInfo
        students={students}
        socialGroups={socialGroups}
      />
      <Motivations motivations={motivations} />
      <Questions />
      <Notebook />
    </>
  );
}

type GamePhasesInfoProps = {
  phase: InfoProps['phase'];
};

function GamePhasesInfo({ phase }: GamePhasesInfoProps) {
  return (
    <Window
      index={0}
      windowId="game-phases-info"
      title={
        <Translate
          en="Game Phases"
          pt="Fases do Jogo"
        />
      }
    >
      {PHASES_DESCRIPTIONS.map(({ phase: phaseKey, title, description }) => (
        <div
          key={phaseKey}
          className={clsx(phase === phaseKey && 'highlight')}
        >
          <h3>
            <DualTranslate>{title}</DualTranslate>
          </h3>
          <p>
            <DualTranslate>{description}</DualTranslate>
          </p>
        </div>
      ))}
    </Window>
  );
}

function BoardSummaryInfo({ students, socialGroups }: Pick<InfoProps, 'students' | 'socialGroups'>) {
  return (
    <Window
      index={1}
      windowId="board-summary"
      title={
        <Translate
          en="Board Summary"
          pt="Resumo do Tabuleiro"
        />
      }
    >
      <BoardSummary
        students={students}
        socialGroups={socialGroups}
      />
    </Window>
  );
}

function Motivations({ motivations }: Pick<InfoProps, 'motivations'>) {
  return (
    <Window
      index={2}
      windowId="motivations"
      title={
        <Translate
          en="Motivations"
          pt="Motivações"
        />
      }
    >
      {motivations.map((motivation, index) => (
        <Typography.Paragraph key={index}>
          <strong>
            <DualTranslate>{motivation.title}</DualTranslate>
          </strong>
          <br />
          <DualTranslate>{motivation.description}</DualTranslate>
        </Typography.Paragraph>
      ))}
    </Window>
  );
}

function Questions() {
  return (
    <Window
      index={3}
      windowId="questions"
      title={
        <>
          <Translate
            en="Questions"
            pt="Sugestões de Perguntas"
          />{' '}
          ({Object.keys(QUESTIONS).length})
        </>
      }
    >
      <ul>
        {Object.keys(QUESTIONS).map((key) => (
          <li key={key}>
            <Typography.Paragraph key={key}>
              <DualTranslate>{QUESTIONS[key]}</DualTranslate>
            </Typography.Paragraph>
          </li>
        ))}
      </ul>
    </Window>
  );
}

function Notebook() {
  return (
    <Window
      index={4}
      windowId="notebook"
      title={
        <Translate
          en="Notebook"
          pt="Blocos de Anotações"
        />
      }
    >
      TESTANDO
    </Window>
  );
}
