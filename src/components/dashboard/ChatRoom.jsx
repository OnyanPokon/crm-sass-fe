/* eslint-disable react/prop-types */
import { useService } from '@/hooks';
import { MessagesService } from '@/services';
import { useChatStore } from '@/store/chat.store';
import { CommentOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';
import ChatForm from './ChatForm/ChatForm';

const ChatRoom = ({ phoneId }) => {
  const activeConversation = useChatStore((state) => state.activeConversation);
  const messages = useChatStore((state) => state.messages);
  const setMessages = useChatStore((state) => state.setMessages);

  const { execute: fetchAllMessages } = useService(MessagesService.getAllMessageInActiveConversation);

  React.useEffect(() => {
    if (activeConversation) {
      fetchAllMessages(phoneId, activeConversation._chat.id).then((res) => {
        if (res?.data) {
          setMessages(res.data);
        }
      });
    }
  }, [activeConversation, fetchAllMessages, phoneId, setMessages]);

  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  if (!activeConversation)
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
        <CommentOutlined className="mb-4 text-5xl" />
        <span>Kirim dan terima pesan</span>
      </div>
    );

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-x-2 border-b border-gray-100 p-4">
        <Avatar src={activeConversation.picture} />
        <span className="font-semibold">
          {activeConversation.lastMessage.from.endsWith('lid') ? (activeConversation.lastMessage._data.key.remoteJidAlt ? activeConversation.lastMessage._data.key.remoteJidAlt.split('@')[0] : '-') : activeConversation.lastMessage.from.split('@')[0]}
        </span>
      </div>

      <div ref={messagesEndRef} className="flex-1 overflow-y-auto px-8 py-6">
        {[...messages]
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((item) => {
            const text = item.body || item?._data?.message?.extendedTextMessage?.text || '';

            const time = new Date(item.timestamp * 1000).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            });

            const isMe = item.fromMe;

            console.log(item._data?.message?.imageMessage?.directPath);

            return (
              <div key={item.id} className={`mb-3 flex flex-col gap-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-start gap-x-2">
                  {/* {item.media && (
                    <Image
                      src={item.media.url}
                      alt="media"
                      className="max-w-xs rounded-lg"
                      preview
                    />
                  )} */}
                  {text && <div className={`max-w-lg rounded-lg p-3 text-xs ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}>{text}</div>}
                </div>
                <span className="px-1 text-[10px] text-gray-400">{time}</span>
              </div>
            );
          })}
      </div>

      <ChatForm phoneId={phoneId} />
    </div>
  );
};

export default ChatRoom;
