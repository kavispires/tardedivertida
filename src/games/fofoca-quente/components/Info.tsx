// Ant Design Resources
import {
  AimOutlined,
  BarChartOutlined,
  CustomerServiceOutlined,
  FileUnknownOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import { FloatButton } from 'antd';
// Components
import { Translate } from 'components/language';

export function Info() {
  return (
    <FloatButton.Group
      trigger="hover"
      type="primary"
      // placement="bottom"
      shape="square"
      // style={{ insetInlineStart: -250 }}
      icon={<CustomerServiceOutlined />}
    >
      <FloatButton
        tooltip={<Translate en="Game Phases" pt="Fases do Jogo" />}
        icon={<OrderedListOutlined />}
      />
      <FloatButton tooltip={<Translate en="Board Summary" pt="Resumo" />} icon={<BarChartOutlined />} />
      <FloatButton tooltip={<Translate en="Motivations" pt="Motivações" />} icon={<AimOutlined />} />
      <FloatButton
        tooltip={<Translate en="Questions" pt="Sugestões de Perguntas" />}
        icon={<FileUnknownOutlined />}
      />
      <FloatButton tooltip={<Translate en="Notebook" pt="Blocos de Notas" />} />
    </FloatButton.Group>
  );
}
