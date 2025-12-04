import { create } from 'zustand';

export const useChatStore = create((set) => ({
  activeConversation: null,
  conversations: [],
  messages: [],

  setActiveConversation: (conversation) => set({ activeConversation: conversation }),

  setConversations: (data) => set({ conversations: data }),

  setMessages: (data) => set({ messages: data })
}));
