import { Keyboard } from "pages/Daily/components/Keyboard";
import { useMemo, useState } from "react";
// Ant Design Resources
import { BarChartOutlined } from "@ant-design/icons";
import { Button, Layout, Modal, Space } from "antd";
// Types
import type { Me } from "types/user";
// Icons
import { DailyArtGameIcon } from "icons/DailyArtGameIcon";
// Components
import { DualTranslate, Translate } from "components/language";
// Internal
import { getInitialState } from "../utils/helpers";
import { SETTINGS } from "../utils/settings";
import type { DailyArteRuimEntry } from "../utils/types";
import { useArteRuimEngine } from "../utils/useArteRuimEngine";
import { Header } from "../../../components/Header";
import { Menu } from "../../../components/Menu";
import { DrawingCarousel } from "./DrawingCarousel";
import { Prompt } from "./Prompt";
import { ResultsModalContent } from "./ResultsModalContent";
import { Rules } from "./Rules";

type DailyArteRuimProps = {
  data: DailyArteRuimEntry;
  currentUser: Me;
};

export function DailyArteRuim({ data }: DailyArteRuimProps) {
  const [initialState] = useState(getInitialState(data));

  const {
    hearts,
    guesses,
    showResultModal,
    setShowResultModal,
    isWin,
    isComplete,
    guessLetter,
    solution,
  } = useArteRuimEngine(data, initialState);

  return (
    <Layout className="app">
      <Header icon={<DailyArtGameIcon />} localStorageKey={SETTINGS.KEY}>
        TD <DualTranslate>{SETTINGS.NAME}</DualTranslate> #{data.number}
      </Header>
      <Layout.Content>
        <Menu
          hearts={hearts}
          total={SETTINGS.HEARTS}
          openRules={!isComplete || hearts === SETTINGS.HEARTS}
          rules={<Rules />}
        />

        <DrawingCarousel drawings={data.drawings} />

        <Prompt text={data.text} guesses={guesses} />

        {isComplete && (
          <Space
            className="results-container"
            direction="vertical"
            align="center"
          >
            <Button
              onClick={() => setShowResultModal(true)}
              type="primary"
              icon={<BarChartOutlined />}
            >
              <Translate pt="Ver Resultado" en="Show Results" />
            </Button>
          </Space>
        )}
        <Modal
          title={<Translate pt="Resultado" en="Results" />}
          open={showResultModal}
          onCancel={() => setShowResultModal(false)}
          footer={null}
        >
          <ResultsModalContent
            challenge={data.number}
            win={isWin}
            hearts={hearts}
            text={data.text}
            solution={solution}
          />
        </Modal>

        <Keyboard
          lettersState={guesses}
          onLetterClick={guessLetter}
          disabled={isComplete}
        />
      </Layout.Content>
    </Layout>
  );
}
