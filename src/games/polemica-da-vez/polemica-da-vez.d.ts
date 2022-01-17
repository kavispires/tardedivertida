type Topic = {
  id: string;
  text: string;
};

type SubmitTopicPayload = {
  topicId: string;
  customTopic?: string;
};

type SubmitReactionPayload = {
  reaction: boolean;
  likesGuess: number;
};
