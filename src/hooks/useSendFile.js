import { useService } from '@/hooks';
import { MessagesService } from '@/services';
import { useChatStore } from '@/store/chat.store';

export const useSendFile = (phoneId) => {
  const sendFile = useService(MessagesService.sendFile);

  const send = async (chatId, items = []) => {
    for (const item of items) {
      const { isSuccess, message } = await sendFile.execute(
        {
          chatId,
          caption: item.caption,
          file: item.file
        },
        phoneId,
        item.file
      );

      if (!isSuccess) return { isSuccess, message };

      useChatStore.getState().addMessage({
        id: crypto.randomUUID(),
        fromMe: true,
        body: item.caption,
        timestamp: Math.floor(Date.now() / 1000),
        ack: 0,
        _chat: { id: chatId }
      });
    }

    return { isSuccess: true, message: 'All File sent' };
  };

  return { send, isLoading: sendFile.isLoading };
};
