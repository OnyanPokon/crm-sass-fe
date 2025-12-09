/* eslint-disable react/prop-types */
import { useService } from '@/hooks';
import { MessagesService } from '@/services';
import { useChatStore } from '@/store/chat.store';
import { WhatsAppOutlined } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
import React from 'react';

const ConversationList = ({ phoneId }) => {
  const conversations = useChatStore((state) => state.conversations);
  const setConversations = useChatStore((state) => state.setConversations);
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);
  const activeConversation = useChatStore((state) => state.activeConversation);

  const { execute: fetchChatOverview } = useService(MessagesService.getAllChatOverview);

  React.useEffect(() => {
    if (conversations.length > 0) return; // ⛔ CEGAH OVERWRITE

    fetchChatOverview({
      data: { pagination: { limit: 20, offset: 0 } },
      id: phoneId
    }).then((res) => {
      if (res?.data) {
        setConversations(res.data);
      }
    });
  }, [conversations.length, fetchChatOverview, phoneId, setConversations]);

  return (
    <div className="flex w-full flex-col gap-y-1 bg-white">
      {conversations.map((item) => (
        <div key={item.id} className={`flex w-full items-center hover:bg-gray-100 ${activeConversation?.id === item.id ? 'bg-gray-100' : ''} rounded-md px-3 py-3 transition-colors hover:cursor-pointer`} onClick={() => setActiveConversation(item)}>
          <div className="flex flex-1 items-center gap-x-2 overflow-hidden">
            <Badge size="small">
              <Avatar size={50} src={item.picture} />
            </Badge>

            <div className="flex flex-col overflow-hidden">
              <div className="inline-flex items-center gap-x-1 truncate font-semibold">
                <WhatsAppOutlined className="text-green-500" />
                {item.lastMessage.from.endsWith('lid') ? (item.lastMessage._data.key.remoteJidAlt ? item.lastMessage._data.key.remoteJidAlt.split('@')[0] : '-') : item.lastMessage.from.split('@')[0]}
              </div>

              <span className="w-full truncate text-sm">{item.lastMessage.body}</span>
            </div>
          </div>

          <div className="ml-2 min-w-[45px] text-right text-xs text-gray-500">17:51</div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
