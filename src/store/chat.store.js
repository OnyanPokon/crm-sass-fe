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
      messages: state.messages.map((m) => (m.id === ack.id ? { ...m, ack: ack.ack } : m))
    })),

  updateConversationPreview: (message) => {
    const chatId = message._data?.key?.remoteJid || message.key?.remoteJid || message.from;

    if (!chatId) return;

    set((state) => ({
      conversations: state.conversations.map((c) => (c._chat.id === chatId ? { ...c, lastMessage: message } : c))
    }));
  },

  updateOverview: (message) =>
    set((state) => {
      const remoteJid = message._data?.key?.remoteJid || message.key?.remoteJid || message.from;

      const idx = state.conversations.findIndex((c) => c._chat.id === remoteJid);

      if (idx === -1) return {};

      const updated = [...state.conversations];
      updated[idx] = {
        ...updated[idx],
        lastMessage: message
      };

      const moved = updated.splice(idx, 1)[0];
      updated.unshift(moved);

      return { conversations: updated };
    })
}));
