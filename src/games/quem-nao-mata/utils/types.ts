export type SubmitTargetPayload = {
  targetId: UID;
};

export type SubmitMessagePayload = {
  targetId: UID;
  senderId: UID;
  recipientId?: UID;
};

export type SubmitDecisionPayload = {
  targetId: UID;
};

export type Message = {
  targetId: UID;
  recipientId: UID | 'ALL';
};
