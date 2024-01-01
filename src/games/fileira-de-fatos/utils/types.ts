export type SubmitScenarioOrderPayload = {
  order: CardId[];
};

export type OnSubmitOrder = (payload: SubmitScenarioOrderPayload) => void;

export type ScaleEntry = {
  id: string;
  text: DualLanguageValue;
};
