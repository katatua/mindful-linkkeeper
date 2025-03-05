
import { useChatCore } from "./useChatCore";

export const useChat = (language: string) => {
  return useChatCore(language);
};
