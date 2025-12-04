import { dummyChatList } from '@/data/dummyData';
import { useChatStore } from '@/store/chat.store';
import { Avatar, Badge } from 'antd';
import React from 'react';

const ConversationList = () => {
  const conversations = useChatStore((state) => state.conversations);
  const setConversations = useChatStore((state) => state.setConversations);
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);
  const activeConversation = useChatStore((state) => state.activeConversation);

  React.useEffect(() => {
    const fetchConversation = () => {
      setConversations(dummyChatList);
    };
    fetchConversation();
  }, [setConversations]);

  return (
    <div className="flex w-full flex-col gap-y-1 bg-white">
      {conversations.map((item) => (
        <div key={item.id} className={`flex w-full items-center gap-x-2 hover:bg-gray-100 ${activeConversation?.id === item.id ? 'bg-gray-100' : ''} rounded-md p-2 transition-colors hover:cursor-pointer`} onClick={() => setActiveConversation(item)}>
          <Badge count={1} size="small">
            <Avatar size={40} />
          </Badge>

          <div className="flex w-full flex-col overflow-hidden">
            <b className="text-xs">{item.contact_name}</b>

            <span className="w-full truncate text-xs">{item.last_message}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
