type Topic = {
  id: string;
  text: string;
};

type PastTopic = {
  id: string;
  text: string;
  likes: number;
  custom?: boolean;
};

type SubmitTopicPayload = {
  topicId: string;
  customTopic?: string;
};

type SubmitReactionPayload = {
  reaction: boolean;
  likesGuess: number;
};
