type Part = {
  text: string;
};

type Content = {
  parts: Part[];
  role: string;
};

type Candidate = {
  content: Content;
  finishReason: string;
  avgLogprobs: number;
};

type UsageMetadata = {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
};

type Response = {
  candidates: Candidate[];
  usageMetadata: UsageMetadata;
  modelVersion: string;
};

export type AIDescriptionResponse = {
  result: {
    response: Response;
  };
};
