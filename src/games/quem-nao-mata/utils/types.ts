export type SubmitTargetPayload = {
  targetId: PlayerId;
};

export type SubmitMessagePayload = {
  targetId: PlayerId;
  senderId: PlayerId;
  recipientId?: PlayerId;
};

export type SubmitDecisionPayload = {
  targetId: PlayerId;
};

export type Message = {
  targetId: PlayerId;
  recipientId: PlayerId | 'ALL';
};
