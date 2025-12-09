import { useService } from '@/hooks';
import { MessagesService } from '@/services';
import { useChatStore } from '@/store/chat.store';

export const useSendText = (phoneId) => {
  const sendText = useService(MessagesService.sendText);

  const send = async (chatId, text) => {
    const { isSuccess, message } = await sendText.execute(
      {
        chatId,
        reply_to: null,
        text,
        linkPreview: true,
        linkPreviewHighQuality: false
      },
      phoneId
    );

    if (!isSuccess) return { isSuccess, message };

    useChatStore.getState().addMessage({
      id: crypto.randomUUID(),
      fromMe: true,
      body: text,
      timestamp: Math.floor(Date.now() / 1000),
      ack: 0,
      _chat: { id: chatId }
    });

    return { isSuccess, message };
  };

  return { send, isLoading: sendText.isLoading };
};
