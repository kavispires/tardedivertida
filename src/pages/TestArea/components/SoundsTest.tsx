import { delay } from "lodash";
import { useEffect, useState } from "react";
// Ant Design Resources
import { Button, Space } from "antd";
// Hooks
import { useGlobalLocalStorage } from "hooks/useGlobalLocalStorage";
import { useLanguage } from "hooks/useLanguage";
// Utils
import { speak } from "utils/speech";
// Components
import { ArteRuimTimerSound } from "components/audio/ArteRuimTimerSound";
import { DJPruPruPruSound } from "components/audio/DJPruPruPruSound";
import { Speak } from "components/audio/Speak";
import { Translate } from "components/language";
import { Instruction, Title } from "components/text";
// Internal
import { DecisionButtons } from "./DecisionButtons";
import { TestStepProps } from "../TestArea";

export function SoundsTest({ onResult, step }: TestStepProps) {
  const [showAudio, setShowAudio] = useState<string>("");
  const [volume, setVolume] = useGlobalLocalStorage("volume");
  const { language } = useLanguage();

  useEffect(() => {
    if (volume < 0.5) {
      setVolume(0.5);
    }
  }, [volume, setVolume]);

  const onStartAudio = async (value: string) => {
    setShowAudio(value);
    delay(() => setShowAudio(""), 3000);
  };

  return (
    <Space className="space-container full-width" direction="vertical">
      <Title level={2} size="small">
        <Translate pt="Sons" en="Sounds" />
      </Title>

      <Instruction contained>
        <Translate
          pt="Aperte os botões abaixo para ouvir sons de diferentes jogos"
          en="Press the buttons below to hear sounds from different games"
        />
      </Instruction>

      <Space wrap className="space-container full-width" direction="vertical">
        <Button
          onClick={() => onStartAudio("arte-ruim")}
          disabled={Boolean(showAudio)}
        >
          <Translate pt="Som 1" en="Sound 1" />
        </Button>
        <Button
          onClick={() => onStartAudio("dj")}
          disabled={Boolean(showAudio)}
        >
          <Translate pt="Som 2" en="Sound 2" />
        </Button>
        <Button
          onClick={() => onStartAudio("dialog")}
          disabled={Boolean(showAudio)}
        >
          <Translate pt="Som 3" en="Sound 3" />
        </Button>
        <Button
          onClick={() =>
            speak(
              {
                pt: "Olá, o seu teste 4 deu certo",
                en: "Hello, you test 4 worked well.",
              },
              language,
              volume,
            )
          }
          disabled={Boolean(showAudio)}
        >
          <Translate pt="Som 4" en="Sound 4" />
        </Button>
        {showAudio === "arte-ruim" && <ArteRuimTimerSound />}
        {showAudio === "dj" && <DJPruPruPruSound />}
        {showAudio === "dialog" && (
          <Speak
            text={{
              pt: "Olá, o seu teste 3 deu certo",
              en: "Hello, you test 3 worked well.",
            }}
          />
        )}
      </Space>

      <DecisionButtons
        step={step}
        onClick={onResult}
        prompt={{
          pt: "Você conseguiu ouvir todos os 4 sons?",
          en: "Were you able to hear all 4 sounds?",
        }}
      />
    </Space>
  );
}
