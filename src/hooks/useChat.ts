
import { useChatCore } from "./useChatCore";

export const useChat = (language: string) => {
  const chatCore = useChatCore(language);
  
  return {
    ...chatCore,
    handleRefreshSuggestions: chatCore.refreshSuggestions
  };
};
