export const NLP_MODELS = ["crf", "crf-tf-idf", "spacy", "naive-bayes", "svm", "llm"] as const;
export type NLP_MODELS = typeof NLP_MODELS[number];