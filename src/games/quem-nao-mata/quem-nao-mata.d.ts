type SubmitTargetPayload = {
  targetId: PlayerId;
};

type SubmitMessagePayload = {
  targetId: PlayerId;
  senderId: PlayerId;
  recipientId?: PlayerId;
};

type QMessage = {
  targetId: PlayerId;
  recipientId: PlayerId | 'ALL';
};
