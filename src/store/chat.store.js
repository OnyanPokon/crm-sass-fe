import { create } from 'zustand';

// eslint-disable-next-line no-unused-vars
export const useChatStore = create((set, get) => ({
  activeConversation: null,
  conversations: [],
  messages: [],

  setActiveConversation: (conversation) => set({ activeConversation: conversation }),
  setConversations: (data) => set({ conversations: data }),
  setMessages: (data) => set({ messages: data }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg]
    })),

  updateMessageAck: (ack) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === ack.id ? { ...m, ack: ack.ack } : m
      )
    })),

  updateConversationPreview: (message) => {
    const chatId = message.key?.remoteJid;

    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._chat.id === chatId
          ? { ...c, lastMessage: message }
          : c
      )
    }));
  }
}));

