type SubmitScenarioOrderPayload = {
  order: CardId[];
};

type OnSubmitOrder = (payload: SubmitOrderPayload) => void;

type ScaleEntry = {
  id: string;
  text: DualLanguageValue;
};
