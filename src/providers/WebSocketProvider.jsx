import React from 'react';
import { useChatStore } from '@/store/chat.store';
import { MessagesService } from '@/services';

// eslint-disable-next-line react/prop-types
export default function WebSocketProvider({ children }) {
  const addMessage = useChatStore((s) => s.addMessage);
  const updateAck = useChatStore((s) => s.updateMessageAck);
  const updatePreview = useChatStore((s) => s.updateConversationPreview);
  const updateOverview = useChatStore((s) => s.updateOverview);

  const wsRef = React.useRef(null);

  React.useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001/ws?session=*&events=*`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[WS] Connected to phone:');
    };

    ws.onmessage = (event) => {
      let data;

      try {
        data = JSON.parse(event.data);
      } catch (e) {
        console.log('❌ WS JSON PARSE ERROR:', e, event.data);
        return;
      }

      if (data.event === 'message.any') {
        const msg = data.payload;

        const isOwn = msg.fromMe || msg.key?.fromMe || msg._data?.key?.fromMe;

        // 👍 pesan kita sendiri — skip addMessage
        if (isOwn) {
          updateAck(msg);
          updatePreview(msg);
          updateOverview(msg);
          return;
        }

        // 👉 pesan lawan bicara — masukkan dulu
        addMessage(msg);
        updatePreview(msg);
        updateOverview(msg);

        const activeChat = useChatStore.getState().activeConversation?._chat.id;

        const remoteJid = msg._data?.key?.remoteJid || msg.key?.remoteJid || msg.from;

        if (activeChat === remoteJid) {
          // FE update
          useChatStore.getState().setMessageSeen(msg.id);

          // BE call
          MessagesService.seenText(msg, remoteJid);
        }
      }

      if (data.event === 'message.ack') {
        updateAck(data.payload);
      }
    };

    ws.onclose = () => {
      console.log('[WS] Disconnected. Reconnecting in 1s...');
      setTimeout(() => {
        wsRef.current = null;
      }, 1000);
    };

    return () => ws.close();
  }, [addMessage, updateAck, updateOverview, updatePreview]);

  return <>{children}</>;
}
